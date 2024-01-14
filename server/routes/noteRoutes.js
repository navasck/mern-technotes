const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const verifyJWT = require('../middleware/verifyJWT');

// this middleware will be applied for all the routs inside this file.
router.use(verifyJWT);

router
  .route('/')
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;
