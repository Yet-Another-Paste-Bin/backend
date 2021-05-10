const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "secretkey";
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
      if (err) return res.status(500).end();
      if (user) return res.status(400).end();
      newUser.save();
      const jwttoken = jwt.sign(
        {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
        secret,
        { expiresIn: 86400 }
      );
      return res
        .status(200)
        .json({
          id: newUser._id,
          token: jwttoken,
          username: newUser.username,
        })
        .end();
    });
  } catch (error) {
    res.status(500).end();
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if ([username, password].includes(undefined)) return res.status(400).end();
  User.findOne(
    { $or: [{ username: username }, { email: username }] },
    (err, user) => {
      if (err) return res.status(500).end();
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

      const jwttoken = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        secret,
        { expiresIn: 86400 }
      );

      res
        .status(200)
        .json({
          id: user._id,
          token: jwttoken,
          username: user.username,
        })
        .end();
    }
  );
};

exports.forgotpassword = (req, res) => {
  const { password, passwordresettoken } = req.body;

  if ([password, passwordresettoken].includes(undefined))
    return res.status(400).send();

  jwt.verify(passwordresettoken, secret, (err, decoded) => {
    if (err) res.status(401).end();
    const { username, id, email } = decoded;
    User.findOne(
      {
        _id: id,
        username,
        email,
      },
      (err, user) => {
        if (err) return res.status(500).end();
        if (!user) return res.status(401).end();

        jwt.verify(passwordresettoken, secret, (err, _) => {
          if (err) {
            return res.status(403).send();
          }
          if (passwordresettoken !== user.passwordresettoken) {
            return res.status(401).end();
          }

          const jwttoken = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            secret,
            { expiresIn: 86400 }
          );
          user.password = bcrypt.hashSync(password, 8);
          user.passwordresettoken = "";
          user.save();
          return res
            .status(200)
            .json({
              id: user._id,
              token: jwttoken,
              username: user.username,
            })
            .end();
        });
      }
    );
  });
};

exports.requestPasswordReset = (req, res) => {
  const { username, email, phoneno } = req.body;
  if ([username, email, phoneno].includes(undefined))
    return res.status(400).send();

  User.findOne(
    {
      username,
      email,
      phoneno,
    },
    (err, user) => {
      if (err) return res.status(500).end();
      if (!user) return res.status(401).end();

      const jwttoken = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        secret,
        { expiresIn: 600 }
      );
      user.passwordresettoken = jwttoken;
      user.save();
      return res.status(200).json({ passwordresettoken: jwttoken }).end();
    }
  );
};
