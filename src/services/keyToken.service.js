"use strict";

const { Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static saveKeyToken = async ({
    userId,
    privateKey,
    publicKey,
    refreshToken,
  }) => {
    try {
      // const token = await keyTokenModel.create({
      //   user: userId,
      //   privateKey,
      //   publicKey,
      // });
      // return token ? token.publicKey : null;

      // Update key token

      const filter = { user: userId };
      const update = {
        privateKey,
        publicKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keyTokenModel
        .findOneAndUpdate(filter, update, options)
        .lean();

      return tokens ? tokens.publicKey : null;
    } catch (err) {
      return {
        status: "error",
        error: err.message,
      };
    }
  };

  static findByUserId = async (userId) =>
    await keyTokenModel.findOne({ user: userId }).lean();

  static deleteKeyToken = async (_id) =>
    await keyTokenModel.deleteOne({ _id: new Types.ObjectId(_id) }).lean();
}

module.exports = KeyTokenService;
