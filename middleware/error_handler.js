module.exports = function errorHandler(err, req, res, next) {
  if (err) {
    return res.status(500);
  }
  next();
};
