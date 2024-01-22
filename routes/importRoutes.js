const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const excel = require('exceljs');
const csv = require('csv-parser');
const ContactList = require("../models/ContactList");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


router.post('/upload', upload.single('file'), async (req, res) => {
  const fileBuffer = req.file.buffer;

  // Check the file type (Excel or CSV)
  if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    await parseExcel(fileBuffer);
  } else if (req.file.mimetype === 'text/csv') {
    await parseCSV(fileBuffer);
  } else {
    return res.status(400).send('Unsupported file type');
  }

  res.status(200).redirect("/");
});


// Function to parse Excel file
async function parseExcel(fileBuffer) {
  const workbook = new excel.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const sheet = workbook.getWorksheet(1); 
  console.log(sheet);
  sheet.eachRow(async (row, rowNumber) => {
    if (rowNumber !== 1) { // Skip header
      const rowData = row.values;

 
      await ContactList.create({
        name: rowData[ 1 ], 
        contactNumber: rowData[ 2 ],
        email: rowData[ 3 ],
        tags: rowData[ 4 ],
        source: rowData[ 5 ],
        // ... other fields
      });
    }
  });
}

// Function to parse CSV file
async function parseCSV(fileBuffer) {
  const results = [];

  await new Promise((resolve, reject) => {
    csv({ headers: true })
      .on('data', (data) => results.push(data))
      .on('end', () => resolve());
  }).write(fileBuffer);

  // Insert data into MongoDB
  await ContactList.insertMany(results);
}

module.exports = router;