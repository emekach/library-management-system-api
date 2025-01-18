const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'You are not authorised to access this page.. please login',
        401
      )
    );
  }

  let decoded;

  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_ACCESS_TOKEN);
    // console.log('Decoded:', decoded);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired', 401));
    } else if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    } else {
      return next(new AppError('Authentication error', 401));
    }
  }
  //   const decoded = await promisify(jwt.verify)(
  //     token,
  //     process.env.JWT_ACCESS_TOKEN
  //   );

  // Retrieve the current user from the database
  const currentUser = await User.findById(decoded._id).select(
    '-password -refreshToken'
  );
  //   console.log('Current User:', currentUser);

  if (!currentUser) {
    return next(new AppError('User not found', 404));
  }

  // Compare the token version with the one in the database
  //   console.log('Decoded token version:', decoded.tokenVersion);
  //   console.log('Current user token version:', currentUser.tokenVersion);

  if (decoded.tokenVersion !== currentUser.tokenVersion) {
    return next(new AppError('Unauthorized access', 401));
  }

  req.user = currentUser;

  //   console.log(req.user);

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'you do not have the permission to perform this action',
          403
        )
      );
    }
    next();
  };
};
