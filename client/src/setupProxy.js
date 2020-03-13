const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  //api 로 시작하는 라우터는 http://localhost:5000  접속한다.
  app.use(proxy("/api", { target: "http://localhost:5000" }));
};