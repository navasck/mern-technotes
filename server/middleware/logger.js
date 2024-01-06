const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t${req.url}\t${req.headers.origin}`,
    'requiredLog.log'
  );
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };

// \t  &  \n   --escape sequence

// fsPromises
// fsPromises is a module in Node.js that provides promise-based versions of functions from the built-in fs (file system) module. It is introduced to support asynchronous programming using promises and is available starting from Node.js version 10.0.0.

// fs.existsSync
// fs.existsSync is a synchronous method in the traditional fs module that checks if a file or directory exists at a given path.
