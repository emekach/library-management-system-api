const express = require('express');
const authMiddleware = require('./../middlewares/auth');
const bookController = require('./../controllers/bookController');
const authController = require('./../controllers/auhorController');
const borrowRouter = require('./borrowRoute');

const router = express.Router();

router.use('/:id', borrowRouter);
router.use('/', borrowRouter);

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

// POST /books/{id}/borrow
module.exports = router;
