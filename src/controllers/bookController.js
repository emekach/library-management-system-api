const Books = require('./../models/bookModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.createBook = catchAsync(async (req, res, next) => {
  const { isbn, publishedDate } = req.body;
});
