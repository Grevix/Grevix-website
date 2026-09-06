const express = require('express');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 3000;

// Store confidential Excel outside public asset serving
const PRIVATE_DIR = path.join(__dirname, 'private_data');
if (!fs.existsSync(PRIVATE_DIR)) {
  fs.mkdirSync(PRIVATE_DIR, { recursive: true });
}
const EXCEL_PATH = path.join(PRIVATE_DIR, 'details.xlsx');

// Security Middleware 1: Strict File Shielding
// Completely block public HTTP access to confidential spreadsheets, environment files, and server scripts
app.use((req, res, next) => {
  const reqPath = req.path.toLowerCase();

  // Block any attempt to read Excel files, dotfiles, node modules, or raw server scripts
  if (
    reqPath.endsWith('.xlsx') ||
    reqPath.endsWith('.xls') ||
    reqPath.endsWith('.env') ||
    reqPath.includes('/private_data/') ||
    reqPath === '/server.js' ||
    reqPath === '/package.json' ||
    reqPath === '/package-lock.json' ||
    reqPath.startsWith('/.git')
  ) {
    console.warn(`[SECURITY BLOCKED] Unauthorized HTTP request attempt to private resource: ${req.path} from IP ${req.ip}`);
    return res.status(404).send('404 Not Found'); // Return 404 so attackers cannot even probe file existence
  }
  next();
});

// Middleware
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Serve static HTML/CSS/Assets safely
app.use(express.static(__dirname, {
  dotfiles: 'ignore',
  index: false
}));

// Route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms.html'));
});

// Helper: Sanitize string input to prevent XSS / CSV/Excel Formula Injection
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  let cleaned = str.trim();
  // Strip formula injection triggers if input starts with =, +, -, @
  if (/^[=+@-]/.test(cleaned)) {
    cleaned = "'" + cleaned;
  }
  return cleaned;
}

// Helper: Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper: Validate GitHub URL or handle
function isValidGithub(github) {
  return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/i.test(github) || /^[a-zA-Z0-9_-]+$/.test(github);
}

// Confidential Form Submission API Endpoint with Strict Validation & Security
app.post('/api/join-application', async (req, res) => {
  try {
    const { email, github, interest } = req.body;

    if (!email || !github || !interest) {
      return res.status(400).json({
        success: false,
        message: 'All fields (Email, GitHub Profile, Interest) are required.'
      });
    }

    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanGithub = sanitizeInput(github).toLowerCase().replace(/\/+$/, '');
    const cleanInterest = sanitizeInput(interest);

    // Validate email format
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Validate GitHub profile format
    if (!isValidGithub(cleanGithub)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid GitHub profile URL or username.'
      });
    }

    let workbook = new ExcelJS.Workbook();
    let worksheet;

    if (fs.existsSync(EXCEL_PATH)) {
      await workbook.xlsx.readFile(EXCEL_PATH);
      worksheet = workbook.getWorksheet('Applications') || workbook.worksheets[0];
    } else {
      worksheet = workbook.addWorksheet('Applications');
      
      // Define Columns
      worksheet.columns = [
        { header: 'S.No', key: 'sNo', width: 8 },
        { header: 'Date & Time', key: 'timestamp', width: 24 },
        { header: 'Email', key: 'email', width: 32 },
        { header: 'GitHub Profile URL', key: 'github', width: 42 },
        { header: 'Interest Area', key: 'interest', width: 35 },
        { header: 'Status', key: 'status', width: 15 }
      ];

      // Style Header Row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '111111' }
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 24;
    }

    // Ensure Column mapping
    worksheet.columns = [
      { header: 'S.No', key: 'sNo', width: 8 },
      { header: 'Date & Time', key: 'timestamp', width: 24 },
      { header: 'Email', key: 'email', width: 32 },
      { header: 'GitHub Profile URL', key: 'github', width: 42 },
      { header: 'Interest Area', key: 'interest', width: 35 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // Check for Duplicates in existing rows
    let duplicateEmailFound = false;
    let duplicateGithubFound = false;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const rawEmail = row.getCell(3).value || '';
      const rawGithub = row.getCell(4).value || '';

      const existingEmail = rawEmail.toString().trim().toLowerCase();
      const existingGithub = rawGithub.toString().trim().toLowerCase().replace(/\/+$/, '');

      if (existingEmail === cleanEmail) {
        duplicateEmailFound = true;
      }
      if (existingGithub === cleanGithub) {
        duplicateGithubFound = true;
      }
    });

    if (duplicateEmailFound) {
      return res.status(400).json({
        success: false,
        message: 'This email address has already submitted an application.'
      });
    }

    if (duplicateGithubFound) {
      return res.status(400).json({
        success: false,
        message: 'This GitHub profile URL has already submitted an application.'
      });
    }

    // Calculate S.No for new row
    const dataRowCount = worksheet.rowCount > 1 ? worksheet.rowCount : 1;
    const sNo = dataRowCount;
    const formattedTimestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    // Add Row Data
    const newRow = worksheet.addRow({
      sNo: sNo,
      timestamp: formattedTimestamp,
      email: cleanEmail,
      github: cleanGithub,
      interest: cleanInterest,
      status: 'Received'
    });

    // Style data row
    newRow.alignment = { vertical: 'middle', horizontal: 'left' };
    newRow.height = 20;

    // Save Workbook to Local File
    await workbook.xlsx.writeFile(EXCEL_PATH);

    console.log(`[${formattedTimestamp}] New Application Recorded Securely: ${cleanEmail}`);

    return res.json({
      success: true,
      message: 'Application submitted successfully! Our team will reach out within 14 days.'
    });

  } catch (err) {
    console.error('Error saving application to Excel:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while recording application.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`GREVIX website server running at http://localhost:${PORT}`);
  console.log(`Confidential form entries are stored locally at: ${EXCEL_PATH}`);
});
