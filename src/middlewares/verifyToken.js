
// jwt 인증 + error handler


// middlewares/verifyToken.js
// 말그대로 미들웨어 ->  요청이 컨트롤러에 도달하기 전 인증 자체를 검증!
// 일반 api 호출시 클라이언트는 jwt accesstoken을 같이 헤더에 보내는데,
// 이 토큰이 유효한지 아닌지에 따라서 API 요청을 막거나 허용할수있음

const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer xxx"

  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "유효하지 않거나 만료된 토큰입니다." });
    }
    req.user = decoded; // { user_id, email } 요청객체에 저장
    next(); // 컨트롤러로 넘어감!!
  });
};
