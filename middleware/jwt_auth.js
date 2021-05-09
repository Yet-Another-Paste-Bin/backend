const jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "secretkey";

module.exports = function authToken(req, res, next) {
  if (req.body === undefined) return res.status(400).end();

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

  if (!token) return res.status(400).send();

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).send();

    req.body.owner_id = decoded.id;
    req.body.username = decoded.username;
    req.body.email = decoded.email;
    next();
  });
};
