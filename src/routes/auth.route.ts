import {
  login,
  signup,
  forgotpassword,
  requestPasswordReset,
} from "../controllers/auth.controller";
import checkDuplication from "../middleware/signup_middleware";
import {
  rateLimiterPrimary,
  rateLimiterSecondary,
} from "../middleware/ratelimit_middleware";
import { Application } from "express";

/**
 * Register Authentication Related API Routes
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Express App Object} app
 * @Return function
 */
export default function (app: Application) {
  app.post("/api/signup", [rateLimiterPrimary, checkDuplication], signup);
  app.post("/api/login", rateLimiterPrimary, login);
  app.post("/api/forgotpassword", rateLimiterSecondary, forgotpassword);
  app.post(
    "/api/requestpasswordreset",
    rateLimiterSecondary,
    requestPasswordReset
  );
}
