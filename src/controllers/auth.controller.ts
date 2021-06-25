import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { decodeJWTToken, signJWTToken } from "../utils/jwt_utils";
import { getExpiry } from "../utils/dateUtils";
import { Request, Response } from "express";
/**
 * Handler function for {/api/signup} route
 * @method POST
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
export const signup = async (req: Request, res: Response) => {
  const { username, email, phoneno, password } = req.body;

  try {
    const newUser = new User({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 8),
      phoneno: phoneno,
    });
    const user = await User.findOne({ username, email });
    if (user) return res.status(400).end();
    newUser.save();
    return res.status(200).end();
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
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  //  Send HTTP status code 400 as a response if {username, password} is undefined
  if ([username, password].includes(undefined)) return res.status(400).end();
  try {
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });
    if (user) {
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
    return res.status(204).end();
  } catch (error) {
    return res.status(500).end();
  }
};

/**
 * Handler function for {/api/forgotpassword} route
 * @method POST
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
export const forgotpassword = async (req: Request, res: Response) => {
  const { password, passwordresettoken } = req.body;

  //  Send HTTP status code 400 as a response if {passwordresettoken} or {password} is undefined
  if ([password, passwordresettoken].includes(undefined))
    return res.status(400).send();

  const { username, id, email } = decodeJWTToken(passwordresettoken);

  //  Send HTTP status code 401 as a response if { username, id, email } includes undefined
  if ([username, id, email].includes(undefined)) return res.status(401).end();
  else {
    try {
      const user = await User.findOne({ _id: id, username, email });
      if (user) {
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
        }
      }
      //  Send HTTP status code 401 as a response user is not found
      return res.status(401).end();
    } catch (error) {
      //  Send HTTP status code 500 as error occured
      return res.status(500).end();
    }
  }
};

/**
 * Handler function for {/api/requestpasswordreset} route
 * @method POST
 * @author Tejasvp25  <tejasvp25@gmail.com>
 * @param {Object} req  Express Request object
 * @param {Object} res  Express Response object
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { username, email, phoneno } = req.body;
  //  Send HTTP status code 400 as a response if { username, email, phoneno } includes undefined
  if ([username, email, phoneno].includes(undefined))
    return res.status(400).send();

  try {
    const user = await User.findOne({
      username,
      email,
      phoneno,
    });
    if (user) {
      const jwttoken = signJWTToken(
        { id: user._id, username: user.username, email: user.email },
        600
      );
      user.passwordresettoken = jwttoken;
      user.save();
      return res.status(200).json({ passwordresettoken: jwttoken }).end();
    }
    //  Send HTTP status code 401 as a response as {user} is not found
    return res.status(401).end();
  } catch (error) {
    //  Send HTTP status code 500 as a response as error occured
    return res.status(500).end();
  }
};
