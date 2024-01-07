const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DATABASE_URI);
//   } catch (err) {
//     console.log(err);
//   }
// };

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI);
    console.log('MongoDB connected...');
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    console.log('db error');
    process.exit(1);
  }
};

module.exports = connectDB;
