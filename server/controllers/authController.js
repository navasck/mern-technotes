const User = require('../models/User');
const bcrypt = require('bcrypt');
// jsonwebtoken is a popular npm package for handling JSON Web Tokens (JWT) in Node.js applications. JWT is a compact, URL-safe means of representing claims to be transferred between two parties. It is commonly used for authentication and information exchange between parties.
// jwt referenced as form of user identification which is issued after the initial user authentication takes place. once user completes their login and authenticated our rest api will issue the client application a access token and a refresh token.
// Access Token - Short Time, Sent as JSON, Client Stores in memory. Do not store in local storage or cookie. Issued after authentication. client uses for api access until expires. our rest api will verify the token with middleware every time the token issued to make request. when the access token does expires, the users application will need to send the refresh token to our REST api to refresh endpoint to be granted a new access token.
// Refresh Token - long Time, sent as httpOnly cookie. Not accessible via javascript. Must have expiry at some point. should not have the ability to issue new refresh tokens, bcoz that would grand indefinite access. issued after authentication. verified with endpoint. used to request new access token. must be allowed to expire or logout.
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // look for the user in mongoDB Database
  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // bcrypt.compare function to compare a plaintext password with the hashed password stored in the foundUser object. This is a common approach for password verification in a secure manner.
  // password: The plaintext password that the user entered during the login attempt.
  // foundUser.password: The hashed password stored in the database for the user found based on the provided username or email.
  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: 'Unauthorized' });

  // jwt.sign function
  // first argument is payload -  It contains the information you want to include in the token.
  // second argument  - secret key used to sign the token. It should be kept confidential.
  // third argument - specifies the expiration time of the token.
  // Result: The accessToken variable will contain the signed JWT.

  // username & roles - this informations inserted into accessToken, and we would need to destructure that access token when we return that information in the frontend application as well. so all the frontend will have in state access token to destructure it decrypt it and pull this information out.
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  // Refresh tokens are commonly used in token-based authentication systems to obtain a new access token after the original access token has expired. The client can use the refresh token to request a new access token without requiring the user to log in again.

  // It's important to handle refresh tokens securely, store them securely on the client (e.g., in an HTTP-only cookie), and implement proper token rotation and expiration policies. Additionally, use secure communication (HTTPS) to transmit tokens between the client and the server.

  // An HTTP-only cookie is a type of cookie that is set using the HTTP protocol and is inaccessible to JavaScript running in the browser. This provides an additional layer of security, as it helps protect sensitive information stored in cookies from certain types of attacks, such as cross-site scripting (XSS).

  // HTTP-only cookies are set by including the HttpOnly attribute in the Set-Cookie header of an HTTP response. For example:
  // Set-Cookie: myCookie=myValue; HttpOnly

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  // Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    // This is often necessary for scenarios where your frontend and backend are hosted on different domains or subdomains.
    sameSite: 'None', //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  res.json({ accessToken });

  // Ensure that your application is properly configured for HTTPS to make use of the secure cookie features. Additionally, consider implementing proper token rotation, expiration, and refresh token handling in your authentication flow.
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {};

module.exports = {
  login,
  refresh,
  logout,
};
