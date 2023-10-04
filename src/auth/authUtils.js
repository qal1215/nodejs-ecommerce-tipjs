"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { HEADER_NAME } = require("../constant/header/headerName");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "1 minutes",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
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

/* Authentication
  1. Check userId missing
  2. Get access token from header
  3. Verify access token
  4. Check user in database
  5. Check keyStore with userId
  6. Ok => next()
  */
const authentication = asyncHandler(async (req, res, next) => {
  //#region Check HEADER
  const userId = req.headers[HEADER_NAME.CLIENT_ID];
  if (!userId) throw new UnauthorizedError("Missing userId");

  const accessToken = req.headers[HEADER_NAME.AUTHORIZATION];
  if (!accessToken) throw new UnauthorizedError("Missing access token");
  //#endregion End Check HEADER

  try {
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Missing keyStore");

    const { publicKey, privateKey, refreshToken } = keyStore;
    if (!publicKey || !privateKey || !refreshToken) {
      throw new UnauthorizedError("Log in first please");
    }

    const decoded = await JWT.verify(accessToken, keyStore.publicKey, {
      ignoreExpiration: true,
      allowInvalidAsymmetricKeyTypes: true,
    });

    if (decoded.userId !== userId)
      throw new UnauthorizedError("Invalid access token");

    if (decoded.exp < Date.now() / 1000) {
      if (req.body.refreshToken) {
        const decodedRefreshToken = await JWT.verify(
          req.body.refreshToken,
          keyStore.privateKey,
          {
            ignoreExpiration: true,
          }
        );
        if (decodedRefreshToken.exp < Date.now() / 1000)
          throw new UnauthorizedError("RefreshToken expired");
      } else {
        throw new UnauthorizedError("Token expired");
      }
    }

    req.keyStore = keyStore;

    return next();
  } catch (err) {
    throw new UnauthorizedError(err.message);
  }
});

const verifyRefreshToken = async (refreshToken, keySecret) =>
  await JWT.verify(refreshToken, keySecret);

module.exports = { createTokenPair, authentication, verifyRefreshToken };
