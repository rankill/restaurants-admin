const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const strategies = require('./passport');
const routes = require('../api/routes/v1');
const error = require('../api/middlewares/error');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
app.use('/v1', routes);

app.use(error.notFound);
app.use(error.handler);

module.exports = app;
