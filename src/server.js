const connectDB = require('./config/connectDB');
const mongoose = require('mongoose');

process.on('uncaughtException', (err, origin) => {
  console.log('UncaughtException: ', err.message);
  console.log(`Exception origin: ${origin}`);
  process.exit(1);
});

const app = require('./app');

connectDB();

const port = process.env.PORT || 4000;
mongoose.connection.once('open', () => {
  console.log('Database connected successfully');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});
