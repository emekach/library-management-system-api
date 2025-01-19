const Books = require('./../models/bookModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.createBook = catchAsync(async (req, res, next) => {
  const { isbn, publishedDate, authorId } = req.body;

  if (!isbn || !publishedDate || !authorId) {
    return next(new AppError('Fields cannot be blank', 401));
  }

  const book = await Books.create({
    isbn,
    publishedDate,
    authorId,
  });

  if (!book) {
    return next(new AppError('Book cannot be created', 401));
  }

  res.status(200).json({
    status: 'success',
    book,
  });
});

exports.getBooks = catchAsync(async (req, res, next) => {
  const book = await Books.find();

  if (!book) {
    return next(new AppError('No book found', 404));
  }

  res.status(200).json({
    status: 'success',
    book,
  });
});
