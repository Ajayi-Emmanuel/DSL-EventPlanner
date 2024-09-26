const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ 
    message: 'No token, authorization denied',
    isSuccess: false
  });

  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ 
      message: 'Token is not valid',
      isSuccess: false 
    });
  }
};
