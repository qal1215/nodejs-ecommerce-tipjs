"use strict";
const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");

const cntString = `mongodb://${host}:${port}/${name}`;
console.log(cntString);

const process = require("process");

class Database {
  constructor() {
    this._connect();
  }

  _connect(type = "mongodb") {
    const env = process.env.NODE_ENV || "dev";

    if (env === "dev") {
      mongoose.set("debug", { color: true, shell: true });
    }

    mongoose
      .connect(cntString, {
        maxPoolSize: 50,
      })
      .then(() => {
        countConnect();
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const database = Database.getInstance();
module.exports = database;
