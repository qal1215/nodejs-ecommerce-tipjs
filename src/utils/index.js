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

const removeUndefinedFields = (object) => {
  return _.pickBy(object, _.identity);
};

const updateNestedObjectParse = (object) => {
  console.log("[1]::", object);
  const final = {};
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (_.isNil(value)) return;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const nested = updateNestedObjectParse(value);
      Object.keys(nested).forEach((nestedKey) => {
        if (_.isNil(nested[nestedKey])) return;
        final[`${key}.${nestedKey}`] = nested[nestedKey];
      });
    } else {
      final[key] = value;
    }
  });

  console.log("[2]::", final);
  return final;
};

module.exports = {
  getInfoData,
  getPrivateAndPublicKey,
  getSelectData,
  removeUndefinedFields,
  updateNestedObjectParse,
};
