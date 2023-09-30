const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//Init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Init db
require("./db/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

//init routes
app.use("", require("./routes/index"));

//handle error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";

  return res.status(status).json({
    status: "error",
    code: status,
    message,
  });
});

module.exports = app;
