const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//Init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//Init db

//init routes
app.get("/", (req, res, next) => {
  const strCompress = "Hello fan tipJS";
  return res.status(200).json({
    message: "Welcome to qal",
    metadata: strCompress.repeat(100000),
  });
});

//handle error

module.exports = app;
