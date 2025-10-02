// RefreshToken을 관리
// access token 짧게 쓰고 버리기 때문에 db저장 x
// column 도 refresh token 만 가지고 저장함!!

const pool = require("../configs/db");

//Refresh Token 저장 (있으면 업데이트, 없으면 생성)

exports.saveToken = async (user_id, refreshToken) => {
  const sql = `
    INSERT INTO AuthToken (user_id, refresh_token, expired_at, created_at, revoked)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), false)
    ON DUPLICATE KEY UPDATE 
      refresh_token = VALUES(refresh_token),
      expired_at = VALUES(expired_at),
      revoked = false
  `;
  await pool.query(sql, [user_id, refreshToken]);
};

// Refresh Token 조회 (재발급 시 사용)
exports.findToken = async (refreshToken) => {
  const [rows] = await pool.query(
    "SELECT * FROM AuthToken WHERE refresh_token = ? AND revoked = false",
    [refreshToken]
  );
  return rows[0]; // 유효한 토큰 있으면 반환
};

// Refresh Token 무효화 -> 로그아웃시 무효화 시키기
exports.revokeToken = async (refreshToken) => {
  const sql = `UPDATE AuthToken SET revoked = true WHERE refresh_token = ?`;
  await pool.query(sql, [refreshToken]);
};

// 회원 탈퇴시, 회원의 refreshtoken이 유효한 경우 삭제

exports.deleteTokenByUserId = async(userId) => {
  const sql = `DELETE FROM AuthToken WHERE user_id = ?`;
  const [result] = await pool.query(sql, [userId]);
  return result.affectedRows >0 ;
}