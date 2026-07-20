const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.json({ success: true, message: 'Welcome back, Kim ✦' });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect credentials' });
  }
});

module.exports = router;