// 컨트롤러는 req/res 만 처리
// 실제 로직 처리는 Service에서
// 그러므로, userService 변수를 선언하고 초기화
const userService = require("../services/userService");

exports.register = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "이메일, 비밀번호, 닉네임은 필수입니다." });
    }

    // userService.register 호출
    const result = await userService.register({
      name,
      email,
      password,

    });
    // frontend 에 201, 메세지, user_id, accesstoken, refreshtoken 리턴
    res.status(201).json({
      message: "회원가입 성공",
      ...result, // { user_id, accessToken, refreshToken } 를 return
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "회원가입 실패" });
  }
};
