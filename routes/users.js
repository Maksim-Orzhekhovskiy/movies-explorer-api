const express = require('express');

const usersRouter = express.Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUserInfo,
  getUserById,
} = require('../controllers/users');

usersRouter.get('/me', getUserById);

usersRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email().required(),
    }),
  }),
  updateUserInfo,
);

module.exports = usersRouter;
