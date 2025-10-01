// 인증 요청 처리
// authController.js
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const authService = require("../services/authService");
const tokenModel = require("../models/tokenModel");

//  로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 유저 찾기
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    // Access / Refresh Token 발급
    const accessToken = authService.generateAccessToken(user);
    const refreshToken = await authService.generateRefreshToken(user);

    return res.json({
      message: "로그인 성공",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "로그인 실패" });
  }
};

//  토큰 재발급-> accessToken이 만료되는 경우
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh Token이 필요합니다." });

    // DB에서 유효한 토큰인지 확인
    const tokenRecord = await tokenModel.findToken(refreshToken);
    if (!tokenRecord) { // 탈취되었거나 위조되었을 수도 잇음 ->서버가 모르는 토큰!! 예외처리
      return res.status(401).json({ message: "유효하지 않은 Refresh Token" });
    }

    // Refresh Token 검증
    // 이 경우는, 진짜 유효하면서, db에도 존재하지만, 발급받은지 오래되어 만료된 경우에 대한 예외처리
    const jwt = require("jsonwebtoken");
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Refresh Token 만료됨" });
      //refresh 토큰은 살아있으므로, 새로운 accesstoken 발급
      const newAccessToken = authService.generateAccessToken({
        user_id: decoded.user_id,
        email: decoded.email,
      });

      return res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "토큰 재발급 실패" });
  }
};

//  로그아웃 (Refresh Token 무효화)
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh Token이 필요합니다." });

    // DB에서 해당 토큰을 무효화
    await tokenModel.revokeToken(refreshToken);

    res.json({ message: "로그아웃 성공 (Refresh Token 폐기 처리하였습니다)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "로그아웃 실패" });
  }
};
