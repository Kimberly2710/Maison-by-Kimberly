const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = require('../db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

router.get('/slides', (req, res) => {
  const sql = 'SELECT * FROM slides WHERE active = 1 ORDER BY sort_order ASC, id ASC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/new-arrivals', (req, res) => {
  const sql = 'SELECT * FROM products WHERE is_new_arrival = 1 AND sold = 0 ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/slides', upload.single('image'), (req, res) => {
  const { label, title, description, action_text, action_link, alt_text } = req.body;
  const image = req.file?.filename;

  if (!title || !image) {
    return res.status(400).json({ error: 'Title and image are required' });
  }

  const sql = `INSERT INTO slides (label, title, description, action_text, action_link, image, alt_text) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [label || null, title, description || null, action_text || null, action_link || null, image, alt_text || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: '✦ Slide added successfully', id: result.insertId });
  });
});

router.put('/slides/:id', upload.single('image'), (req, res) => {
  const { label, title, description, action_text, action_link, alt_text, active } = req.body;
  const image = req.file?.filename;

  const fields = [];
  const params = [];
  if (label !== undefined) { fields.push('label = ?'); params.push(label || null); }
  if (title !== undefined) { fields.push('title = ?'); params.push(title); }
  if (description !== undefined) { fields.push('description = ?'); params.push(description || null); }
  if (action_text !== undefined) { fields.push('action_text = ?'); params.push(action_text || null); }
  if (action_link !== undefined) { fields.push('action_link = ?'); params.push(action_link || null); }
  if (alt_text !== undefined) { fields.push('alt_text = ?'); params.push(alt_text || null); }
  if (active !== undefined) { fields.push('active = ?'); params.push(active ? 1 : 0); }
  if (image) { fields.push('image = ?'); params.push(image); }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  const sql = `UPDATE slides SET ${fields.join(', ')} WHERE id = ?`;
  params.push(req.params.id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Slide not found' });
    res.json({ message: '✦ Slide updated successfully' });
  });
});

router.delete('/slides/:id', (req, res) => {
  db.query('DELETE FROM slides WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Slide not found' });
    res.json({ message: '✦ Slide removed' });
  });
});

module.exports = router;
