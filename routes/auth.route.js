const {
  login,
  signup,
  forgotpassword,
  requestPasswordReset,
} = require("../controllers/auth.controller");
const checkDuplication = require("../middleware/signup_middleware");

/**
 * Register Authentication Related API Routes
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Express App Object} app
 * @Return null
 */
module.exports = function (app) {
  app.post("/api/signup", checkDuplication, signup);
  app.post("/api/login", login);
  app.post("/api/forgotpassword", forgotpassword);
  app.post("/api/requestpasswordreset", requestPasswordReset);
};
