"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, privateKey, publicKey }) => {
    try {
      // const publicKeyString = publicKey.toString();

      const token = await keyTokenModel.create({
        user: userId,
        privateKey,
        publicKey,
      });

      return token ? token.publicKey : null;
    } catch (err) {
      return {
        code: "xx",
        message: err.message,
        status: "error",
      };
    }
  };
}

module.exports = KeyTokenService;
