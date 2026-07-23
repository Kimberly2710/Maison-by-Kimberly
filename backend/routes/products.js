const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isVideo = file.fieldname === 'video_file';
    const allowed = isVideo ? /mp4|mov|webm|avi/ : /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error(isVideo ? 'Only video files are allowed' : 'Only image files are allowed'));
  },
});

router.get('/', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM products ORDER BY created_at DESC';
  let params = [];

  if (category && category !== 'all') {
    sql = 'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC';
    params = [category];
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
});

router.post('/', upload.fields([{ name: 'front_image' }, { name: 'back_image' }, { name: 'video_file' }]), (req, res) => {
  const { name, category, price, size, description, is_new_arrival, video_url } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category and price are required' });
  }

  const front_image = req.files?.front_image?.[0]?.filename || null;
  const back_image = req.files?.back_image?.[0]?.filename || null;
  const video_file = req.files?.video_file?.[0]?.filename || null;
  const image = front_image || back_image || null;
  const cleanedVideoUrl = video_url?.trim() || null;

  const sql = `
    INSERT INTO products (name, category, price, size, description, image, front_image, back_image, video_url, video_file, is_new_arrival)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    name,
    category,
    parseFloat(price),
    size || null,
    description || null,
    image,
    front_image,
    back_image,
    cleanedVideoUrl,
    video_file,
    is_new_arrival === '1' ? 1 : 0,
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: '✦ Product added successfully',
      id: result.insertId,
    });
  });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: '✦ Product removed' });
  });
});

router.put('/:id', upload.fields([{ name: 'front_image' }, { name: 'back_image' }, { name: 'video_file' }]), (req, res) => {
  const { name, category, price, size, description, sold, is_new_arrival, video_url } = req.body;
  const front_image = req.files?.front_image?.[0]?.filename || null;
  const back_image = req.files?.back_image?.[0]?.filename || null;
  const video_file = req.files?.video_file?.[0]?.filename || null;
  const image = front_image || back_image || null;
  const cleanedVideoUrl = video_url?.trim() || null;

  // Build set clause dynamically
  const fields = [];
  const params = [];
  if (name !== undefined) { fields.push('name = ?'); params.push(name); }
  if (category !== undefined) { fields.push('category = ?'); params.push(category); }
  if (price !== undefined) { fields.push('price = ?'); params.push(parseFloat(price)); }
  if (size !== undefined) { fields.push('size = ?'); params.push(size || null); }
  if (description !== undefined) { fields.push('description = ?'); params.push(description || null); }
  if (sold !== undefined) { fields.push('sold = ?'); params.push(sold ? 1 : 0); }
  if (is_new_arrival !== undefined) { fields.push('is_new_arrival = ?'); params.push(is_new_arrival === '1' ? 1 : 0); }
  if (front_image) { fields.push('front_image = ?'); params.push(front_image); }
  if (back_image) { fields.push('back_image = ?'); params.push(back_image); }
  if (video_file) { fields.push('video_file = ?'); params.push(video_file); }
  if (video_url !== undefined) { fields.push('video_url = ?'); params.push(cleanedVideoUrl); }
  if (image) { fields.push('image = ?'); params.push(image); }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
  params.push(req.params.id);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: '✦ Product updated' });
  });
});

module.exports = router;