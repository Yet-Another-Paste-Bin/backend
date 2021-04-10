const Bin = require("../models/bin.model");

function verifyBin(req, res, next) {
  if (req.body === undefined) {
    return res.status(400).end();
  }
  const { binId, data, private, user_id, owner_id } = req.body;
  if (req.method === "DELETE" && binId === undefined) {
    return res.status(400).end();
  }

  if (req.method === "DELETE" && ![binId, owner_id].includes(undefined)) {
    return next();
  }
  if ([data, private].includes(undefined)) {
    return res.status(400).end();
  }
  if (private && [owner_id].includes(undefined)) {
    return res.status(400).end();
  }

  next();
}

module.exports = { verifyBin };
