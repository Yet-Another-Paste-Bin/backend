const controller = require("../controllers/auth.controller");
const checkDuplication = require("../middleware/signup_middleware");
// const authMiddleware = require("../middleware/jwt_auth");
module.exports = function (app) {
  app.post("/api/signup", checkDuplication, controller.signup);
  app.post("/api/login", controller.login);
};
