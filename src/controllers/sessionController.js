const sessionService = require("../services/sessionService");

// 모든 세션 목록 조회 응답 받아오기
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getAll();
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "세션 조회 실패" });
  }
};

// 새로운 세션 생성 응답 받아오기
exports.createSession = async (req, res) => {
  const { user_id, subject, topic, script, time_limit, mode } = req.body;
  try {
    const sessionId = await sessionService.create({
      user_id, subject, topic, script, time_limit, mode
    });
    res.json({ message: "세션 생성 성공", session_id: sessionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "세션 생성 실패" });
  }
};
