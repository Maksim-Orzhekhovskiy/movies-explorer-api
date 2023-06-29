require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const validationErrors = require('celebrate').errors;
const cors = require('cors');

const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/requestLimiter');

const indexRouter = require('./routes/index');

const errors = require('./middlewares/errors');

const { PORT, DATABASE } = process.env;
const { DATABASE_URL, DEFAULT_PORT } = require('./utils/config');

const app = express();

app.use(cors({
  credentials: true,
  origin: 'https://diploma.films.nomoredomains.rocks',
}));
app.use(rateLimiter);
app.use(helmet());

app.use(express.json());
app.use(cookieParser());

mongoose.connect(DATABASE_URL || DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use('/', indexRouter);
app.use(errorLogger);

app.use(validationErrors());
app.use(errors);

app.listen(DEFAULT_PORT || PORT);
