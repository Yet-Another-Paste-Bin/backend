const { decodeJWTToken } = require("../utils/jwt_utils");

/**
 * Authentication Middleware
 *
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 * @param {Function}  next
 */
module.exports = function authToken(req, res, next) {
  //  Send HTTP status code 400 as a response if body is undefined
  if (req.body === undefined)
    return res.status(400).json({ message: "Bad Request" }).end();

  if (req.method === "POST" && !req.body.Authorization) return next();

  const token =
    req.method === "GET"
      ? req.headers.authorization !== undefined
        ? req.headers.authorization.split(" ")[1]
        : undefined
      : req.body.Authorization !== undefined
      ? req.body.Authorization.split(" ")[1]
      : undefined;

  if (!token && req.method === "GET" && req.route.path === "/api/bin/:binId")
    return next();

  //   Send HTTP status code 400 as a response if Authentication token is not provided
  if (!token) return res.status(400).send();

  const decoded = decodeJWTToken(token);
  if (decoded) {
    req.body.owner_id = decoded.id;
    req.body.username = decoded.username;
    req.body.email = decoded.email;
  }
  return next();
};
