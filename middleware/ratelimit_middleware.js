const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const redis = require("redis");
const { connectionString } = require("../config");

// Create default RedisStore client with given {connectionString} RedisDB Connection URI
const limitStore = new RedisStore({
  client: redis.createClient((redis_url = connectionString)),
});

/**
 * Return rateLimit middleware
 * {windowMs} as 1 Hour
 * {max} 100 -  Maximum Request
 * {skipSuccessfulRequests} false - Don't Skip successful request for rate limiting
 * {skipFailedRequests} false - Don't Skip failed request for rate limiting
 */
const rateLimiterPrimary = rateLimit({
  store: limitStore,
  windowMs: 60 * 60 * 1000,
  max: 100,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

/**
 * Return rateLimit middleware
 * {windowMs} as 1 Hour
 * {max} 10 - Maximum Request
 * {skipSuccessfulRequests} true - Skip successful request for rate limiting
 * {skipFailedRequests} false - Don't Skip failed request for rate limiting
 */
const rateLimiterSecondary = rateLimit({
  store: limitStore,
  windowMs: 60 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});
module.exports = { rateLimiterPrimary, rateLimiterSecondary };
