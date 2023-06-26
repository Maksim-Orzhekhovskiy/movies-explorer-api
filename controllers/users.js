const { ValidationError } = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const IncorrectDataError = require('../errors/incorrectDataError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const {
  SIGNIN_MSG,
  SIGNOUT_MSG,
  SIGNUP_BAD_DATA_MSG,
  SIGNUP_CONFLICT_MSG,
  USER_NOT_FOUND_MSG,
  USER_BAD_DATA_MSG,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const { MODE_PRODUCTION, DEV_KEY } = require('../utils/config');

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User
      .create({
        email, password: hash, name,
      }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectDataError(SIGNUP_BAD_DATA_MSG));
      } else if (err.code === 11000) {
        next(new ConflictError(SIGNUP_CONFLICT_MSG));
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MSG);
    })
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MSG);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectDataError(USER_BAD_DATA_MSG));
      } else if (err.code === 11000) {
        next(new ConflictError(SIGNUP_CONFLICT_MSG));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === MODE_PRODUCTION ? JWT_SECRET : DEV_KEY,
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
        .send({ message: SIGNIN_MSG });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: SIGNOUT_MSG });
};

module.exports = {
  login, logout, updateUserInfo, getUserById, createUser,
};
