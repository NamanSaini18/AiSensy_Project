const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const excel = require('exceljs');
const fs = require("fs");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ContactList = require("../models/ContactList");


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.get('/download/excel', async (req, res) => {
  try {
    const contacts = await ContactList.find();

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Contacts');

    worksheet.addRow([ 'Name', 'Contact Number', 'Email', 'Tags', 'Source' ]);

    contacts.forEach(contact => {
      worksheet.addRow([ contact.name, contact.contactNumber, contact.email, contact.tags, contact.source ]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/download/csv', async (req, res) => {
  try {
    const contacts = await ContactList.find();

    const csvWriter = createCsvWriter({
      path: 'contacts.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'contactno', title: 'Contact Number' },
        { id: 'email', title: 'Email' },
        { id: 'tags', title: 'Tags' },
        { id: 'source', title: 'Source' },
      ],
    });

    await csvWriter.writeRecords(contacts);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');

    const fileStream = fs.createReadStream('contacts.csv');
    fileStream.pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;