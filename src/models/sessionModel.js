const pool = require("../configs/db");

exports.findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM Session ORDER BY created_at DESC");
  return rows;
};

exports.insert = async ({ user_id, subject, topic, script, time_limit, mode }) => {
  const sql = `
    INSERT INTO Session (user_id, subject, topic, script, time_limit, mode, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'ongoing', NOW())
  `;
  const [result] = await pool.query(sql, [user_id, subject, topic, script, time_limit, mode]);
  return result.insertId;
};


// routes/ : url 만 정의
// controllers/ : 요청 받고 응답처리
// services/ : 규칙/로직
// models/ : DB접근만 담당