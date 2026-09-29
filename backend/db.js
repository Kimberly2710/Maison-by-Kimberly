const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database');

  const createTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      size VARCHAR(50),
      description TEXT,
      image VARCHAR(255),
      front_image VARCHAR(255),
      back_image VARCHAR(255),
      video_url VARCHAR(255),
      video_file VARCHAR(255),
      is_new_arrival TINYINT(1) DEFAULT 0,
      sold TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTable, (err) => {
    if (err) {
      console.error('❌ Error creating table:', err.message);
    } else {
      console.log('✅ Products table ready');
    }
  });

  // Ensure required product columns exist for older installations
  const addCols = `ALTER TABLE products
    ADD COLUMN IF NOT EXISTS front_image VARCHAR(255),
    ADD COLUMN IF NOT EXISTS back_image VARCHAR(255),
    ADD COLUMN IF NOT EXISTS video_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS video_file VARCHAR(255),
    ADD COLUMN IF NOT EXISTS is_new_arrival TINYINT(1) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS sold TINYINT(1) DEFAULT 0`;
  db.query(addCols, (err) => {
    if (err) {
      // Not fatal — some older MySQL versions may not support IF NOT EXISTS; ignore error
    }
  });

  const createSlides = `
    CREATE TABLE IF NOT EXISTS slides (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(120),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      action_text VARCHAR(100),
      action_link VARCHAR(255),
      image VARCHAR(255) NOT NULL,
      alt_text VARCHAR(255),
      sort_order INT DEFAULT 0,
      active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createSlides, (err) => {
    if (err) {
      console.error('❌ Error creating slides table:', err.message);
    } else {
      console.log('✅ Slides table ready');
    }
  });

  const createOrders = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      phone_number VARCHAR(50) NOT NULL,
      delivery_address TEXT NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createOrders, (err) => {
    if (err) console.error('❌ Error creating orders table:', err.message);
  });

  const orderCols = `ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) NOT NULL DEFAULT 'unknown',
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'pending'`;
  db.query(orderCols, () => {});

  const createUserSessions = `
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      authenticated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createUserSessions, (err) => {
    if (err) console.error('❌ Error creating user sessions table:', err.message);
  });
});

module.exports = db;