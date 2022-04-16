var mysql = require("mysql2");
var connection = mysql.createPool({
  host: process.env.mysqlHost,
  user: process.env.mysqlUser,
  password: process.env.mysqlPassword,
  database: process.env.mysqlDatabase,
  dateStrings: true
});

module.exports = connection;
