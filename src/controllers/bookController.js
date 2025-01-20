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
  const { page, limit, sort, fields, ...queryObj } = req.query;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  if (page) {
    const numBooks = await Books.countDocuments({ ...queryObj });
    if (skip > numBooks) {
      return next(new AppError('This page does not exist', 404));
    }
  }

  const book = await Books.find({ ...queryObj })
    .skip(skip)
    .limit(limitNum)
    .populate('authorId');

  if (!book) {
    return next(new AppError('No book found', 404));
  }

  res.status(200).json({
    status: 'success',
    result: book.length,
    book,
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const book = await Books.findById(bookId).populate('authorId');

  if (!book) {
    return next(new AppError('No book found with that Id', 404));
  }

  res.status(200).json({
    status: 'success',
    book,
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const book = await Books.findByIdAndUpdate(bookId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!book) {
    return next(new AppError('No book found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    book,
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const book = await Books.findByIdAndDelete(bookId);

  if (!book) {
    return next(new AppError('No book found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    book: null,
  });
});
