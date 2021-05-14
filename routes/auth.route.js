const controller = require("../controllers/auth.controller");
const checkDuplication = require("../middleware/signup_middleware");
const {
  rateLimiterPrimary,
  rateLimiterSecondary,
} = require("../middleware/ratelimit_middleware");

module.exports = function (app) {
  app.post(
    "/api/signup",
    [rateLimiterPrimary, checkDuplication],
    controller.signup
  );
  app.post("/api/login", rateLimiterPrimary, controller.login);
  app.post(
    "/api/forgotpassword",
    rateLimiterSecondary,
    controller.forgotpassword
  );
  app.post(
    "/api/requestpasswordreset",
    rateLimiterSecondary,
    controller.requestPasswordReset
  );
};
