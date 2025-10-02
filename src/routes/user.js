const express = require("express");
const  {verifyToken} = require("../middlewares/verifyToken");
const router = express.Router();
const userController = require("../controllers/userController");

// 회원 가입
router.post("/register", userController.register);

// 회원 정보 수정(닉네임만)
router.patch("/me", verifyToken, userController.updateMe);

// 회원 탈퇴
router.delete ("/me",verifyToken,userController.deleteMe);

// 회원 정보 조회 (이메일, 이름)
router.get("/me", verifyToken, userController.getMe);

module.exports = router;
