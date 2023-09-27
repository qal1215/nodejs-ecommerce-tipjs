"use strict";
const mongoose = require("mongoose");

const {
  db: { host, port, name },
} = require("../configs/config.mongodb");
const cntString = `mongodb://${host}:${port}/${name}`;

console.log(cntString);
const { countConnect } = require("../helpers/check.connect");

class Database {
  constructor() {
    this._connect();
  }

  _connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
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
