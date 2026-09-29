const express = require('express');
const router = express.Router();
const db = require('../db');
require('dotenv').config();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    db.promise().query(
      'INSERT INTO user_sessions (user_id, email, authenticated_at) VALUES (?, ?, NOW())',
      [username, username]
    ).catch((error) => console.error('User authentication audit failed:', error.message));
    res.json({ success: true, message: 'Welcome back, Kim ✦' });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect credentials' });
  }
});

module.exports = router;