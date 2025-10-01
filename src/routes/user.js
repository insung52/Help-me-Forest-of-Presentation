const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


// 회원가입 /users/register
router.post("/register", userController.register);

// 회원 정보 조회 /users/me
router.get("/me", userController.usersMe);

module.exports = router;
