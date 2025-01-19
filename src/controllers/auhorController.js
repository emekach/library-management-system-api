const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const Author = require('./../models/authorModel');
const authMiddleware = require('./../middlewares/auth');

exports.createAuthor = catchAsync(async (req, res, next) => {
  const { name, bio, birthDate } = req.body;
  if (!name || !bio || !birthDate) {
    return next(new AppError('Fields cannot be blank', 401));
  }

  const author = await Author.create({
    name,
    bio,
    birthDate,
  });

  if (!author) {
    return next(new AppError('Error creating Author', 401));
  }

  res.status(200).json({
    message: 'status',
    author,
  });
});

exports.getAllAuthor = catchAsync(async (req, res, next) => {
  const { page, sort, limit, fields, ...queryObj } = req.query;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(page) || 10;
  const skip = (pageNum - 1) * limitNum;

  if (page) {
    const numAuthor = await Author.countDocuments({ ...queryObj });
    if (skip > numAuthor) {
      return next(new AppError('This page does not exist', 404));
    }
  }

  const author = await Author.find({ ...queryObj })
    .skip(skip)
    .limit(limitNum);

  if (!author) {
    return next(new AppError('No data found', 404));
  }

  res.status(200).json({
    status: 'success',
    result: author.length,
    page: pageNum,
    author,
  });
});

exports.getAuthor = catchAsync(async (req, res, next) => {
  const { authorId } = req.params;

  //   console.log(req.params);

  const author = await Author.findById(authorId);
  if (!author) {
    return next(new AppError('author not found', 404));
  }

  res.status(200).json({
    status: 'success',
    author,
  });

  next();
});

exports.updateAuthor = catchAsync(async (req, res, next) => {
  const { authorId } = req.params;

  const author = await Author.findByIdAndUpdate(authorId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!author) {
    return next(new AppError('No author found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    author,
  });
});

exports.deleteAuthor = catchAsync(async (req, res, next) => {
  const { authorId } = req.params;

  const author = await Author.findByIdAndDelete(authorId);
  if (!author) {
    return next(new AppError('No author found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: null,
  });
});
