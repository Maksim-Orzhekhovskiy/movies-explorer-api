const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { MODE_PRODUCTION, DEV_KEY } = require('../utils/config');
const UnauthorizedError = require('../errors/unauthorizedError');
const { AUTH_MSG } = require('../utils/constants');

module.exports = (req, res, next) => {
  let payload;

  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new UnauthorizedError(AUTH_MSG);
    }
    payload = jwt.verify(token, NODE_ENV === MODE_PRODUCTION ? JWT_SECRET : DEV_KEY);
  } catch (err) {
    throw new UnauthorizedError(AUTH_MSG);
  }
  req.user = payload;
  return next();
};
