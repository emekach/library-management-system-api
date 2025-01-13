const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const db = process.env.DATABASE_URL.replace(
      '<db_password>',
      process.env.DATABASE_PASSWORD
    );
    await mongoose.connect(db);
    console.log('Database Connected successfully');
  } catch (err) {
    console.log('Database connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
