const express = require('express');
const app = express();

// provides utilities for working with file and directory paths.
const path = require('path');
const PORT = process.env.PORT || 3500;

// Body Parsing Middleware:  Parses the request body, making it accessible through req.body.
// Parse JSON-encoded bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Custom Middleware
// Middlewares have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle (next).
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// express.static: This is middleware provided by Express to serve static files. It takes the root directory from which to serve the static assets.
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
