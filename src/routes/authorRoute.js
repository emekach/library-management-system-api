const express = require('express');
const authMiddleware = require('./../middlewares/auth');
const authController = require('./../controllers/auhorController');

const router = express.Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('Admin', 'Librarian'),
    authController.createAuthor
  );
module.exports = router;
