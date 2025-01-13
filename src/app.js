require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: true, limit: '15kb' }));

module.exports = app;
