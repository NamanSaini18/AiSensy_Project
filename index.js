const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();

const PORT = 5000;

mongoose.
  connect("mongodb+srv://saininaman1103:8jNG5WEQ9zZwXywe@cluster0.vcll1jk.mongodb.net/")
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => console.log(err));

const contactListRouter = require("./routes/contactListRoutes");
const importRouter = require("./routes/importRoutes");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));
app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.use(contactListRouter);
app.use(importRouter);


app.listen(PORT, () => {
  console.log("Server is running at port " + PORT);
});