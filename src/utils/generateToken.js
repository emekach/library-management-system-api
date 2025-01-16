const User = require('./../models/userModel');
const AppError = require('./AppError');

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User Not Found', 404);
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (err) {
    throw new AppError(`Error generating Tokens: ${err.message}`, 500);
  }
};

module.exports = generateAccessAndRefreshToken;
