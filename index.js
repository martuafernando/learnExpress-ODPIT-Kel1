const express = require("express");
// const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const path = require('path');
const logger = require('./middlewares/utils/logger');
// const upload = require('./middlewares/fileUpload');

// our routes
const indexRouter = require("./routes/index");
const morganStream = require("./middlewares/utils/morganStream");

// Setup Express
const app = express();

// for body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

//cors middleware
app.use(cors());

// morgan logger for dev
app.use(morgan("dev", { stream: morganStream }));


// Database Setup
const dbURI = process.env.DB_URI;

// mongoose.connect(dbURI);

// //test database connection
// let db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//   logger.info("Database connected succefully...");
// });

// Set up our main routes
app.use("/api", indexRouter);
// app.use("/api/category", categoryRouter);

// Middleware to serve static files (for download)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// if the request passes all the middleware without a response
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// for general error handling
app.use((error, req, res, next) => {
  logger.error(error)
  res.status(error.status || 500).json({
    message: error.response
  });
});

// App's connection port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server is connected on port ${PORT}`);
});
