"use strict";

const apiKeyModel = require("../models/apikey.model");
const crypto = require("crypto");

const findById = async (key) => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

const generateKey = async () => {
  const keyString = crypto.randomBytes(64).toString("hex");
  const newKey = await apiKeyModel.create({
    key: keyString,
    permissions: ["000"],
  });
};

module.exports = {
  findById,
};
