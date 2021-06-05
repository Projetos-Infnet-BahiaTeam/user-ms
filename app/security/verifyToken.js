const jwt = require('jsonwebtoken');

const naoValidarToken = function(req){
  return req.originalUrl === '/user/v1/auth/login' || req.originalUrl === '/user/v1/auth/registrar' || req.originalUrl === '/user/v1/online';
}

function verifyToken(req, res, next) {

  if(naoValidarToken(req))
    return next();
    
  const token = req.headers['x-api-token'];
  if (!token){
    return res.status(403).send({ auth: false, message: 'Token not provided.' });
  }
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
    if (err){
      return res.status(500).send({ auth: false, message: 'Invalid token, try again.' });
    }
    req.userId = decoded.id;
    next();
  });
}
module.exports = verifyToken;