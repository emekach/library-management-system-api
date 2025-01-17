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
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_ACCESS_TOKEN
  );

  const currentUser = await User.findById(decoded?._id).select(
    '-password -refreshToken -tokenVersion'
  );

  if (!currentUser || decoded?.tokenVersion !== currentUser.tokenVersion) {
    return next(new AppError('unauthorised access', 401));
  }

  req.user = currentUser;

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
