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

  //#region Find
  static findByUserId = async (userId) =>
    await keyTokenModel.findOne({ user: userId }).lean();

  static findByRefreshTokenUsed = async (refreshTokensUsed) =>
    await keyTokenModel.findOne({ refreshTokensUsed }).lean();

  static findByRefreshToke = async (refreshToken) =>
    await keyTokenModel.findOne({ refreshToken });

  //#endregion

  //#region Delete
  static deleteKeyToken = async (_id) =>
    await keyTokenModel.deleteOne({ _id: new Types.ObjectId(_id) }).lean();

  static deleteKeyTokenByUserId = async (userId) =>
    await keyTokenModel.deleteOne({ user: userId }).lean();

  static deleteToRenewerKeyToken = async (userId, refreshToken) => {
    console.log("userId::", userId);
    const filter = { user: userId };

    const update = {
      $push: { refreshTokensUsed: refreshToken },
      refreshToken: null,
      privateKey: null,
      publicKey: null,
    };

    const tokens = await keyTokenModel.findOneAndUpdate(filter, update).lean();

    return tokens ? true : false;
  };
  //#endregion
}

module.exports = KeyTokenService;
