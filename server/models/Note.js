const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500,
});

module.exports = mongoose.model('Note', noteSchema);

//  mongoose-sequence plugin for Mongoose, which provides auto-incrementing field functionality.
// The second argument to mongoose.Schema sets options, including enabling timestamps (createdAt and updatedAt fields).

// noteSchema.plugin(AutoIncrement, { inc_field: 'ticket', id: 'ticketNums', start_seq: 500 });:

// Uses the mongoose-sequence plugin to add an auto-incrementing field to the schema.
// The inc_field option specifies the field that will store the auto-incrementing value ('ticket' in this case).
// The id option is used to create a unique identifier for the sequence (e.g., 'ticketNums').
// The start_seq option sets the initial value of the sequence.

// eg: {
//   user: someUserId, // Replace with an actual user ID
//   title: 'Meeting',
//   text: 'Discuss project updates.',
//   completed: false,
// }
