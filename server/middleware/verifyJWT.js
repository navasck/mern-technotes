const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    // next() is the part of the middleware that call either  the next middleware or move on to the controller if thats where that request needs to go.
    next();
  });
};

module.exports = verifyJWT;

// we need to apply this middleware again to verify the jwt middleware to the routes we want to protect.
