const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const generateAccessAndRefreshToken = require('./../utils/generateToken');

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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Field cannot be empty', 400));
  }

  // check if email exist

  const user = await User.findOne({ email });

  if (!user || !(await user.isPasswordCorrect(password))) {
    return next(new AppError('Invalid Credentials', 400));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );

  const loggedInUser = await User.findById(user?._id).select(
    '-password -tokenVersion -refreshToken'
  );

  if (!loggedInUser) {
    return next(new AppError('Failed to log in user', 404));
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  JWT_COOKIE_EXPIRES_IN = 15;
  JWT_COOKIE_EXPIRES_IN = 15;
  return res
    .status(200)
    .cookie('accessToken', accessToken, {
      ...options,
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000,
    })
    .cookie('refreshToken', refreshToken, {
      ...options,
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    })
    .json({
      status: 'success',
      accessToken,
      refreshToken,
      user: loggedInUser,
    });
});

exports.logout = catchAsync(async (req, res, next) => {
  if (!req.user || !req.user?.id) {
    return next(new AppError('User not found. unable to logout', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    {
      $unset: {
        refreshToken: '',
      },
      $inc: {
        tokenVersion: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json({
      message: 'User Logged out sucessfully',
    });
});

