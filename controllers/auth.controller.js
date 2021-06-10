const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { decodeJWTToken, signJWTToken } = require("../utils/jwt_utils");
const { getExpiry } = require("../utils/dateUtils");
/**
 * Handler function for {/api/signup} route
 * @method POST
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
exports.signup = (req, res) => {
  const { username, email, phoneno, password } = req.body;

  try {
    const newUser = new User({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 8),
      phoneno: phoneno,
    });

    User.findOne({ username, email }, (err, user) => {
      //  Send HTTP status code 500 as a response if error occured
      if (err) return res.status(500).end();
      newUser.save();
      return res.status(200).end();
    });
  } catch (error) {
    res.status(500).end();
  }
};

/**
 * Handler function for {/api/login} route
 * @method POST
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
exports.login = (req, res) => {
  const { username, password } = req.body;

  //  Send HTTP status code 400 as a response if {username, password} is undefined
  if ([username, password].includes(undefined)) return res.status(400).end();
  User.findOne(
    { $or: [{ username: username }, { email: username }] },
    (err, user) => {
      //  Send HTTP status code 500 as a response if error occured
      if (err) return res.status(500).end();
      //  Send HTTP status code 204 as a response if user is not found
      if (!user) return res.status(204).end();

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res
          .status(401)
          .send({
            message: "Invalid Password",
          })
          .end();
      }

      const token = signJWTToken(
        { id: user._id, username: user.username, email: user.email },
        86400000
      );
      res
        .status(200)
        .json({
          id: user._id,
          username: user.username,
          token,
          expiry: getExpiry(),
        })
        .end();
    }
  );
};

/**
 * Handler function for {/api/forgotpassword} route
 * @method POST
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
exports.forgotpassword = (req, res) => {
  const { password, passwordresettoken } = req.body;

  //  Send HTTP status code 400 as a response if {passwordresettoken} or {password} is undefined
  if ([password, passwordresettoken].includes(undefined))
    return res.status(400).send();

  const { username, id, email } = decodeJWTToken(passwordresettoken);

  //  Send HTTP status code 401 as a response if { username, id, email } includes undefined
  if ([username, id, email].includes(undefined)) return res.status(401).end();
  else {
    User.findOne(
      {
        _id: id,
        username,
        email,
      },
      (err, user) => {
        //  Send HTTP status code 500 as a response if error occured
        if (err) return res.status(500).end();
        //  Send HTTP status code 401 as a response user is not found
        if (!user) return res.status(401).end();

        /**
         * Decode provided passwordresettoken
         * if provided passwordresettoken does not match with saved passwordresettok
         * then Send HTTP status code 401 as a response
         * else update password
         */
        if (decodeJWTToken(passwordresettoken)) {
          if (passwordresettoken !== user.passwordresettoken)
            return res.status(401).end();
          user.password = password;
          user.save();
          return res.status(200).end();
        } else {
          if (err) return res.status(403).send();
        }
      }
    );
  }
};

/**
 * Handler function for {/api/requestpasswordreset} route
 * @method POST
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
exports.requestPasswordReset = (req, res) => {
  const { username, email, phoneno } = req.body;
  //  Send HTTP status code 400 as a response if { username, email, phoneno } includes undefined
  if ([username, email, phoneno].includes(undefined))
    return res.status(400).send();

  User.findOne(
    {
      username,
      email,
      phoneno,
    },
    (err, user) => {
      //  Send HTTP status code 500 as a response if error occured
      if (err) return res.status(500).end();
      //  Send HTTP status code 401 as a response if {user} not found
      if (!user) return res.status(401).end();
      // Generate Password reset token and Save to database
      const jwttoken = signJWTToken(
        { id: user._id, username: user.username, email: user.email },
        600
      );
      user.passwordresettoken = jwttoken;
      user.save();
      return res.status(200).json({ passwordresettoken: jwttoken }).end();
    }
  );
};
