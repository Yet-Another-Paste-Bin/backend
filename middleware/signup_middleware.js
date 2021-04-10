const User = require("../models/user.model");

module.exports = function checkDuplication(req, res, next) {
  if (req.body === undefined)
    return res.status(400).json({ message: "Bad Request" }).end();

  if (
    [req.body.username, req.body.email, req.body.password].includes(undefined)
  ) {
    return res.status(400).json({ message: "Bad Request" }).end();
  }

  User.findOne(
    { $or: [{ username: req.body.username }, { email: req.body.email }] },
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: "Server Error Occured" }).end();
      }

      if (user) {
        const duplicate =
          user.username === req.body.username ? "Username" : "Email";
        return res
          .status(400)
          .json({ message: `${duplicate} already registered !` })
          .end();
      }
      next();
    }
  );
};
