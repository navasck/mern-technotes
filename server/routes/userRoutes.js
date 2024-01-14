const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');

// this middleware will be applied for all the routs inside this file.
router.use(verifyJWT);

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

// Exports the router instance,
module.exports = router;

// defining routes for a user-related resource using Express Router. The routes include operations like getting all users, creating a new user, updating a user, and deleting a user.

// Express Router:
// express.Router() creates an instance of an Express router, which is used to define routes.
