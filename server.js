const express = require('express');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 3000;
const EXCEL_PATH = path.join(__dirname, 'details.xlsx');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Serve main home page on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Confidential Form Submission API Endpoint
app.post('/api/join-application', async (req, res) => {
  try {
    const { email, github, interest } = req.body;

    if (!email || !github || !interest) {
      return res.status(400).json({
        success: false,
        message: 'All fields (Email, GitHub Profile, Interest) are required.'
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
        { header: 'Date & Time', key: 'timestamp', width: 22 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'GitHub Profile URL', key: 'github', width: 40 },
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

    // Determine S.No
    const rowCount = worksheet.rowCount;
    const sNo = rowCount > 1 ? rowCount : 1;
    const formattedTimestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    // Add Row Data
    const newRow = worksheet.addRow({
      sNo: sNo,
      timestamp: formattedTimestamp,
      email: email.trim(),
      github: github.trim(),
      interest: interest.trim(),
      status: 'Received'
    });

    // Style data row
    newRow.alignment = { vertical: 'middle', horizontal: 'left' };
    newRow.height = 20;

    // Save Workbook to Local File
    await workbook.xlsx.writeFile(EXCEL_PATH);

    console.log(`[${formattedTimestamp}] New Application Saved: ${email} (${github})`);

    return res.json({
      success: true,
      message: 'Application submitted successfully! Our team will reach out within 14 days.'
    });

  } catch (err) {
    console.error('Error saving application to details.xlsx:', err);
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
