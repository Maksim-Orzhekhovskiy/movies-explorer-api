const express = require('express');

const indexRouter = express.Router();
const NotFoundError = require('../errors/notFoundError');
const authMiddleware = require('../middlewares/auth');
const { NOT_FOUND_URL_MSG } = require('../utils/constants');

const authRoutes = require('./auth');
const moviesRoutes = require('./movies');
const userRoutes = require('./users');
const logoutRouter = require('./logout');

indexRouter.use('/', authRoutes);
indexRouter.use(authMiddleware);
indexRouter.use('/', logoutRouter);
indexRouter.use('/users', userRoutes);
indexRouter.use('/movies', moviesRoutes);
indexRouter.use('*', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_URL_MSG));
});

module.exports = indexRouter;
