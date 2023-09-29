"use strict";

const express = require("express");
const { apiKey, permissions } = require("../auth/checkAuth");
const router = express.Router();

// Check api key
router.use(apiKey);
// Check permissions
router.use(permissions("000"));

router.use("/v1/api", require("./access"));

module.exports = router;
