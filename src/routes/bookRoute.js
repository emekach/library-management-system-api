const express = require('express');
const authMiddleware = require('./../middlewares/auth');
const bookController = require('./../controllers/bookController');

const router = express.Router();

router.route('/').post(bookController.createBook);

module.exports = router;
