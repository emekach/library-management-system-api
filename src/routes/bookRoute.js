const express = require('express');
const authMiddleware = require('./../middlewares/auth');
const bookController = require('./../controllers/bookController');
const authController = require('./../controllers/auhorController');

const router = express.Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('Admin', 'Librarian'),
    bookController.createBook
  )
  .get(bookController.getBooks);

router
  .route('/:bookId')
  .get(authMiddleware.protect, bookController.getBook)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('Admin', 'Librarian'),
    bookController.updateBook
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('Admin'),
    bookController.deleteBook
  );

module.exports = router;
