const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login); // 로그인시
router.post("/refresh", authController.refresh);// 토큰 재발급시
router.post("/logout", authController.logout); // 로그아웃시

module.exports = router;
