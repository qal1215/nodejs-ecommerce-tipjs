"use strict";

const { findById } = require("../services/apikey.service");

const HEADER_NAME = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER_NAME.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error key",
      });
    }

    const objKey = await findById(key);

    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error obj key",
      });
    }

    req.objKey = objKey;

    return next();
  } catch (err) {
    return res.status(403).json({
      message: "Forbidden Error check auth",
      errorMessage: err.message,
    });
  }
};

const permissions = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permissions Denied",
      });
    }
    const hasPermission = req.objKey.permissions.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    return next();
  };
};

const asyncHandler = (fn) => (req, res, next) => {
  return fn(req, res, next).catch(next);
};

module.exports = {
  apiKey,
  permissions,
  asyncHandler,
};
