const mongoose = require('mongoose');
const { isValid } = require('date-fns');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An author must have a name'],
      trim: true,
    },
    bio: {
      type: String,
    },
    birthDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return isValid(new Date(value));
        },
        message: 'Invalid date',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;
