const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a text value'],
    unique: true, // Each username must be unique
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      default: 'Employee',
    },
  ],
  // hobbies: {
  //   type: [String], // Specifies an array of strings
  // },
  // projects: {
  //   type: [
  //     {
  //       title: String,
  //       description: String,
  //       startDate: Date,
  //       endDate: Date,
  //     },
  //   ],
  // },

  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('User', userSchema);

// schema is a way to define the structure of documents within a MongoDB collection.
// username, password, roles, and active:  fields in the user schema.
// The roles field is an array of strings representing user roles. The default value is set to 'Employee'.
// This model can be used to perform CRUD (Create, Read, Update, Delete) operations on documents in the 'users' collection of the connected MongoDB database.
// models are named in a singular form (e.g., 'User') and correspond to collections with names in a plural form (e.g., 'users').
// User - model name,  users - collections name


// eg:  {
//   "_id": ObjectId("60e7e428b9f8082e82a0b6b4"),
//   "username": "john_doe",
//   "password": "hashed_password",
//   "roles": ["Admin"],
//   "active": true
// }


// hobbies: ['Reading', 'Hiking'],
//   projects: [
//     {
//       title: 'Project 1',
//       description: 'Description for Project 1',
//       startDate: new Date('2022-01-01'),
//       endDate: new Date('2022-02-01'),
//     },]
