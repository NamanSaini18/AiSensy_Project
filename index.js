if (process.env.NODE_ENV != "prodcution") require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();

const PORT = process.env.PORT || 5000;

mongoose.
  connect(process.env.DB_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => console.log(err));

const contactListRouter = require("./routes/contactListRoutes");
const importRouter = require("./routes/importRoutes");
const downloadRouter = require("./routes/downloadRoutes");



app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));
app.use(express.static("public"));



app.use(contactListRouter);
app.use(importRouter);
app.use(downloadRouter);

app.listen(PORT, () => {
  console.log("Server is running at port " + PORT);
});