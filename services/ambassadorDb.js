/**
 * Grevix Ambassador Database & Sequential Code Engine
 * Secure SQL storage (ambassadors.sqlite, ambassadors.sql, ambassadors.xlsx)
 * Accessible exclusively to authorized administrators.
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const PRIVATE_DIR = isVercel ? path.join('/tmp', 'private_data') : path.join(__dirname, '..', 'private_data');
const SQLITE_FILE = path.join(PRIVATE_DIR, 'ambassadors.sqlite');
const SQL_DUMP_FILE = path.join(PRIVATE_DIR, 'ambassadors.sql');
const JSON_BACKUP_FILE = path.join(PRIVATE_DIR, 'ambassadors.json');
const EXCEL_FILE = path.join(PRIVATE_DIR, 'ambassadors.xlsx');

// Ensure private directory exists safely
try {
  if (!fs.existsSync(PRIVATE_DIR)) {
    fs.mkdirSync(PRIVATE_DIR, { recursive: true });
  }
} catch (e) {}

// Initialize SQLite Database instance
let db = null;
let useSqlite = false;

try {
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(SQLITE_FILE);
  useSqlite = true;

  // Create table and indices
  db.exec(`
    CREATE TABLE IF NOT EXISTS ambassadors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL,
      ip TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_amb_email ON ambassadors(email);
    CREATE INDEX IF NOT EXISTS idx_amb_code ON ambassadors(code);
  `);
  console.log('[AmbassadorDB] Native SQLite database active at:', SQLITE_FILE);
} catch (err) {
  console.warn('[AmbassadorDB] Native SQLite not available, using high-reliability SQL file fallback:', err.message);
}

// Initialize raw SQL script log
try {
  if (!fs.existsSync(SQL_DUMP_FILE)) {
    const initSqlHeader = `-- Grevix Ambassador SQL Ledger
-- Schema: ambassadors(id, code, name, email, created_at, ip)
CREATE TABLE IF NOT EXISTS ambassadors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  ip TEXT
);

`;
    fs.writeFileSync(SQL_DUMP_FILE, initSqlHeader, 'utf-8');
  }
} catch (e) {}

// Fallback JSON in-memory cache loader
function loadJsonFallback() {
  try {
    if (fs.existsSync(JSON_BACKUP_FILE)) {
      return JSON.parse(fs.readFileSync(JSON_BACKUP_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function saveJsonFallback(data) {
  try {
    fs.writeFileSync(JSON_BACKUP_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}

// Helper: Escape SQL string values
function escapeSqlString(str) {
  return String(str || '').replace(/'/g, "''");
}

/**
 * Sync registered ambassador to Excel workbook for owner audit
 */
