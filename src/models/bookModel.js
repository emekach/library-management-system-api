const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: [true, 'A book must have ISBN'],
    unique: true,
  },
  publishedDate: Date,
  status: {
    type: String,
    enum: ['Available', 'Bofrrowed'],
    default: 'Available',
    required: [true, 'A book must have a status'],
  },
  authorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Author',
    required: true,
  },
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
