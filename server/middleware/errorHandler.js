const { logEvents } = require('./logger');

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errLog.log'
  );
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500; // server error

  res.status(status);

  res.json({ message: err.message });
};

module.exports = errorHandler;

// err.stack

// err.stack is a property of the Error object in JavaScript. It represents a string containing a stack trace, which is a detailed report of the function calls and execution flow at the point where the error occurred.

// The stack trace typically includes:

// The file name and line number of each function call.
// The names of the functions in the call stack.
// Additional information about the source of the error.
