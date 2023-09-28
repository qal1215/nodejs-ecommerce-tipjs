"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

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

      // console.log(`[P]::signUp::holderShop::`, holderShop);

      if (holderShop) {
        return {
          code: "xxxx",
          message: "Email already registered",
        };
      }

      const passwordHash = bcrypt.hashSync(password, 10);

      // console.log(`[P]::signUp::passwordHash::`, passwordHash);

      // Create new shop
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [Roles.SHOP],
      });

      // console.log(`[P]::signUp::newShop::`, newShop);

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

        // console.log({ privateKey, publicKey }); //
        // console.log(`[P]::signUp::privateKey::`, privateKey);
        // console.log(`[P]::signUp::publicKey::`, publicKey);

        // Save token to database
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          privateKey,
          publicKey,
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "Key store error",
          };
        }

        // Check if token is saved
        // console.log(`[P]::signUp::publicKeyString::`, publicKeyString);
        // const publicKeyObject = crypto.createPublicKey(publicKeyString);
        // console.log(`[P]::signUp::publicKeyObject::`, publicKeyObject);

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
