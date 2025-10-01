// JWT 토큰 발급 / 관리 담당 서비스
// Access Token : 짧은 인증용
// Refresh Token : 긴 , 재발급용
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/tokenModel");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // 15분
  );
};

exports.generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { user_id: user.user_id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // 7일
  );

  // DB 저장
  await tokenModel.saveToken(user.user_id, refreshToken);
  return refreshToken;
};
