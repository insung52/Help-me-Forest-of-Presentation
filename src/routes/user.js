const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 회원가입 /users/register api일때,
router.post("/register", userController.register);

module.exports = router;
