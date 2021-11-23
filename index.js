const express = require("express");
const app = express();
const formidable = require("express-formidable");
app.use(formidable());
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/airbnb");

app.get("/", (req, res) => {
  res.status(200).json("hello the world");
});

app.all("*", (req, res) => {
  res.status(404).json("page not found");
});

app.listen(3000, () => {
  console.log("serveur has started");
});
