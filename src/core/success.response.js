"use strict";

const {
  StatusCodes,
  ReasonPhrases,
} = require("../constant/httpStatusCode/httpStatusCode");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metaData = {},
    options = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metaData = metaData;
    this.options = options;
  }

  send(res, header = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metaData }) {
    super({
      message,
      metaData,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, metaData, options }) {
    super({
      message,
      statusCode: StatusCodes.CREATED,
      reasonStatusCode: ReasonPhrases.CREATED,
      metaData,
      options,
    });
  }
}

module.exports = {
  SuccessResponse,
  OK,
  CREATED,
};
