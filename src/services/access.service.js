"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData, getPrivateAndPublicKey } = require("../utils");
const {
  BadRequestError,
  UnauthorizedError,
} = require("../core/error.response");

// Service
const { findByEmail } = require("./shop.service");
const KeyTokenService = require("./keyToken.service");

const Roles = {
  SHOP: "shop",
  WRITER: "writer",
  EDITOR: "editor",
  ADMIN: "admin",
};

class AccessService {
  /*
    1. Check email is exist
    2. Check password is correct
    3. Create access token and refresh token
    4. Generate token and save
    5. Return token
  */
  static logIn = async ({ email, password, refreshToken = null }) => {
    try {
      const foundedShop = await findByEmail({ email });

      if (!foundedShop) {
        throw new BadRequestError("Email is not registered");
      }

      // Check password
      const isPasswordCorrect = bcrypt.compareSync(
        password,
        foundedShop.password
      );

      if (!isPasswordCorrect) {
        throw new UnauthorizedError("Password is incorrect");
      }

      // Generate public key and private key
      const { privateKey, publicKey } = getPrivateAndPublicKey();

      // Create token pair
      const tokens = await createTokenPair(
        { userId: foundedShop._id, email },
        publicKey,
        privateKey
      );

      await KeyTokenService.saveKeyToken({
        userId: foundedShop._id,
        privateKey,
        publicKey,
        refreshToken: tokens.refreshToken,
      });

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: foundedShop,
        }),
        tokens,
      };
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  };

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
      throw new BadRequestError("Create shop failed");
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
      const { privateKey, publicKey } = getPrivateAndPublicKey();

      // Save token to database
      const keyStore = await KeyTokenService.saveKeyToken({
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
        throw new BadRequestError(tokens.message);
      }

      console.log(`Create Tokens Success::`, tokens);

      //Return response with token
      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
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
