// 실제 sql을 실행하는 db layer
const pool = require ("../configs/db");

// email 중복체크

exports.findByEmail = async(email) => {
    const [rows]= await pool.query ("SELECT * FROM User WHERE email = ?", [email]);
    return rows[0];
};


// 닉네임 중복체크

exports.findByName = async(name) => {
    const [rows] = await pool.query ("SELECT * FROM User WHERE name = ?", [name]);
    return rows[0];
};


// 회원가입 (유저 insert)
exports.createUser = async ({name,email,password}) => {
    const sql= `INSERT INTO User (name, email, password, created_at, updated_at)
VALUES (?, ?, ?, NOW(), NOW())
`;

    const[result] = await pool.query(sql,[name,email,password]);
    return result;
}

// 본인의 정보 조회

exports.findById = async (user_id) => {
  const [rows] = await pool.query(
    "SELECT user_id, name, email, created_at, updated_at FROM User WHERE user_id = ?",
    [user_id]
  );
  return rows[0];
};

// 닉네임 업데이트
exports.updateUserName = async (user_id, name) => {
  const sql = `UPDATE User SET name = ?, updated_at = NOW() WHERE user_id = ?`;
  const [result] = await pool.query(sql, [name, user_id]);
  return result.affectedRows > 0;
};


// 회원 탈퇴
exports.deleteUser = async (user_id) => {
  const [result] = await pool.query("DELETE FROM User WHERE user_id = ?", [user_id]);
  return result.affectedRows > 0;
};