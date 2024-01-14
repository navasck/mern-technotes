const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');

router.route('/').post(loginLimiter, authController.login);
router.route('/refresh').get(authController.refresh);
router.route('/logout').post(authController.logout);

module.exports = router;

// when we access http://localhost:3500/auth , we will receive our access token in body. we also received more than that.
// we will receive the secure cookie and it has refresh token in it. (Top right section in postman- cookies- jwt)

// To Do
// as we are setting expiry for access token, that where we need to send refresh token to get new access token. we need to automate that in our react application. needs to do with redux
