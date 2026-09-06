/**
 * Grevix Newsletter & Automated Email Service
 * Handles Excel subscriber storage (subscribers.xlsx) and 07:00 AM IST daily email dispatches.
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const { loadArticles } = require('./blogPipeline');

const PRIVATE_DIR = path.join(__dirname, '..', 'private_data');
const EXCEL_FILE = path.join(PRIVATE_DIR, 'subscribers.xlsx');
const JSON_FILE = path.join(PRIVATE_DIR, 'subscribers.json');
const EMAIL_LOG_FILE = path.join(PRIVATE_DIR, 'email_digest_logs.log');

// Ensure private directory exists
if (!fs.existsSync(PRIVATE_DIR)) {
  fs.mkdirSync(PRIVATE_DIR, { recursive: true });
}

/**
 * Initialize Excel workbook if it doesn't exist
 */
async function initSubscribersExcel() {
  if (!fs.existsSync(EXCEL_FILE)) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Subscribers');
    sheet.columns = [
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Subscribed At', key: 'subscribedAt', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Origin IP', key: 'ip', width: 20 }
    ];

    // Style Header Row
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0A0D14' }
    };

    await workbook.xlsx.writeFile(EXCEL_FILE);
    console.log('[Newsletter Service] Created secured local subscribers.xlsx');
  }
}

/**
 * Add a new subscriber email to subscribers.xlsx & subscribers.json
 */
async function addSubscriber(email, ip = '127.0.0.1') {
  const normEmail = (email || '').toLowerCase().trim();
  if (!normEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  await initSubscribersExcel();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EXCEL_FILE);
  const sheet = workbook.getWorksheet('Subscribers');

  // Check for duplicate email
  let duplicate = false;
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const cellValue = (row.getCell(1).value || '').toString().toLowerCase().trim();
      if (cellValue === normEmail) {
        duplicate = true;
      }
    }
  });

  if (duplicate) {
    return { success: true, message: 'You are already subscribed to the daily Grevix digest!', isNew: false };
  }

  const nowIso = new Date().toISOString();

  // Append row in Excel
  sheet.addRow({
    email: normEmail,
    subscribedAt: nowIso,
    status: 'ACTIVE',
    ip: ip
  });

  await workbook.xlsx.writeFile(EXCEL_FILE);

  // Sync JSON backup
  let jsonSubscribers = [];
  try {
    if (fs.existsSync(JSON_FILE)) {
      jsonSubscribers = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    }
  } catch (err) {
    jsonSubscribers = [];
  }

  if (!jsonSubscribers.some(s => s.email === normEmail)) {
    jsonSubscribers.push({ email: normEmail, subscribedAt: nowIso, status: 'ACTIVE', ip: ip });
    fs.writeFileSync(JSON_FILE, JSON.stringify(jsonSubscribers, null, 2), 'utf8');
  }

  console.log(`[Newsletter Service] Successfully added subscriber: ${normEmail} to local Excel file.`);
  return { success: true, message: 'Thank you for subscribing! You will receive daily AI & Tech digests at 7:00 AM IST.', isNew: true };
}

/**
 * Get all active subscribers
 */
async function getAllSubscribers() {
  await initSubscribersExcel();
  const subscribersSet = new Set();

  // Try reading JSON backup
  try {
    if (fs.existsSync(JSON_FILE)) {
      const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.email && item.status !== 'UNSUBSCRIBED') {
            subscribersSet.add(item.email.toLowerCase().trim());
          }
        });
      }
    }
  } catch (e) {}

  // Try reading Excel file
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);
    const sheet = workbook.getWorksheet('Subscribers');
    if (sheet) {
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const email = (row.getCell(1).value || '').toString().toLowerCase().trim();
          const status = (row.getCell(3).value || '').toString().trim();
          if (email && email.includes('@') && status !== 'UNSUBSCRIBED') {
            subscribersSet.add(email);
          }
        }
      });
    }
  } catch (err) {
    console.error('[Newsletter Service] Error reading subscribers.xlsx:', err.message);
  }

  return Array.from(subscribersSet);
}

/**
 * Build HTML Email Template for Daily 7:00 AM IST Digest
 */
