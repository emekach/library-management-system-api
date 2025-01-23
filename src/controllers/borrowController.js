const BorrowRecord = require('./../models/borrowRecordModel');
const Book = require('./../models/bookModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.borrowBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  console.log(userId);
  const book = await Book.findById(id);

  if (!book) {
    return next(new AppError('Book not found', 404));
  }
  console.log(book.status);

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

exports.returnBook = catchAsync(async (req, res, next) => {});

exports.borrowRecords = catchAsync(async (req, res, next) => {});
