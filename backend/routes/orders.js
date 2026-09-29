const express = require('express')
const nodemailer = require('nodemailer')
const router = express.Router()
const db = require('../db')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const OUTSIDE_MOMBASA_FEE = 300

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])
}

function validateOrder(order) {
  if (!order || !emailPattern.test(order.email || '')) return 'A valid customer email is required'
  if (!order.phoneNumber || !order.address || !Number.isFinite(Number(order.totalAmount))) return 'Complete delivery details are required'
  if (!order.customer?.firstName || !order.customer?.lastName || !order.customer?.city) {
    return 'Complete delivery details are required'
  }
  if (!Array.isArray(order.items) || order.items.length === 0) return 'At least one cart item is required'
  if (order.items.some(item => !item.name || !Number.isFinite(Number(item.price)) || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1)) {
    return 'Cart items are invalid'
  }
  return null
}

function itemRows(items) {
  return items.map(item => `<tr><td>${escapeHtml(item.name)}</td><td>${item.quantity}</td><td>KSh ${(Number(item.price) * item.quantity).toLocaleString()}</td></tr>`).join('')
}

router.post('/', async (req, res) => {
  const error = validateOrder(req.body)
  if (error) return res.status(400).json({ error })
  const merchantEmail = process.env.EMAIL_USER

  const { email, customer, items, paymentMethod } = req.body
  const phoneNumber = String(req.body.phoneNumber).trim()
  const address = String(req.body.address).trim()
  const totalAmount = Number(req.body.totalAmount)
  const isMombasa = customer.city === 'Mombasa'
  if (paymentMethod === 'cod' && !isMombasa) return res.status(400).json({ error: 'Cash on Delivery is only available within Mombasa' })

  try {
    const ids = [...new Set(items.map(item => Number(item.id)).filter(Number.isInteger))]
    if (ids.length !== items.length) return res.status(400).json({ error: 'Cart item IDs are invalid' })
    const [products] = await db.promise().query(`SELECT id, name, price, sold FROM products WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
    const productMap = new Map(products.map(product => [product.id, product]))
    const pricedItems = items.map(item => {
      const product = productMap.get(Number(item.id))
      if (!product || product.sold) return null
      return { ...item, name: product.name, price: Number(product.price), quantity: Number(item.quantity) }
    })
    if (pricedItems.some(item => !item)) return res.status(409).json({ error: 'One or more items are no longer available' })
    const subtotal = pricedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryFee = isMombasa ? 0 : OUTSIDE_MOMBASA_FEE
    const total = subtotal + deliveryFee
    const rows = itemRows(pricedItems)
    const deliveryLabel = deliveryFee === 0 ? 'Free' : `KSh ${deliveryFee.toLocaleString()}`

    const [result] = await db.promise().query(
      'INSERT INTO orders (email, phone_number, delivery_address, total_amount, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)',
      [email.trim(), phoneNumber, address, totalAmount || total, paymentMethod, 'pending']
    )

    try {
      await Promise.all([
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email.trim(),
          subject: 'Maison by Kimberly - Order Confirmation',
          text: `Thank you, ${customer.firstName}, for your luxury purchase from Maison by Kimberly.\n\nYour order has been logged successfully.\nOrder reference: ${result.insertId}\nTotal amount: KSh ${total.toLocaleString()}\nPayment method: ${paymentMethod}\nDelivery address: ${address}\n\nWe will contact you at ${phoneNumber} to confirm delivery.`,
        }),
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: merchantEmail,
          subject: 'NEW STORE ORDER RECEIVED',
          text: `NEW STORE ORDER RECEIVED\n\nOrder reference: ${result.insertId}\nBuyer email: ${email}\nPhone number: ${phoneNumber}\nDelivery address: ${address}\nPayment method: ${paymentMethod}\nTotal amount: KSh ${total.toLocaleString()}\nDelivery fee: ${deliveryLabel}\n\nItems:\n${rows.replace(/<[^>]+>/g, ' ')}`,
        }),
      ])
    } catch (mailError) {
      console.error('Order email notifications failed:', mailError.message)
    }

    res.status(200).json({ success: true, message: 'Order captured' })
  } catch (databaseError) {
    console.error('Order database failed:', databaseError)
    res.status(500).json({ error: 'We could not capture the order. Please try again.' })
  }
})

module.exports = router
