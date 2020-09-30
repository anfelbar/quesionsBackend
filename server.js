#!/usr/bin/env node

// get dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(helmet());

// parse requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Adicionamos rutas de usuarios y preguntas
const rutas = require("./routes/routes");
app.use("/laspreguntas", rutas);

//Adicionamos rutas de admin
const rutasAdmin = require("./routes/admin.routes");
app.use("/admin", rutasAdmin);

// Configuring the database
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// default route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenidos a API de acreditacion" });
});

// 404 Error
app.use((req, res, next) => {
  //next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

const port = process.env.PORT || 8000;
// listen on port 3000
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  process.exit(1);
});
