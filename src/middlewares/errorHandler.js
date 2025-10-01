// middlewares/errorHandler.js
exports.errorHandler = (err, req, res, next) => {
  console.error(" Error:", err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || "서버 에러 발생",
  });
};
