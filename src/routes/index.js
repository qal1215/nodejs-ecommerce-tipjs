"use strict";

const express = require("express");
const { apiKey, permissions } = require("../auth/checkAuth");
const { generateApiKey } = require("../services/apikey.service");
const router = express.Router();

router.get("/v1/api/getApiKey", (req, res) =>
  generateApiKey().then(res.send("ok"))
);

// Check api key
router.use(apiKey);
// Check permissions
router.use(permissions("000"));

router.use("/v1/api", require("./access"));

module.exports = router;
