const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
const {errorHandler} = require("./middlewares/errorHandler");

dotenv.config();

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트 연결
const userRouter = require ("./routes/user");
app.use("/users", userRouter);
const sessionRouter = require("./routes/session");
app.use("/sessions", sessionRouter);
const authRouter = require("./routes/authRoutes");
app.use("/auth", authRouter);


// 기본 라우트
app.get("/", (req, res) => {
  res.send("Presentation Feedback API running...");
});

// 포트 설정
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));


app.use(errorHandler);