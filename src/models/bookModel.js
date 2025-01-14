const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: [true, 'A book must have ISBN'],
    unique: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Borrowed'],
    default: 'Available',
    required: [true, 'A book must have a status'],
  },
  authorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
