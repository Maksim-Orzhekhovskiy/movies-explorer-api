const {
  ValidationError,
  DocumentNotFoundError,
  CastError,
} = require('mongoose').Error;

const Movie = require('../model/movie');

const {
  MOVIE_BAD_DATA_MSG,
  MOVIE_NOT_FOUND_MSG,
  MOVIE_FORBIDDEN_MSG,
  MOVIE_BAD_ID_MSG,
  MOVIE_DELETE_NF_MSG,
} = require('../utils/constants');

const IncorrectDataError = require('../errors/incorrectDataError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError(MOVIE_NOT_FOUND_MSG));
      } else {
        next(err);
      }
    });
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ ...req.body, owner })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectDataError(MOVIE_BAD_DATA_MSG));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError(MOVIE_DELETE_NF_MSG);
    })
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError(MOVIE_FORBIDDEN_MSG);
      }

      movie.deleteOne();
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new IncorrectDataError(MOVIE_BAD_ID_MSG));
      } else {
        next(err);
      }
    });
};

module.exports = {
  deleteMovie, createMovie, getMovies,
};
