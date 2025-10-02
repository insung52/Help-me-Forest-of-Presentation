const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const authService = require("./authService");
const tokenModel = require ('../models/tokenModel');

// 회원가입 서비스 -> 모델 호출 + 비즈니스 로직처리 (중복체크 비밀번호 해싱, 토큰 발급)
exports.register = async ({ name, email, password }) => {
  // 중복체크
  const existingUser = await userModel.findByEmail(email);
  if (existingUser) throw new Error("이미 사용 중인 이메일입니다.");


  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // DB에 유저 저장
  const user = await userModel.createUser({
    name,
    email,
    password: hashedPassword,
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


// 로그인 한 사용자의 기본 정보

exports.getMe  = async (userId) => {
  const user = await userModel.findById (userId);
  if(!user) throw new Error ("사용자를 찾을 수 없습니다 ㅠㅠ!");

  return  {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
  };
};


// 회원 정보 수정(새로운 이름으로 업데이트)
exports.updateMe = async (userId, new_name) => {
  const updated = await userModel.updateUserName(userId, new_name);
  if (!updated) throw new Error("회원 정보 업데이트 실패");

  // DB에서 최신 데이터 다시 가져오기
  const user = await userModel.findById(userId);
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
  };
};

// 회원 탈퇴
exports.deleteMe = async (userId) => {
  const deleted = await userModel.deleteUser(userId);
  if (!deleted) throw new Error("회원 탈퇴 실패");
  // 사용자 삭제 후, 그 사용자의 refresh Token 까지 삭제

  await tokenModel.deleteTokenByUserId(userId);

  return true;
};