const controller = require("../controllers/bin.controller");
const bin_middleware = require("../middleware/bin_checker");
const auth_middleware = require("../middleware/jwt_auth");

module.exports = (app) => {
  app.post(
    "/api/bin",
    [auth_middleware, bin_middleware.verifyBin],
    controller.addBin
  );
  app.delete(
    "/api/bin",
    [auth_middleware, bin_middleware.verifyBin],
    controller.removeBin
  );
  app.get("/api/bin/:binId", auth_middleware, controller.getBin);
};
