const express = require('express')
const axios = require('axios')
const nodemailer = require('nodemailer')
const db = require('../db')

const router = express.Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const sandboxApi = 'https://sandbox.safaricom.co.ke'
const sandboxShortCode = '174379'
const sandboxCallbackUrl = 'https://webhook.site'

function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '')
  if (/^0?7\d{8}$/.test(digits)) return `254${digits.slice(-9)}`
  if (/^2547\d{8}$/.test(digits)) return digits
  return null
}

function timestamp() {
  const date = new Date()
  const parts = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
  return parts.map((part, index) => index < 1 ? String(part) : String(part).padStart(2, '0')).join('')
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])
}

function itemRows(items) {
  return items.map(item => `<tr><td>${escapeHtml(item.name || 'Maison item')}</td><td>${Number(item.quantity) || 1}</td><td>KSh ${(Number(item.price) * (Number(item.quantity) || 1)).toLocaleString()}</td></tr>`).join('')
}

async function getAccessToken() {
  const credentials = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')
  const response = await axios.get(`${sandboxApi}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  })
  return response.data.access_token
}

function mailTransport() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) throw new Error('Email service is not configured')
  return nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 465),
    secure: String(process.env.EMAIL_SECURE || 'true') === 'true',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })
}

router.post('/mpesa', async (req, res) => {
  const { email, phoneNumber, address, totalAmount, paymentMethod = 'mpesa', items = [] } = req.body
  const phone = normalizePhone(phoneNumber)
  const amount = Math.round(Number(totalAmount))

  if (!emailPattern.test(String(email || '')) || !phone || !address || !Number.isInteger(amount) || amount < 1) {
    return res.status(400).json({ error: 'A valid email, Kenyan phone number, delivery address, and total amount are required' })
  }

  try {
    const accessToken = await getAccessToken()
    const requestTimestamp = timestamp()
    const password = Buffer.from(`${sandboxShortCode}${process.env.MPESA_PASSKEY}${requestTimestamp}`).toString('base64')
    const configuredCallbackUrl = process.env.MPESA_CALLBACK_URL || ''
    const callbackUrl = /localhost|127\.0\.0\.1|your-public-domain\.example/i.test(configuredCallbackUrl)
      ? sandboxCallbackUrl
      : configuredCallbackUrl || sandboxCallbackUrl
    const stkResponse = await axios.post(`${sandboxApi}/mpesa/stkpush/v1/processrequest`, {
      BusinessShortCode: sandboxShortCode,
      Password: password,
      Timestamp: requestTimestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phone,
      PartyB: sandboxShortCode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: 'Maison by Kimberly',
      TransactionDesc: 'Maison by Kimberly order',
    }, { headers: { Authorization: `Bearer ${accessToken}` } })

    if (stkResponse.data.ResponseCode !== '0') return res.status(502).json({ error: stkResponse.data.ResponseDescription || 'M-Pesa prompt could not be dispatched' })

    const [result] = await db.promise().query(
      'INSERT INTO orders (email, phone_number, delivery_address, total_amount, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)',
      [email.trim(), phone, address.trim(), amount, paymentMethod, 'pending']
    )

    try {
      const transporter = mailTransport()
      const rows = itemRows(Array.isArray(items) ? items : [])
      const customerHtml = `<h1>Maison by Kimberly</h1><p>Thank you for your order. Your M-Pesa payment prompt was sent to ${escapeHtml(phone)}.</p><table><tr><th>Item</th><th>Qty</th><th>Total</th></tr>${rows}</table><p><strong>Total: KSh ${amount.toLocaleString()}</strong></p><p>Order reference: ${result.insertId}</p>`
      const adminHtml = `<h1>New Maison checkout</h1><p><strong>Order:</strong> ${result.insertId}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Phone:</strong> ${escapeHtml(phone)}<br><strong>Delivery address:</strong> ${escapeHtml(address)}<br><strong>Total:</strong> KSh ${amount.toLocaleString()}<br><strong>Payment status:</strong> pending_stk</p><table><tr><th>Item</th><th>Qty</th><th>Total</th></tr>${rows}</table>`

      await Promise.all([
        transporter.sendMail({ from: process.env.EMAIL_USER, to: email.trim(), subject: 'Your Maison by Kimberly invoice', html: customerHtml }),
        transporter.sendMail({ from: process.env.EMAIL_USER, to: process.env.EMAIL_USER, subject: `New Maison order #${result.insertId}`, html: adminHtml }),
      ])
    } catch (mailError) {
      console.error('Email failed:', mailError)
    }

    return res.status(200).json({ success: true, message: 'Order captured' })
  } catch (error) {
    console.log(error.response ? error.response.data : error.message)
    return res.status(502).json({ error: 'We could not send the M-Pesa prompt or complete the order notification' })
  }
})

module.exports = router
