const express = require('express');
const authMiddleware = require('./../middlewares/auth');

const router = express.Router();

router.router('/').post();

module.exports = router;
