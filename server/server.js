// dotenv is a popular Node.js module used for loading environment variables from a file named .env into process.env. It's commonly used in Node.js applications to manage configuration settings and sensitive information such as API keys, database connection strings, and other environment-specific variables.
require('dotenv').config();
//get colors in your node.js console.
const colors = require('colors');
const express = require('express');
const app = express();

// provides utilities for working with file and directory paths.
const path = require('path');

const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// cookie-parser middleware is commonly used to parse and handle HTTP cookies in your web application.
// The cookie-parser middleware parses the Cookie header from the incoming HTTP request and populates 'req.cookies' with an object keyed by cookie names.
const cookieParser = require('cookie-parser');

// The cors middleware is commonly used to handle Cross-Origin Resource Sharing (CORS) in web applications.
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
// const { connectDB, insertUser } = require('./connectDB');


// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js, providing a higher-level, schema-based abstraction over the MongoDB JavaScript driver.
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

console.log('NODE_ENV', process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

// Body Parsing Middleware:  Parses the request body, making it accessible through req.body.
// Parse JSON-encoded bodies
app.use(express.json());
// Parse URL-encoded bodies
// The extended option determines how the URL-encoded data is parsed. It can have two possible values:
// extended: true: This option allows the parsing of URL-encoded data with rich objects and arrays. It uses the qs library under the hood, which provides extended parsing capabilities.
// extended: false: This option uses the built-in querystring module of Node.js to parse URL-encoded data. It only supports simple key-value pairs and does not handle nested objects or arrays.
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Custom Middleware
// Middlewares have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle (next).
// const logger = (req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// };

// express.static: This is middleware provided by Express to serve static files. It takes the root directory from which to serve the static assets.
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));
app.use('/users', require('./routes/userRoutes'));
// app.use('/notes', require('./routes/noteRoutes'));

// app.all() method is a special routing method that is used to handle all HTTP methods for a specific route.
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// this will over write the default express error handler
app.use(errorHandler);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error',err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});


// Mongoose uses the Node.js EventEmitter pattern to provide a set of events that you can listen to in your application.
// mongoose.connection.once('open', () => { ... });:

// This listens for the 'open' event, which is emitted once when Mongoose successfully connects to MongoDB. When the connection is open, it logs a message indicating that it's connected to MongoDB and starts the Express server using app.listen().

// This is a way to ensure that certain actions, like starting your server, only happen after a successful database connection has been established.
