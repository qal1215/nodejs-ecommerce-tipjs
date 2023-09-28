"use strict";

//lv 0
// const config = {
//   app: {
//     port: 3030,
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "test",
//   },
// };

//lv 1

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3030,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "shopDev",
    user: process.env.DEV_DB_USER || "root",
    pass: process.env.DEV_DB_PASS || "root",
  },
};

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 3030,
  },
  db: {
    host: process.env.PROD_DB_HOST || "localhost",
    port: process.env.PROD_DB_PORT || 27017,
    name: process.env.PROD_DB_NAME || "testProd",
    user: process.env.PROD_DB_USER || "root",
    pass: process.env.PROD_DB_PASS || "root",
  },
};

const config = { dev, prod };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
