const controller = require("../controllers/bin.controller");
const bin_middleware = require("../middleware/bin_checker");
const auth_middleware = require("../middleware/jwt_auth");
const {
  rateLimiterPrimary,
  rateLimiterSecondary,
} = require("../middleware/ratelimit_middleware");
module.exports = (app) => {
  app.post(
    "/api/bin",
    [rateLimiterPrimary, auth_middleware, bin_middleware.verifyBin],
    controller.addBin
  );
  app.delete(
    "/api/bin",
    [rateLimiterSecondary, auth_middleware, bin_middleware.verifyBin],
    controller.removeBin
  );
  app.get(
    "/api/bin/:binId",
    [rateLimiterPrimary, auth_middleware],
    controller.getBin
  );
  app.get(
    "/api/bin",
    [rateLimiterPrimary, auth_middleware],
    controller.getAllBin
  );
  app.delete(
    "/api/bin",
    [rateLimiterSecondary, auth_middleware],
    controller.deleteBin
  );
  app.put("/api/bin", auth_middleware, controller.updateBin);
};
