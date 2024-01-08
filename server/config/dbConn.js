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
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    console.log('db error');
    // process.exit(1); is a Node.js method that forcefully terminates the Node.js process with a status code of 1. The status code is a way to communicate the exit status of the process to the operating system.
    // a status code of 0 indicates success, and non-zero values indicate errors or other issues.
    // A status code of 1 typically indicates that the process is terminating due to an error or an abnormal condition.
    process.exit(1);
  }
};



module.exports = connectDB;
// module.exports = { connectDB, insertUser };
