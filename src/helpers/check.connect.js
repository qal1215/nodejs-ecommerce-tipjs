"use strict";

const mogoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;

// count connection
const countConnect = () => {
  const numConnection = mogoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mogoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024; // MB
    //maximum number of connections = number of cores * 2
    const maxNumConnection = numCores * 2;

    console.log(`Number of cores: ${numCores}`);
    console.log(`Memory usage: ${memoryUsage} MB`);
    console.log(`Active connections: ${numConnection}`);

    if (numConnection > maxNumConnection) {
      console.log(`Connection overload: ${numConnection} MB`);
    }

    if (numConnection > 100) {
      console.log(`Overload connection: ${numConnection}`);
    }
  }, _SECOND); // monitor every 5s
};

module.exports = {
  countConnect,
  checkOverload,
};
