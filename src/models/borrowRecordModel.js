const mongoose = require('mongoose');

const borrowedRecordSchema = new mongoose.Schema({
  borrowedAt: {
    type: Date,
    required: [true, ' A book must have a borrowed at date'],
  },
  dueAt: {
    type: Date,
    required: [true, 'A book must have a due at date'],
  },
  returnedAt: Date,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: true,
  },
});

const borrowedRecord = mongoose.model('BorrowedRecord', borrowedRecordSchema);
module.exports = borrowedRecord;
