"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");

const Roles = {
  SHOP: "shop",
  WRITER: "writer",
  EDITOR: "editor",
  ADMIN: "admin",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // Check if email is already registered
      const holderShop = await shopModel.findOne({ email }).lean();

      console.log(`[P]::signUp::holderShop::`, holderShop);

      if (holderShop) {
        return {
          code: "xxxx",
          message: "Email already registered",
        };
      }

      const passwordHash = bcrypt.hashSync(password, 10);

      console.log(`[P]::signUp::passwordHash::`, passwordHash);

      // Create new shop
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [Roles.SHOP],
      });

      console.log(`[P]::signUp::newShop::`, newShop);

      if (!newShop) {
        return {
          code: 200,
          metadata: null,
        };
      } else {
        // Create token
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });

        console.log({ privateKey, publicKey }); //

        // Save token to database

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "Error creating public key",
          };
        }

        // Create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log(`Create Tokens Success::`, tokens);

        //Return response with token
        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      }
    } catch (err) {
      return {
        code: "xx",
        message: err.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
