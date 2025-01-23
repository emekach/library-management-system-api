const BorrowRecord = require('./../models/borrowRecordModel');
const Book = require('./../models/bookModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const borrowedRecord = require('./../models/borrowRecordModel');

exports.borrowBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  //   console.log(userId);
  const book = await Book.findById(id);

  if (!book) {
    return next(new AppError('Book not found', 404));
  }
  //   console.log(book.status);

  if (book.status !== 'Available') {
    return next(new AppError('Book is not available for borrowing', 400));
  }

  const borrowBook = await BorrowRecord.create({
    userId,
    bookId: id,
    borrowedAt: new Date(),
    dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });

  book.status = 'Borrowed';
  await book.save();

  res.status(200).json({
    status: 'success ',
    data: {
      borrowBook,
      book,
    },
  });
});

exports.returnBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const borrowRecord = await BorrowRecord.findOne({
    userId,
    bookId: id,
    returnedAt: null,
  });

  //   console.log(borrowRecord);

  if (!borrowRecord) {
    return next(
      new AppError('No active borrow record found for this book and user', 404)
    );
  }

  const book = await Book.findById(id);

  if (!book) {
    return next(new AppError('Book not found', 404));
  }

  borrowRecord.returnedAt = new Date();
  await borrowRecord.save();

  book.status = 'Available';
  await book.save();

  res.status(200).json({
    status: 'success',
    data: {
      borrowRecord,
      book,
    },
  });
});

exports.borrowRecords = catchAsync(async (req, res, next) => {});
