"use strict";

const mongoose = require("mongoose");
const cntString = "mongodb://192.168.1.42:27017/demo";
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
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

const database = Database.getInstance();
module.exports = database;
