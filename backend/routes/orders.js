const express = require('express')
const router = express.Router()
const db = require('../db')

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const OUTSIDE_MOMBASA_FEE = 300

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])
}

function validateOrder(order) {
  if (!order || !emailPattern.test(order.email || '')) return 'A valid customer email is required'
  if (!order.customer?.firstName || !order.customer?.lastName || !order.customer?.phone || !order.customer?.city || !order.customer?.address) {
    return 'Complete delivery details are required'
  }
  if (!Array.isArray(order.items) || order.items.length === 0) return 'At least one cart item is required'
  if (order.items.some(item => !item.name || !Number.isFinite(Number(item.price)) || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1)) {
    return 'Cart items are invalid'
  }
  return null
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error('Email service is not configured')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html }),
  })

  if (!response.ok) throw new Error(`Email provider returned ${response.status}`)
  return response.json()
}

function itemRows(items) {
  return items.map(item => `<tr><td>${escapeHtml(item.name)}</td><td>${item.quantity}</td><td>KSh ${(Number(item.price) * item.quantity).toLocaleString()}</td></tr>`).join('')
}

router.post('/', async (req, res) => {
  const error = validateOrder(req.body)
  if (error) return res.status(400).json({ error })
  if (!process.env.MERCHANT_NOTIFICATION_EMAIL) return res.status(503).json({ error: 'Merchant email is not configured' })

  const { email, customer, items, paymentMethod } = req.body
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
    const buyerHtml = `<h1>Maison by Kimberly</h1><p>Thank you, ${escapeHtml(customer.firstName)}. We received your order.</p><table><tr><th>Item</th><th>Qty</th><th>Total</th></tr>${rows}</table><p>Subtotal: KSh ${subtotal.toLocaleString()}<br>Delivery: ${deliveryLabel}<br><strong>Total: KSh ${total.toLocaleString()}</strong></p><p>We will contact you at ${escapeHtml(customer.phone)} to confirm delivery.</p>`
    const merchantHtml = `<h1>New Maison order</h1><p><strong>Buyer:</strong> ${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Phone:</strong> ${escapeHtml(customer.phone)}<br><strong>City:</strong> ${escapeHtml(customer.city)}<br><strong>Address:</strong> ${escapeHtml(customer.address)}<br><strong>Payment:</strong> ${escapeHtml(paymentMethod)}</p><table><tr><th>Item</th><th>Qty</th><th>Total</th></tr>${rows}</table><p><strong>Order total: KSh ${total.toLocaleString()}</strong></p>`

    await Promise.all([
      sendEmail({ to: [email], subject: 'Your Maison by Kimberly invoice', html: buyerHtml }),
      sendEmail({ to: [process.env.MERCHANT_NOTIFICATION_EMAIL], subject: 'New Maison by Kimberly order', html: merchantHtml }),
    ])
    res.status(201).json({ success: true, message: 'Order confirmed and emails sent' })
  } catch (sendError) {
    console.error('Order email failed:', sendError.message)
    res.status(502).json({ error: 'Order received, but confirmation email delivery failed' })
  }
})

module.exports = router
