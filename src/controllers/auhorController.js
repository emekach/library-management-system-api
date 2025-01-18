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
