import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'

const OUTSIDE_MOMBASA_FEE = 300
const cities = ['Mombasa', 'Nairobi', 'Nakuru', 'Kisumu', 'Eldoret', 'Other']

export default function Checkout() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', phone: '', city: 'Mombasa', address: '' })
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isMombasa = customer.city === 'Mombasa'
  const total = subtotal + (items.length ? deliveryFee : 0)

  function updateCustomer(event) {
    const { name, value } = event.target
    setCustomer(current => ({ ...current, [name]: value }))
    if (name === 'city') {
      setDeliveryFee(value === 'Mombasa' ? 0 : OUTSIDE_MOMBASA_FEE)
      if (value !== 'Mombasa') setPaymentMethod(current => current === 'cod' ? 'mpesa' : current)
    }
  }

  async function placeOrder(event) {
    event.preventDefault()
    if (!items.length) return
    setSubmitting(true)
    setStatus('')
    try {
      await axios.post('/api/orders', { email, customer, paymentMethod, items, subtotal, deliveryFee, total })
      clearCart()
      navigate('/contact?order=confirmed')
    } catch (error) {
      setStatus(error.response?.data?.error || 'We could not place the order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!items.length) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-rose-500/20 via-slate-50 to-white px-6 py-24 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-pink-600">Your selection</p>
        <h1 className="font-serif text-4xl text-slate-900">Your cart is empty</h1>
        <Link to="/shop" className="btn-primary mt-8">Browse the edit</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-500/20 via-slate-50 to-white px-6 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-pink-600">Secure checkout</p>
          <h1 className="font-serif text-5xl leading-tight text-slate-900">Complete your order</h1>
          <p className="mt-3 text-sm text-slate-600">Enter your email to receive your invoice and order updates.</p>
        </div>

        <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm sm:p-8">
              <h2 className="mb-5 font-serif text-2xl text-slate-900">1. Your details</h2>
              <label className="mb-5 block text-sm font-medium text-slate-700">Email address
                <input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-pink-500" placeholder="you@example.com" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['firstName', 'First name'], ['lastName', 'Last name'], ['phone', 'Phone number'],
                ].map(([name, label]) => (
                  <label key={name} className="text-sm font-medium text-slate-700">{label}
                    <input required name={name} value={customer[name]} onChange={updateCustomer} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-pink-500" />
                  </label>
                ))}
                <label className="text-sm font-medium text-slate-700">City / Location
                  <select required name="city" value={customer.city} onChange={updateCustomer} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-pink-500">
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </label>
              </div>
              <label className="mt-4 block text-sm font-medium text-slate-700">Delivery address
                <textarea required name="address" value={customer.address} onChange={updateCustomer} rows="3" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-pink-500" />
              </label>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm sm:p-8">
              <h2 className="mb-5 font-serif text-2xl text-slate-900">2. Payment method</h2>
              <div className="grid gap-3">
                {[
                  ['mpesa', 'M-Pesa STK Push / Lipa na M-Pesa'],
                  ['card', 'Credit / Debit Card'],
                  ...(isMombasa ? [['cod', 'Cash on Delivery']] : []),
                ].map(([value, label]) => (
                  <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-4 text-sm font-semibold transition ${paymentMethod === value ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-200 text-slate-700 hover:border-pink-300'}`}>
                    <input type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={event => setPaymentMethod(event.target.value)} />
                    {label}
                  </label>
                ))}
              </div>
              {!isMombasa && (
                <p className="mt-4 rounded-lg border border-amber-200/60 bg-amber-50 p-3 text-xs font-medium text-amber-600">Notice: Cash on Delivery is exclusively available for orders within Mombasa. Please select M-Pesa or Card to complete cross-county shipping.</p>
              )}
              {status && <p className="mt-4 text-sm font-medium text-red-600">{status}</p>}
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/60 lg:sticky lg:top-28">
            <h2 className="mb-5 font-serif text-2xl text-slate-900">Order summary</h2>
            <div className="space-y-4 border-b border-slate-200 pb-5">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="min-w-0 flex-1"><p className="font-medium text-slate-900">{item.name}</p><p className="text-slate-500">KSh {item.price.toLocaleString()}</p></div>
                  <input aria-label={`Quantity for ${item.name}`} type="number" min="1" value={item.quantity} onChange={event => updateQuantity(item.id, Number(event.target.value))} className="w-14 rounded-lg border border-slate-300 px-2 py-1 text-center" />
                  <button type="button" onClick={() => removeFromCart(item.id)} className="text-xs text-slate-500 hover:text-pink-600">Remove</button>
                </div>
              ))}
            </div>
            <div className="space-y-3 py-5 text-sm text-slate-600"><p className="flex justify-between"><span>Subtotal</span><span>KSh {subtotal.toLocaleString()}</span></p><p className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? 'Free' : `KSh ${deliveryFee.toLocaleString()}`}</span></p></div>
            <p className="flex justify-between border-t border-slate-200 pt-5 text-lg font-bold text-slate-900"><span>Total to Pay</span><span>KSh {total.toLocaleString()}</span></p>
            <button disabled={submitting} className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Placing order...' : 'Confirm & Place Order'}</button>
          </aside>
        </form>
      </div>
    </div>
  )
}
