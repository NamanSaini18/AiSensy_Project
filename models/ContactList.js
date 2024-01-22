const mongoose = require("mongoose");

const contactListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactNumber: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  tags: {
    type: [ String ],
    default: []
  },
  source: {
    type: String,
    required: true
  }
});

const ContactList = mongoose.model('ContactList', contactListSchema);

module.exports = ContactList;

// Vdo5zzz1NY7jRTlm
// ruhela7777