import { Application } from "express";

import {
  addBin,
  getBin,
  getAllBin,
  deleteBin,
  updateBin,
} from "../controllers/bin.controller";
import { verifyBin } from "../middleware/bin_checker";
import { authToken as auth_middleware } from "../middleware/jwt_auth";
import {
  rateLimiterPrimary,
  rateLimiterSecondary,
} from "../middleware/ratelimit_middleware";

/**
 * Register Bin Related API Routes
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Express App Object} app
 * @Return function
 */
export default function (app: Application) {
  app.post(
    "/api/bin",
    [rateLimiterPrimary, auth_middleware, verifyBin],
    addBin
  );
  app.get("/api/bin/:binId", [rateLimiterPrimary, auth_middleware], getBin);
  app.get("/api/bin", [rateLimiterPrimary, auth_middleware], getAllBin);
  app.delete("/api/bin", [rateLimiterSecondary, auth_middleware], deleteBin);
  app.put("/api/bin", auth_middleware, updateBin);
}
