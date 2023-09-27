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
//Init db
//Init db
//Init db
require("./db/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");
checkOverload();

//init routes
app.get("/", (req, res, next) => {
  const strCompress = "Hello fan tipJS";
  return res.status(200).json({
    message: "Welcome to qal",
  });
});

//handle error

module.exports = app;
