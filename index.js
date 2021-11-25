//setup paramétrage

const express = require("express");
const app = express();
const formidable = require("express-formidable");
app.use(formidable());
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/airbnb");

// importation des routes

const userRoutes = require("./routes/user");
app.use(userRoutes);

app.all("*", (req, res) => {
  res.status(404).json("page not found");
});

app.listen(3000, () => {
  console.log("serveur has started");
});
