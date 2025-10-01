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

    // Refresh Token을 HttpOnly, Secure 쿠키로 설정
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/'
    });

    return res.json({
      message: "로그인 성공",
      accessToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "로그인 실패" });
  }
};

//  토큰 재발급-> accessToken이 만료되는 경우
exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies && req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: "Refresh Token이 필요합니다." });

    // DB에서 유효한 토큰인지 확인
    const tokenRecord = await tokenModel.findToken(refreshToken);
    if (!tokenRecord) {
      return res.status(401).json({ message: "유효하지 않은 Refresh Token" });
    }

    const jwt = require("jsonwebtoken");
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Refresh Token 만료됨" });
      const newAccessToken = authService.generateAccessToken({
        user_id: decoded.user_id,
        email: decoded.email,
      });
      return res.json({
        accessToken: newAccessToken,
        message: "Access Token 갱신 성공"
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "토큰 재발급 실패" });
  }
};

//  로그아웃 (Refresh Token 무효화)
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies && req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: "Refresh Token이 필요합니다." });

    // DB에서 해당 토큰을 무효화
    await tokenModel.revokeToken(refreshToken);

    // 쿠키 삭제
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/'
    });

    res.json({ message: "로그아웃 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "로그아웃 실패" });
  }
};
