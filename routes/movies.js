const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { REGEX } = require('../utils/constants');

const moviesRouter = express.Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);

moviesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(REGEX),
      trailerLink: Joi.string().required().pattern(REGEX),
      thumbnail: Joi.string().required().pattern(REGEX),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

moviesRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = moviesRouter;
