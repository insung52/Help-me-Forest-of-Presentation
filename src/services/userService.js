const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const authService = require("./authService");

// 회원가입 서비스 -> 모델 호출 + 비즈니스 로직처리 (중복체크 비밀번호 해싱, 토큰 발급)
exports.register = async ({ name, email, password, school, age }) => {
  // 중복체크
  const existingUser = await userModel.findByEmail(email);
  if (existingUser) throw new Error("이미 사용 중인 이메일입니다.");

  const existingName = await userModel.findByName(name);
  if (existingName) throw new Error("이미 사용 중인 닉네임입니다.");

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // DB에 유저 저장
  const user = await userModel.createUser({
    name,
    email,
    password: hashedPassword,
    school,
    age,
  });

  // JWT 발급
  const accessToken = authService.generateAccessToken({
    user_id: user.insertId,
    email,
  });

  const refreshToken = await authService.generateRefreshToken({
    user_id: user.insertId,
    email,
  });

  return { user_id: user.insertId, accessToken, refreshToken };
};
