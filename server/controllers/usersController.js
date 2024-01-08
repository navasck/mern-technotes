const User = require('../models/User');
const Note = require('../models/Note');
// express-async-handler
// It helps in handling asynchronous errors in Express route handlers by wrapping them in a function. This way, you can use try-catch blocks or handle errors in a more streamlined manner.
const asyncHandler = require('express-async-handler');
// bcrypt is a library used for hashing passwords securely. It is a popular choice for securely storing user passwords in databases.
// Hashing passwords is important for security because it adds an extra layer of protection. Instead of storing plain text passwords, you store their hash values, making it more difficult for attackers to retrieve the original passwords.
const bcrypt = require('bcrypt');

// defining route handler functions below

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select('-password').lean();

  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' });
  }

  res.json(users);
});

// Getting Users from MongoDB:

// User.find(): Retrieves all users from the MongoDB database.
// .select('-password'): Excludes the 'password' field from the returned user objects. This is a common practice to avoid exposing sensitive information.
// .lean(): Converts the Mongoose documents to plain JavaScript objects. This is often done to make the objects easier to work with and to omit Mongoose-specific properties.
// Using .lean() can be more efficient if you don't need Mongoose-specific features and methods, and you just want the raw data.

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicate username
  //  Uses User.findOne({ username }) to check if a user with the provided username already exists. If a duplicate is found, it returns a 409 status with a JSON response indicating a duplicate username.

  // .exec():
  // This is a Mongoose method that executes the query.
  // It's used here to explicitly execute the query. In some cases, Mongoose queries are executed automatically, but using .exec() allows you to await the result in a more explicit way.

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  // Hash password
  // 10: This is the number of salt rounds used in the hashing process. The higher the number, the more secure but also slower the hashing. The common practice is to use a value between 10 and 12.
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { username, password: hashedPwd, roles };

  // to create and store the new user in the MongoDB database.
  const user = await User.create(userObject);

  if (user) {
    //created
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res
      .status(400)
      .json({ message: 'All fields except password are required' });
  }

  // Does the user exist to update?
  // Uses User.findById(id) to find a user in the MongoDB database based on the provided id.
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  // Allow updates to the original user
  // duplicate?._id.toString() !== id: This checks if the duplicate user's _id (MongoDB ObjectId) is not the same as the _id received in the request (id).
  // If the condition is true (i.e., a duplicate username is found and it's not the same user being updated), it returns a response with a 409 status code (Conflict) and a JSON object containing a message indicating a duplicate username.
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  // Uses user.save() to persist the changes to the user in the MongoDB database.
  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'User ID Required' });
  }

  // Does the user still have assigned notes?
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: 'User has assigned notes' });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};

//Mongoose Major Methods that you can use to interact with MongoDB.

// 1. findOne   - Use findOne when you want to retrieve a single document based on specific criteria.
// 2. find      - Use find when you want to retrieve multiple documents based on specific criteria.
// 3. findById  - Use findById when you want to retrieve a document by its unique identifier (_id).
// 4. create    - used to create and save a new document in the database. It takes an object representing the document and returns a promise that resolves to the created document.
// eg:  const newUser = await User.create({ username: 'navas', password: 'hashedPwd', roles: ['user'] });
// 5. updateOne, updateMany, update:

// These methods are used to update documents in the database.
// updateOne  -  updates a single document that matches the specified filter.
// updateMany -  updates multiple documents that match the specified filter.
// update -  is an alias for updateOne.

// eg: await User.updateOne(
//   { username: 'john_doe' },
//   { $set: { roles: ['admin'] } }
// );

// 6.deleteOne, deleteMany, remove:

// These methods are used to delete documents from the database.
// deleteOne - deletes a single document that matches the specified filter.
// deleteMany -  deletes multiple documents that match the specified filter.
// remove is an alias for deleteOne.
// eg: await User.deleteOne({ username: 'john_doe' });

// 7. findOneAndUpdate, findOneAndDelete:

// These methods are used to find a single document and update or delete it atomically.
// findOneAndUpdate - finds a document, updates it, and returns the original or modified document.
// findOneAndDelete  - finds a document, deletes it, and returns the deleted document.
// eg: const updatedUser = await User.findOneAndUpdate({ username: 'john_doe' }, { $set: { active: false } }, { new: true });

// 8. countDocuments:

// The countDocuments method is used to count the number of documents that match the specified filter.

// const count = await User.countDocuments({ active: true });

//9. distinct:

// The distinct method is used to find distinct values for a specified field across a collection.
// const uniqueRoles = await User.distinct('roles');
