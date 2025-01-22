const express = require('express');
const borrowController = require('./../controllers/borrowController');
const router = express.Router({ mergeParams: true });

router
  .route('/borrow')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('Member'),
    borrowController.borrowBook
  );

router
  .route('/return')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('Member'),
    borrowController.returnBook
  );

router
  .route('/records')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('Admin', 'Librarian'),
    borrowController.borrowRecords
  );
module.exports = reouter;
