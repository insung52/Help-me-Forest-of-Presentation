const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "비밀번호",
  database: process.env.DB_NAME || "presentation_feedback",
});

module.exports = pool;
