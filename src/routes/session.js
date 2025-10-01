const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

// 세션 목록 조회
router.get("/", sessionController.getAllSessions);

// 세션 생성
router.post("/", sessionController.createSession);

module.exports = router;
