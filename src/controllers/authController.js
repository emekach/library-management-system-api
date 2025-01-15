const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return next(new AppError('User with this Email Already Exist', 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const createdUser = await User.findById(newUser._id).select('-password');

  if (!createdUser) {
    return next(new AppError('Failed to create User', 400));
  }

  res.status(201).json({
    status: 'success',
    data: {
      user: createdUser,
    },
  });
});
