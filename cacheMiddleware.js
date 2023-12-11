const cache = require('memory-cache');

// Cache middleware
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;
    let cachedBody = cache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      // Store the original send function
      let originalSend = res.send.bind(res);

      // Override the send function
      res.send = (body) => {
        cache.put(key, body, duration * 1000);
        originalSend(body);
      };

      next();
    }
  };
};

module.exports = cacheMiddleware;
