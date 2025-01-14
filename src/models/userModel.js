const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ' A User must have a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'A user must input a password'],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Confirm password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    refreshToken: String,
    tokenVersion: Number,
    role: {
      type: String,
      enum: ['Admin', 'Librarian', 'Member'],
      default: 'Member',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
