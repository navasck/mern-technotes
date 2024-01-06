const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
  // The path.join function is used to construct the absolute path to the index.html file.
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;
