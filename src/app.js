require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const limiter = require('./utils/rateLimit');
const globalErrorHandler = require('./utils/globalErrorHandler');

const authRoute = require('./routes/authRoute');

const app = express();

// cors
app.use(
  cors({
    origin: process.env.ALLOWED_URI,
    credentials: true,
  })
);

// security (Set http security header)
app.use(helmet());

app.use(morgan('dev'));
app.use(limiter);

app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: true, limit: '15kb' }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// routes

app.use('/api/v1/users', authRoute);

app.all('*', (req, res, next) => {
  next();
});
app.use(globalErrorHandler);
module.exports = app;
