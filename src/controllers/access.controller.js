"use strict";

const AccessService = require("../services/access.service");

const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class AccessController {
  /* 

  */

  logIn = async (req, res, next) => {
    new OK({
      message: "User logged in successfully",
      metaData: await AccessService.logIn(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "User created successfully",
      metaData: {
        user: await AccessService.signUp(req.body),
      },
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
