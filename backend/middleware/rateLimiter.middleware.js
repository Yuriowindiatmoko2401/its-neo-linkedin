import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    message: 'Too many requests, please try again later.' 
  },
  skipSuccessfulRequests: true // don't count successful requests
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 auth requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    message: 'Too many authentication attempts, please try again later.' 
  },
  skipSuccessfulRequests: true // don't count successful requests
});
