const rateLimit = {};

const WINDOW_SIZE = parseInt(process.env.RATE_LIMIT_WINDOW || "60000", 10); // 1 minute
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "20", 10); // 20 requests per minute

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!rateLimit[ip]) {
    rateLimit[ip] = {
      requests: [],
    };
  }

  // Remove old requests outside the window
  rateLimit[ip].requests = rateLimit[ip].requests.filter(
    (time) => now - time < WINDOW_SIZE
  );

  // Check if user has exceeded rate limit
  if (rateLimit[ip].requests.length >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please try again later.",
      retryAfter: Math.ceil(
        (WINDOW_SIZE - (now - rateLimit[ip].requests[0])) / 1000
      ),
    });
  }

  // Add current request
  rateLimit[ip].requests.push(now);

  // Clean up old entries every hour
  if (!rateLimit[ip].cleanup || now - rateLimit[ip].cleanup > 3600000) {
    rateLimit[ip].cleanup = now;
    Object.keys(rateLimit).forEach((key) => {
      if (now - Math.max(...rateLimit[key].requests) > WINDOW_SIZE) {
        delete rateLimit[key];
      }
    });
  }

  // Add rate limit info to response headers
  res.set({
    "X-RateLimit-Limit": MAX_REQUESTS,
    "X-RateLimit-Remaining": MAX_REQUESTS - rateLimit[ip].requests.length,
    "X-RateLimit-Reset": Math.ceil((now + WINDOW_SIZE) / 1000),
  });

  next();
};

module.exports = rateLimiter;