async function syncToExcel(record) {
  try {
    const workbook = new ExcelJS.Workbook();
    if (fs.existsSync(EXCEL_FILE)) {
      await workbook.xlsx.readFile(EXCEL_FILE);
    }

    let worksheet = workbook.getWorksheet('Ambassadors');
    if (!worksheet) {
      worksheet = workbook.addWorksheet('Ambassadors');
      worksheet.columns = [
        { header: 'S.No', key: 'sNo', width: 8 },
        { header: 'Ambassador Code', key: 'code', width: 20 },
        { header: 'Full Name', key: 'name', width: 30 },
        { header: 'Gmail / Email', key: 'email', width: 35 },
        { header: 'Date & Time (IST)', key: 'createdAt', width: 26 },
        { header: 'IP Address', key: 'ip', width: 18 }
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0F172A' }
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 24;
    }

    const rowCount = worksheet.rowCount > 1 ? worksheet.rowCount : 1;
    worksheet.addRow({
      sNo: rowCount,
      code: record.code,
      name: record.name,
      email: record.email,
      createdAt: record.created_at,
      ip: record.ip
    });

    await workbook.xlsx.writeFile(EXCEL_FILE);
  } catch (err) {
    console.warn('[AmbassadorDB] Excel sync warning:', err.message);
  }
}

/**
 * Generate or Retrieve Ambassador Code
 * Format: GRVX001, GRVX002, GRVX003, ...
 */
async function getOrGenerateCode(rawName, rawEmail, ip = '127.0.0.1') {
  const name = String(rawName || '').trim();
  const email = String(rawEmail || '').trim().toLowerCase();

  if (!name || name.length < 2) {
    throw new Error('Please enter your full name (minimum 2 characters).');
  }

  // Email format validation (accepts Gmail and all valid domains)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid Gmail or Email address.');
  }

  const nowIst = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium'
  });

  if (useSqlite && db) {
    // 1. Check if email already registered
    const findStmt = db.prepare('SELECT * FROM ambassadors WHERE email = ?');
    const existing = findStmt.get(email);

    if (existing) {
      return {
        success: true,
        code: existing.code,
        alreadyRegistered: true,
        name: existing.name
      };
    }

    // 2. Count existing records to generate next sequential GRVX code
    const countStmt = db.prepare('SELECT COUNT(*) as total FROM ambassadors');
    const countRow = countStmt.get();
    let nextSeq = (countRow ? Number(countRow.total) : 0) + 1;

    // Check collision safety
    const checkCodeStmt = db.prepare('SELECT id FROM ambassadors WHERE code = ?');
    let generatedCode = 'GRVX' + String(nextSeq).padStart(3, '0');

    while (checkCodeStmt.get(generatedCode)) {
      nextSeq++;
      generatedCode = 'GRVX' + String(nextSeq).padStart(3, '0');
    }

    // 3. Insert into SQLite table
    const insertStmt = db.prepare(`
      INSERT INTO ambassadors (code, name, email, created_at, ip)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertStmt.run(generatedCode, name, email, nowIst, ip);

    // 4. Append to SQL script audit log
    const sqlInsertStatement = `INSERT INTO ambassadors (code, name, email, created_at, ip) VALUES ('${generatedCode}', '${escapeSqlString(name)}', '${escapeSqlString(email)}', '${nowIst}', '${escapeSqlString(ip)}');\n`;
    try {
      fs.appendFileSync(SQL_DUMP_FILE, sqlInsertStatement, 'utf-8');
    } catch (e) {}

    // 5. Background sync to Excel
    syncToExcel({ code: generatedCode, name, email, created_at: nowIst, ip }).catch(() => {});

    console.log(`[AmbassadorDB] New Ambassador Code Generated: ${generatedCode} for ${name} (${email})`);

    return {
      success: true,
      code: generatedCode,
      alreadyRegistered: false,
      name
    };

  } else {
    // Fallback in-memory and SQL-file mechanism
    const data = loadJsonFallback();
    const existing = data.find(item => item.email === email);

    if (existing) {
      return {
        success: true,
        code: existing.code,
        alreadyRegistered: true,
        name: existing.name
      };
    }

    let nextSeq = data.length + 1;
    let generatedCode = 'GRVX' + String(nextSeq).padStart(3, '0');

    while (data.some(item => item.code === generatedCode)) {
      nextSeq++;
      generatedCode = 'GRVX' + String(nextSeq).padStart(3, '0');
    }

    const record = {
      id: nextSeq,
      code: generatedCode,
      name,
      email,
      created_at: nowIst,
      ip
    };

    data.push(record);
    saveJsonFallback(data);

    // Append to SQL file
    const sqlInsertStatement = `INSERT INTO ambassadors (code, name, email, created_at, ip) VALUES ('${generatedCode}', '${escapeSqlString(name)}', '${escapeSqlString(email)}', '${nowIst}', '${escapeSqlString(ip)}');\n`;
    try {
      fs.appendFileSync(SQL_DUMP_FILE, sqlInsertStatement, 'utf-8');
    } catch (e) {}

    syncToExcel(record).catch(() => {});

    console.log(`[AmbassadorDB Fallback] Generated: ${generatedCode} for ${name}`);

    return {
      success: true,
      code: generatedCode,
      alreadyRegistered: false,
      name
    };
  }
}

/**
 * Admin Only: Fetch all ambassadors securely
 */
function getAllAmbassadors() {
  if (useSqlite && db) {
    const stmt = db.prepare('SELECT id, code, name, email, created_at, ip FROM ambassadors ORDER BY id ASC');
    return stmt.all();
  }
  return loadJsonFallback();
}

/**
 * Admin Only: Fetch raw SQL dump content
 */
function getSqlDumpContent() {
  if (fs.existsSync(SQL_DUMP_FILE)) {
    return fs.readFileSync(SQL_DUMP_FILE, 'utf-8');
  }
  return '-- No SQL dump file found';
}

module.exports = {
  getOrGenerateCode,
  getAllAmbassadors,
  getSqlDumpContent,
  SQLITE_FILE,
  SQL_DUMP_FILE,
  EXCEL_FILE
};
