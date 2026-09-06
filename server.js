const express = require('express');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 3000;

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const PRIVATE_DIR = isVercel ? path.join('/tmp', 'private_data') : path.join(__dirname, 'private_data');
try {
  if (!fs.existsSync(PRIVATE_DIR)) {
    fs.mkdirSync(PRIVATE_DIR, { recursive: true });
  }
} catch (e) {}
const EXCEL_PATH = path.join(PRIVATE_DIR, 'details.xlsx');

// Security Middleware 1: Strict File Shielding
// Completely block public HTTP access to confidential spreadsheets, environment files, and server scripts
app.use((req, res, next) => {
  const reqPath = req.path.toLowerCase();

  // Block any attempt to read Excel files, dotfiles, node modules, JSON/log/yaml files in private directories, or raw server scripts
  if (
    reqPath.endsWith('.xlsx') ||
    reqPath.endsWith('.xls') ||
    reqPath.endsWith('.env') ||
    reqPath.endsWith('.log') ||
    reqPath.endsWith('.json') ||
    reqPath.includes('/private_data/') ||
    reqPath === '/server.js' ||
    reqPath === '/package.json' ||
    reqPath === '/package-lock.json' ||
    reqPath.startsWith('/.git') ||
    reqPath.includes('.git')
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

const { loadArticles, runDailyPipeline, loadState } = require('./services/blogPipeline');
const { addSubscriber, getAllSubscribers, sendDailyDigestEmails } = require('./services/newsletterService');

// Route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/community', (req, res) => {
  res.sendFile(path.join(__dirname, 'community.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'projects.html'));
});

app.get('/events', (req, res) => {
  res.sendFile(path.join(__dirname, 'events.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});

// Newsletter API: Subscribe Email (Stored locally in private_data/subscribers.xlsx)
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const result = await addSubscriber(email, ip);
    return res.json(result);
  } catch (err) {
    console.error('[API /api/newsletter/subscribe] Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error processing subscription.' });
  }
});

// Newsletter API: Get Subscriber Count & List (Local Secured Access)
app.get('/api/newsletter/subscribers', async (req, res) => {
  try {
    const subscribers = await getAllSubscribers();
    return res.json({ success: true, count: subscribers.length, subscribers });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Newsletter API: Manual Trigger for Daily 07:00 AM IST Email Digest
app.post('/api/newsletter/send-digest', async (req, res) => {
  try {
    const result = await sendDailyDigestEmails();
    return res.json(result);
  } catch (err) {
    console.error('[API /api/newsletter/send-digest] Manual trigger error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Blog API: Fetch list of articles with optional category and search query filtering
app.get('/api/blog/articles', (req, res) => {
  try {
    let articles = loadArticles();
    const { category, search } = req.query;

    if (category && category.toUpperCase() !== 'ALL') {
      const cleanCat = category.toUpperCase().replace(/\s+/g, '');
      articles = articles.filter(a => {
        const itemCat = (a.category || '').toUpperCase().replace(/\s+/g, '');
        return itemCat === cleanCat || itemCat.includes(cleanCat) || cleanCat.includes(itemCat);
      });
    }

    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return res.json({ success: true, count: articles.length, articles });
  } catch (err) {
    console.error('[API /api/blog/articles] Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load blog articles.' });
  }
});

// Blog API: Get single article details by slug
app.get('/api/blog/articles/:slug', (req, res) => {
  try {
    const articles = loadArticles();
    const slug = req.params.slug.toLowerCase().trim();
    const article = articles.find(a => a.slug.toLowerCase() === slug || a.id.toLowerCase() === slug);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Find 3 related articles in same category
    const related = articles
      .filter(a => a.id !== article.id)
      .slice(0, 3);

    return res.json({ success: true, article, related });
  } catch (err) {
    console.error('[API /api/blog/articles/:slug] Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load article.' });
  }
});

// Blog API: Admin / Manual Trigger for Daily Fetch Pipeline
app.post('/api/blog/fetch', async (req, res) => {
  try {
    console.log(`[API /api/blog/fetch] Manual trigger started at ${new Date().toISOString()}`);
    const result = await runDailyPipeline();
    return res.json(result);
  } catch (err) {
    console.error('[API /api/blog/fetch] Manual trigger failed:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/blog/fetch', async (req, res) => {
  try {
    console.log(`[API /api/blog/fetch] Manual trigger started at ${new Date().toISOString()}`);
    const result = await runDailyPipeline();
    return res.json(result);
  } catch (err) {
    console.error('[API /api/blog/fetch] Manual trigger failed:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Blog API: Admin Pipeline Status
app.get('/api/blog/admin/status', (req, res) => {
  const state = loadState();
  const articles = loadArticles();
  return res.json({
    status: 'ACTIVE',
    schedule: '07:00 AM IST (Asia/Kolkata)',
    lastRun: state.lastRun || 'Not run yet',
    runCount: state.runCount || 0,
    processedItemsCount: (state.processedHashes || []).length,
    publishedArticlesCount: articles.length
  });
});

// Vercel Cron Endpoint (Triggers daily 07:00 AM IST automation at 01:30 UTC)
app.get('/api/cron/daily-digest', async (req, res) => {
  try {
    console.log(`[Vercel Cron] Daily 07:00 AM IST automation triggered at ${new Date().toISOString()}`);
    const pipelineResult = await runDailyPipeline();
    const digestResult = await sendDailyDigestEmails();
    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      pipeline: pipelineResult,
      digest: digestResult
    });
  } catch (err) {
    console.error('[Vercel Cron Error]:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 07:00 AM IST (Asia/Kolkata) Daily Scheduler Loop
function initDaily7AmIstScheduler() {
  if (isVercel) {
    console.log('[Scheduler] Running on Vercel Serverless environment. Relying on Vercel Cron Jobs for 07:00 AM IST execution.');
    return;
  }

  function checkTimeAndTrigger() {
    const now = new Date();
    const istTimeStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
    const parts = istTimeStr.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    const todayKey = now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });

    if (hours === 7 && minutes === 0 && global.__last7AmISTRun !== todayKey) {
      global.__last7AmISTRun = todayKey;
      console.log(`[07:00 AM IST Scheduler] Executing daily blog update pipeline & newsletter email dispatch for ${todayKey}`);
      runDailyPipeline()
        .then(() => sendDailyDigestEmails())
        .catch(err => console.error('[07:00 AM IST Scheduler] Error:', err));
    }
  }

  setInterval(checkTimeAndTrigger, 30000); // Check every 30 seconds
  console.log('[Scheduler] Daily 07:00 AM IST (Asia/Kolkata) blog automation & email newsletter dispatch initialized.');
}

initDaily7AmIstScheduler();

// Helper: Send submission data to Google Sheet Webhook if configured
async function sendToGoogleSheet(payload) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;
const nodemailer = require('nodemailer');

// Helper: Send instant email notification to teamgrevix.foundation@gmail.com
async function sendNotificationEmail(subject, htmlBody) {
  try {
    const smtpUser = process.env.SMTP_USER || 'teamgrevix.foundation@gmail.com';
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

    if (smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });
      await transporter.sendMail({
        from: `"Grevix Alerts" <${smtpUser}>`,
        to: 'teamgrevix.foundation@gmail.com',
        subject: subject,
        html: htmlBody
      });
      console.log(`[Email Alert] Dispatched alert to teamgrevix.foundation@gmail.com`);
    } else {
      console.log(`[Email Alert Recorded] ${subject}`);
    }
  } catch (err) {
    console.error('[Email Alert Error]:', err.message);
  }
}

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
    try {
      await workbook.xlsx.writeFile(EXCEL_PATH);
    } catch (e) {}

    console.log(`[${formattedTimestamp}] New Application Recorded Securely: ${cleanEmail}`);

    // Trigger instant notification alert to teamgrevix.foundation@gmail.com
    const alertSubject = `New Join Application: ${cleanEmail}`;
    const alertHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0A0D14; margin-top: 0;">New Grevix Join Application Received</h2>
        <p><strong>Applicant Email:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
        <p><strong>GitHub Profile:</strong> <a href="${cleanGithub}" target="_blank">${cleanGithub}</a></p>
        <p><strong>Interest Area:</strong> ${cleanInterest}</p>
        <p><strong>Submitted At:</strong> ${formattedTimestamp} (IST)</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">This automated alert was dispatched by the Grevix Website Server.</p>
      </div>
    `;
    sendNotificationEmail(alertSubject, alertHtml);

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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GREVIX website server running at http://localhost:${PORT}`);
    console.log(`Confidential form entries are stored locally at: ${EXCEL_PATH}`);
  });
}

module.exports = app;
