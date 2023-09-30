"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { handlerAsync } = require("../../auth/checkAuth");
const router = express.Router();

//signup
router.post("/shop/signup", handlerAsync(accessController.signUp));

module.exports = router;