function buildDailyDigestHtml(articles) {
  const topArticles = articles.slice(0, 3);
  const baseUrl = process.env.SITE_URL || 'https://grevix.org';

  const cardsHtml = topArticles.map((art, idx) => `
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
      <div style="font-size: 11px; font-weight: 700; color: #3B82F6; letter-spacing: 1px; text-transform: uppercase;">
        0${idx + 1} // ${art.category || 'TECH'} &nbsp;&bull;&nbsp; ${art.readingTime || '5 MIN READ'}
      </div>
      <a href="${baseUrl}/blog.html?slug=${art.slug || ''}" style="font-size: 16px; font-weight: 800; margin: 10px 0; color: #0F172A; text-decoration: none; display: block; font-family: 'Inter', sans-serif;">
        ${art.title}
      </a>
      <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 14px;">
        ${art.excerpt}
      </p>
      <a href="${baseUrl}/blog.html?slug=${art.slug || ''}" style="font-size: 12px; font-weight: 700; color: #0F172A; text-decoration: underline;">
        Read Full Article &rarr;
      </a>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grevix Daily AI & Tech Digest</title>
</head>
<body style="font-family: 'JetBrains Mono', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F2F2F0; color: #111111; margin: 0; padding: 24px;">
  <div style="max-width: 640px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #D4D4D4; padding: 32px; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="border-bottom: 2px solid #000000; padding-bottom: 16px; margin-bottom: 24px;">
      <div style="font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #000000; font-family: 'Inter', sans-serif;">GREVIX</div>
      <div style="font-size: 10px; color: #666666; letter-spacing: 1.5px; margin-top: 4px;">STUDENT DRIVEN. IMPACT FOCUSED.</div>
    </div>

    <!-- Greeting -->
    <div style="font-size: 15px; color: #1E293B; line-height: 1.6; margin-bottom: 24px;">
      <strong>Get updated with today's tech & AI news!</strong><br>
      Here are today's top 3 featured research papers, AI breakthroughs, and software engineering articles curated automatically by the Grevix daily content pipeline at 7:00 AM IST:
    </div>

    <!-- 3 Featured Articles -->
    ${cardsHtml}

    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0 24px 0;">
      <a href="${baseUrl}/blog.html" style="display: inline-block; background-color: #0A0D14; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; font-size: 13px; font-weight: 700; border-radius: 20px; letter-spacing: 1px;">
        EXPLORE ALL ARTICLES ON GREVIX BLOG &#8599;
      </a>
    </div>

    <!-- Sign-off & Footer -->
    <div style="border-top: 1px solid #E2E8F0; padding-top: 20px; font-size: 13px; color: #475569; line-height: 1.6;">
      <p style="margin: 0 0 12px 0;">
        Best regards,<br>
        <strong style="color: #0F172A;">Grevix Team</strong>
      </p>
      <p style="font-size: 11px; color: #94A3B8; margin: 0; line-height: 1.4;">
        You received this automated daily digest because your email is subscribed on the Grevix website. All subscriber data is stored in secured local storage.
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

/**
 * Automated 07:00 AM IST Email Dispatcher
 */
async function sendDailyDigestEmails() {
  console.log(`[${new Date().toISOString()}] [Newsletter Service] Executing daily 07:00 AM IST email digest dispatch...`);
  const subscribers = await getAllSubscribers();
  const articles = loadArticles();

  if (subscribers.length === 0) {
    console.log('[Newsletter Service] 0 subscribers found in subscribers.xlsx. Skipping email dispatch.');
    return { success: true, subscribersCount: 0, sentCount: 0 };
  }

  const htmlContent = buildDailyDigestHtml(articles);
  const subject = `Grevix Daily Digest: Top 3 Tech & AI Updates for ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  // Check SMTP configuration
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER;

  let transporter;
  if (hasSmtp) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  let sentCount = 0;
  const logEntries = [];

  for (const email of subscribers) {
    if (hasSmtp && transporter) {
      try {
        await transporter.sendMail({
          from: `"Grevix Daily Digest" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: email,
          subject: subject,
          html: htmlContent
        });
        sentCount++;
        logEntries.push(`[${new Date().toISOString()}] DISPATCHED SMTP -> ${email}`);
      } catch (err) {
        console.error(`[Newsletter Service] Failed sending to ${email}:`, err.message);
        logEntries.push(`[${new Date().toISOString()}] ERROR SMTP -> ${email}: ${err.message}`);
      }
    } else {
      // Local Simulated Dispatch Mode (Logs sent email details cleanly)
      sentCount++;
      logEntries.push(`[${new Date().toISOString()}] DISPATCHED SIMULATED (Local Secured Mode) -> ${email}`);
    }
  }

  // Save log entry
  const logSummary = `\n=== DAILY DIGEST DISPATCH AT 07:00 AM IST (${new Date().toISOString()}) ===\nSubscribers: ${subscribers.length} | Sent: ${sentCount} | Mode: ${hasSmtp ? 'SMTP' : 'Local Secured Logger'}\n${logEntries.join('\n')}\n`;
  fs.appendFileSync(EMAIL_LOG_FILE, logSummary, 'utf8');

  console.log(`[Newsletter Service] Daily email digest completed! Dispatched to ${sentCount}/${subscribers.length} subscribers.`);
  return {
    success: true,
    subscribersCount: subscribers.length,
    sentCount: sentCount,
    mode: hasSmtp ? 'SMTP' : 'Local Secured Logger'
  };
}

module.exports = {
  initSubscribersExcel,
  addSubscriber,
  getAllSubscribers,
  sendDailyDigestEmails
};
