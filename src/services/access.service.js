"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

const Roles = {
  SHOP: "shop",
  WRITER: "writer",
  EDITOR: "editor",
  ADMIN: "admin",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
    // Check if email is already registered
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError("Email is already registered");
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    // Create new shop
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [Roles.SHOP],
    });

    if (!newShop) {
      return {
        code: 200,
        metadata: null,
      };
    } else {
      // Create token
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      //Private key & Public key more basic
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      // Save token to database
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        privateKey,
        publicKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Create key token failed");
      }

      // Create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      if (tokens.status === "error") {
        return {
          code: "xxxx",
          message: tokens.message,
        };
      }

      console.log(`Create Tokens Success::`, tokens);

      //Return response with token
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    // } catch (err) {
    //   return {
    //     code: "xx",
    //     message: err.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;
