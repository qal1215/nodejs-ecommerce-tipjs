"use strict";

const express = require("express");
const router = express.Router();

router.use("/v1/api", require("./access"));

// router.get("", (req, res, next) => {
//   const strCompress = "Hello fan tipJS";
//   return res.status(200).json({
//     message: "Welcome to qal",
//   });
// });

module.exports = router;
