const express = require('express');

const { logout } = require('../controllers/users');

const logoutRouter = express.Router();

logoutRouter.post('/signout', logout);

module.exports = logoutRouter;
