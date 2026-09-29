const express = require('express')
const db = require('../db')

const router = express.Router()

router.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const allowedStatuses = ['pending', 'Complete', 'Delivered', 'Cancelled']

  if (!allowedStatuses.includes(status) || !Number.isInteger(Number(id))) {
    return res.status(400).json({ error: 'A valid order ID and status are required' })
  }

  try {
    const [result] = await db.promise().query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, Number(id)]
    )
    if (!result.affectedRows) return res.status(404).json({ error: 'Order not found' })
    return res.status(200).json({ success: true, message: 'Order status updated successfully' })
  } catch (error) {
    console.error('Admin order status update failed:', error.message)
    return res.status(500).json({ error: 'Unable to update order status' })
  }
})

router.get('/orders', (req, res) => {
  db.promise().query('SELECT * FROM orders ORDER BY created_at DESC')
    .then(([orders]) => res.json(orders))
    .catch(error => {
      console.error('Admin orders lookup failed:', error.message)
      res.status(500).json({ error: 'Unable to load orders' })
    })
})

router.get('/users', (req, res) => {
  db.promise().query('SELECT user_id, email, authenticated_at FROM user_sessions ORDER BY authenticated_at DESC')
    .then(([users]) => res.json(users))
    .catch(error => {
      console.error('Admin user audit lookup failed:', error.message)
      res.status(500).json({ error: 'Unable to load user authentication logs' })
    })
})

module.exports = router
