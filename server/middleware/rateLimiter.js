const rateLimit = new Map();

const WINDOW_SIZE = parseInt(process.env.RATE_LIMIT_WINDOW || "60000", 10);
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "20", 10);

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, {
      requests: [],
      cleanup: now
    });
  }

  const userLimit = rateLimit.get(ip);
  
  // Remove old requests outside the window
  userLimit.requests = userLimit.requests.filter(
    (time) => now - time < WINDOW_SIZE
  );

  // Check if user has exceeded rate limit
  if (userLimit.requests.length >= MAX_REQUESTS) {
    const oldestRequest = userLimit.requests[0];
    const retryAfter = Math.ceil((WINDOW_SIZE - (now - oldestRequest)) / 1000);
    
    res.set({
      'Retry-After': retryAfter,
      'X-RateLimit-Reset': Math.ceil((now + WINDOW_SIZE) / 1000)
    });
    
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please try again later.",
      retryAfter
    });
  }

  // Add current request
  userLimit.requests.push(now);

  // Clean up old entries every hour
  if (now - userLimit.cleanup > 3600000) {
    userLimit.cleanup = now;
    for (const [key, value] of rateLimit.entries()) {
      if (now - Math.max(...value.requests) > WINDOW_SIZE) {
        rateLimit.delete(key);
      }
    }
  }

  // Add rate limit info to response headers
  res.set({
    'X-RateLimit-Limit': MAX_REQUESTS,
    'X-RateLimit-Remaining': MAX_REQUESTS - userLimit.requests.length,
    'X-RateLimit-Reset': Math.ceil((now + WINDOW_SIZE) / 1000)
  });

  next();
};

module.exports = rateLimiter;
