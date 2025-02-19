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
  )
  .get(authMiddleware.protect, authController.getAllAuthor);

router
  .route('/:authorId')
  .get(authMiddleware.protect, authController.getAuthor)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('Admin', 'Librarian'),
    authController.updateAuthor
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('Admin', 'Librarian'),
    authController.deleteAuthor
  );

module.exports = router;
