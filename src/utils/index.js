"use strict";

const _ = require("lodash");
const crypto = require("crypto");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getPrivateAndPublicKey = () => {
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");
  return {
    privateKey,
    publicKey,
  };
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

module.exports = {
  getInfoData,
  getPrivateAndPublicKey,
  getSelectData,
};
