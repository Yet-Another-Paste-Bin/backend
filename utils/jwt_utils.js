const { verify, sign } = require("jsonwebtoken");
const { secret } = require("../config");

/**
 * Returns decode JWT Authentication token
 * @author Tejasvp25 <tejasvp25@gmail.com>
 * @param {String} token    JWT Authentication Token
 * @return {Object} decoded token in form of object
 */
const decodeJWTToken = (token) => {
  try {
    return verify(token, secret); //   Return decoded Authentication token
  } catch {
    return undefined; //   Return {undefined} if there is error in decoding token
  }
};

/**
 * Return Authentication token
 * @author Tejasvp25 <tejasvp25@gmail.com>
 * @param {Object} obj  Object to be encoded in Authentication token
 * @param {Number} expiresIn  Expiration time (milliseconds) for Authentication token
 * @returns {String} Authentication Token
 */
const signJWTToken = (obj, expiresIn) =>
  sign({ ...obj }, secret, { expiresIn });

module.exports = { decodeJWTToken, signJWTToken };
