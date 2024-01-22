const express = require("express");
const router = express.Router();
const ContactList = require("../models/ContactList");

router.get("/", async (req, res) => {
  const contactListData = await ContactList.find({});
  res.render("index", { contactListData });
});

module.exports = router;
