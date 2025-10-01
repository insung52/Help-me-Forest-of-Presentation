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


// 회원가입 (유저 insert )
exports.createUser = async ({name,email,password,school,age}) => {
    const sql= `INSERT INTO User (name,email,password, school,age, created_at, updated_at)
    VALUES (?,?,?,?,?,NOW(),NOW())`;

    const[result] = await pool.query(sql,[name,email,password,school,age]);
    return result;
}