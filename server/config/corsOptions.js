const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;

// origin: A function that checks whether the incoming request's origin is allowed.

// If the origin is found in the allowedOrigins array or if there is no specified origin (!origin), the callback is called with null and true, indicating that the request is allowed.
// If the origin is not allowed, the callback is called with an error.
// credentials: Indicates whether credentials (such as cookies, HTTP authentication) should be included in the CORS request.

// optionsSuccessStatus: Sets the status code to use for successful OPTIONS requests. In this case, it's set to 200.
