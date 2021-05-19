const User = require("../models/user.model");

module.exports = function checkDuplication(req, res, next) {
  if (req.body === undefined)
    return res.status(400).json({ message: "Bad Request" }).end();

  if (
    [
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.phoneno,
    ].includes(undefined)
  ) {
    return res.status(400).json({ message: "Bad Request" }).end();
  }
  req.body.username = req.body.username.trim();
  req.body.email = req.body.email.trim();
  req.body.password = req.body.password.trim();
  req.body.phoneno = req.body.phoneno.trim();

  if (!validate(req.body))
    return res.status(400).json({ message: "Bad Request" }).end();

  User.findOne(
    {
      $or: [{ username: req.body.username }, { email: req.body.email }],
    },
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: "Server Error Occured" }).end();
      }

      if (user) {
        const duplicate =
          user.username === req.body.username ? "Username" : "Email";
        return res
          .status(409)
          .json({ message: `${duplicate} already registered !` })
          .end();
      }
      next();
    }
  );
};

const validate = ({ username, email, password, phoneno }) => {
  const emailRe =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/.test(
      email
    );
  const usernameRe = /^[a-zA-Z0-9_]+$/.test(username);
  const passwordRe = /^[a-zA-Z0-9_]{7,29}$/.test(password);
  const phonenoRe = /^[0-9]{10}$/.test(phoneno);

  console.log(emailRe);
  console.log(usernameRe);
  console.log(passwordRe);
  console.log(phonenoRe);

  return ![emailRe, usernameRe, passwordRe, phonenoRe].includes(false);
};
