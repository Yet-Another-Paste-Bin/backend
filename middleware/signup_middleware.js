const User = require("../models/user.model");

/**
 * Middleware to check if user with given
 * username,email already exists or not
 *
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 * @param {Function}  next
 */
module.exports = function checkDuplication(req, res, next) {
  //  Send HTTP status code 400 as a response if body is undefined
  if (req.body === undefined)
    return res.status(400).json({ message: "Bad Request" }).end();

  //  Return HTTP status code 400 as a response if required parameter are not provided
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
  // Trim all the paramters
  req.body.username = req.body.username.trim();
  req.body.email = req.body.email.trim();
  req.body.password = req.body.password.trim();
  req.body.phoneno = req.body.phoneno.trim();

  /**
   * Return HTTP status code 400 as a response
   * if required parameter are not in valid format
   */
  if (!validate(req.body))
    return res.status(400).json({ message: "Bad Request" }).end();

  User.findOne(
    {
      $or: [{ username: req.body.username }, { email: req.body.email }],
    },
    (err, user) => {
      /**
       * Return HTTP status code 500
       * if server error occured while searching for User
       */
      if (err)
        return res.status(500).json({ message: "Server Error Occured" }).end();

      /**
       * Return HTTP status code 409
       * if User with provided username/email already exists
       * else proceed to next handler
       */
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

/**
 * Return Whether username,email,password,phoneno are in valid format or not
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} obj
 * @Return {boolean}
 */
const validate = ({ username, email, password, phoneno }) => {
  //  Object parameter is destructured in {username,email,password,phoneno}
  const emailRe =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/.test(
      email
    );
  const usernameRe = /^[a-zA-Z0-9_]+$/.test(username);
  const passwordRe = /^[a-zA-Z0-9_]{7,29}$/.test(password);
  const phonenoRe = /^[0-9]{10}$/.test(phoneno);
  return ![emailRe, usernameRe, passwordRe, phonenoRe].includes(false);
};
