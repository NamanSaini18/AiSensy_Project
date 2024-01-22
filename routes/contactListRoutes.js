const express = require("express");
const router = express.Router();
const ContactList = require("../models/ContactList");

router.get("/", async (req, res) => {
  const contactListData = await ContactList.find({});

  const perPageOptions = [ 5, 10, 20 ]; // Options for entries per page
  const defaultPerPage = perPageOptions[ 0 ];

  let perPage = parseInt(req.query.perPage) || defaultPerPage;
  perPage = perPageOptions.includes(perPage) ? perPage : defaultPerPage;

  const page = parseInt(req.query.page) || 1;


  try {
    const totalItems = await ContactList.countDocuments();
    const totalPages = Math.ceil(totalItems / perPage);

    const items = await ContactList.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    const startIndex = (page - 1) * perPage + 1;
    const endIndex = Math.min(startIndex + perPage - 1, totalItems);

    res.render('index', {
      contactListData,
      items,
      totalPages,
      currentPage: page,
      perPage,
      perPageOptions,
      startIndex,
      endIndex,
      totalItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;