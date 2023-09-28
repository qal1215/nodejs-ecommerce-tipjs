"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "48h",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    //Verify token
    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error(`Error token::`, err);
      } else {
        console.log(`Decoded token::`, decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (err) {
    return {
      code: "xx",
      message: err.message,
      status: "error",
    };
  }
};

module.exports = { createTokenPair };
