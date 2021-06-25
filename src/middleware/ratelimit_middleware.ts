import { connectionString } from "../config";
import rateLimit, { RateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "redis";

// Create default RedisStore client with given {connectionString} RedisDB Connection URI
const limitStore: RedisStore = new RedisStore({
  client: redis.createClient(connectionString),
});

/**
 * Return rateLimit middleware
 * {windowMs} as 1 Hour
 * {max} 100 -  Maximum Request
 * {skipSuccessfulRequests} false - Don't Skip successful request for rate limiting
 * {skipFailedRequests} false - Don't Skip failed request for rate limiting
 */
export const rateLimiterPrimary: RateLimit = rateLimit({
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
export const rateLimiterSecondary: RateLimit = rateLimit({
  store: limitStore,
  windowMs: 60 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});
