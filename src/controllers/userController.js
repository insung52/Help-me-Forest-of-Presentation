// /users/me - 회원 정보 조회
exports.usersMe = async (req, res) => {
  try {
    // JWT 인증 미들웨어에서 user 정보를 req.user에 넣는다고 가정
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    // DB에서 최신 정보 조회 (선택)
    // const userInfo = await userService.getUserById(user.user_id);
    // 아래는 JWT에서 가져온 정보만 반환
    res.json({
      user_id: user.user_id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "회원 정보 조회 실패" });
  }
}
// 컨트롤러는 req/res 만 처리
// 실제 로직 처리는 Service에서
// 그러므로, userService 변수를 선언하고 초기화
const userService = require("../services/userService");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!email || !password || !name) {
      return res.status(400).json({ message: "이메일, 비밀번호, 닉네임은 필수입니다." });
    }

    try {
      const result = await userService.register({
        name,
        email,
        password
      });
      res.status(201).json({
        message: "회원가입 성공",
        ...result,
      });
    } catch (err) {
      if (err.message === "이미 사용 중인 이메일입니다.") {
        return res.status(409).json({ message: err.message });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "회원가입 실패" });
  }
};
