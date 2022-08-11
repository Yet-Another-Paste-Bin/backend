const {
  addBin,
  getBin,
  getAllBin,
  deleteBin,
  updateBin,
} = require("../controllers/bin.controller");
const { verifyBin } = require("../middleware/bin_checker");
const auth_middleware = require("../middleware/jwt_auth");

/**
 * Register Bin Related API Routes
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Express App Object} app
 * @Return null
 */
module.exports = (app) => {
  app.post("/api/bin", [auth_middleware, verifyBin], addBin);
  app.get("/api/bin/:binId", auth_middleware, getBin);
  app.get("/api/bin", auth_middleware, getAllBin);
  app.delete("/api/bin", auth_middleware, deleteBin);
  app.put("/api/bin", auth_middleware, updateBin);
};
