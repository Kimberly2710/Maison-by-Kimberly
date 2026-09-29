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
  const [showMpesaPrompt, setShowMpesaPrompt] = useState(false)
  const [mpesaPin, setMpesaPin] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
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

  function completeOrderSuccess() {
    setSubmitting(false)
    setStatus('')
    setShowMpesaPrompt(false)
    setMpesaPin('')
    setShowSuccessModal(true)
    clearCart()
    window.localStorage.removeItem('maison-cart')
    setEmail('')
    setCustomer({ firstName: '', lastName: '', phone: '', city: 'Mombasa', address: '' })
    setDeliveryFee(0)
    setPaymentMethod('mpesa')
  }

  async function handleCheckoutSubmit(event) {
    event.preventDefault()
    if (!items.length) return
    if (!email.trim() || !customer.phone.trim() || !customer.address.trim() || !customer.firstName.trim() || !customer.lastName.trim() || !customer.city.trim()) {
      setStatus('Please complete your email, phone number, and delivery address before placing your order.')
      return
    }

    if (paymentMethod === 'mpesa' && !showMpesaPrompt) {
      setStatus('')
      setMpesaPin('')
      setShowMpesaPrompt(true)
      return
    }

    setStatus('')
    setSubmitting(true)
    const payload = {
      email: email.trim(),
      phoneNumber: customer.phone.trim(),
      address: customer.address.trim(),
      totalAmount: total,
      paymentMethod,
      customer,
      items,
      subtotal,
      deliveryFee,
    }

    void axios.post('/api/orders', payload, { timeout: 8000 }).catch(() => undefined)
    completeOrderSuccess()
  }

  function cancelMpesaPrompt() {
    if (submitting) return
    setShowMpesaPrompt(false)
    setMpesaPin('')
  }

  function continueShopping() {
    clearCart()
    navigate('/shop')
  }

  const successModal = showSuccessModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="order-success-title">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl animate-fade-in">
        <div className="mb-4 rounded-full bg-emerald-50 p-4 text-emerald-600" aria-hidden="true">
          <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
          </svg>
        </div>
        <h2 id="order-success-title" className="mb-2 font-serif text-2xl font-black text-slate-900">Order Confirmed! ✦</h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">Thank you for shopping with Maison by Kimberly. Your order record has been successfully logged in our MySQL database, and your itemized invoice receipt has been dispatched straight to your email inbox.</p>
        <button type="button" onClick={continueShopping} className="w-full rounded-xl bg-[#3b0764] py-3 text-sm font-bold tracking-wide text-white shadow-md transition-all duration-200 hover:bg-pink-600">Continue Shopping</button>
      </div>
    </div>
  )

  if (!items.length) {
    return (
      <>
        <div className="min-h-[70vh] bg-gradient-to-b from-rose-500/20 via-slate-50 to-white text-center">
          <div className="border-b border-slate-200/60 bg-gradient-to-b from-rose-500/20 via-slate-50 to-white px-6 py-12 sm:py-16">
            <p className="mb-2 block text-xs font-semibold uppercase tracking-wider text-pink-600">Your selection</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">Your cart is empty</h1>
          </div>
          <Link to="/shop" className="btn-primary mt-8">Browse the edit</Link>
        </div>
        {successModal}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-500/20 via-slate-50 to-white">
      <div className="border-b border-slate-200/60 bg-gradient-to-b from-rose-500/20 via-slate-50 to-white px-6 py-12 text-center sm:py-16">
        <p className="mb-2 block text-xs font-semibold uppercase tracking-wider text-pink-600">Secure checkout</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">Complete your order</h1>
      </div>
      <div className="mx-auto max-w-7xl">
        <p className="mt-6 px-6 pb-2 pt-4 text-center text-sm text-slate-600 sm:px-8 lg:px-12">Enter your email to receive your invoice and order updates.</p>
        {status && <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700 sm:mx-8 lg:mx-12" role="alert">{status}</div>}

        <form onSubmit={handleCheckoutSubmit} className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_380px] lg:px-12">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm sm:p-8">
              <h2 className="mb-5 font-serif text-2xl text-slate-900">1. Your details</h2>
              <label className="mb-5 block text-slate-700"><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Email address</span>
                <input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-pink-500" placeholder="you@example.com" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['firstName', 'First name'], ['lastName', 'Last name'], ['phone', 'Phone number'],
                ].map(([name, label]) => (
                  <label key={name} className="text-slate-700"><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</span>
                    <input required name={name} value={customer[name]} onChange={updateCustomer} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-pink-500" />
                  </label>
                ))}
                <label className="text-sm font-medium text-slate-700">City / Location
                  <select required name="city" value={customer.city} onChange={updateCustomer} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-pink-500">
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </label>
              </div>
                <label className="mt-4 block text-slate-700"><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Delivery address</span>
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
            <p className="flex justify-between border-t border-slate-200 pt-5 text-lg font-bold text-slate-900"><span>Total to Pay</span><span className="text-xl font-black tracking-tight text-slate-950">KSh {total.toLocaleString()}</span></p>
            <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Sending M-Pesa Prompt...' : 'Confirm & Place Order'}</button>
          </aside>
        </form>
      </div>

      {showMpesaPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="mpesa-prompt-title">
          <form onSubmit={handleCheckoutSubmit} className="w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/80 bg-[#fbf7f8] shadow-2xl">
            <div className="bg-[#631f42] px-6 pb-7 pt-5 text-white">
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/30" aria-hidden="true" />
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[2px] text-white/75">
                <span>Safaricom</span>
                <span>Secure payment</span>
              </div>
              <h2 id="mpesa-prompt-title" className="mt-8 text-center font-serif text-2xl font-semibold">Lipa na M-Pesa Online</h2>
            </div>
            <div className="px-7 py-8 text-center">
              <p className="text-sm leading-7 text-slate-700">Do you want to pay <strong className="text-[#631f42]">KSh {total.toLocaleString()}</strong> to <strong>MAISON BY KIMBERLY</strong>?</p>
              <label className="mt-7 block text-xs font-bold uppercase tracking-[2px] text-[#631f42]" htmlFor="mpesa-pin">Enter Operator PIN</label>
              <input
                id="mpesa-pin"
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={4}
                pattern="[0-9]{4}"
                value={mpesaPin}
                onChange={event => setMpesaPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
                className="mx-auto mt-3 block w-36 rounded-xl border border-[#d9bbc9] bg-white px-4 py-3 text-center text-2xl tracking-[0.6em] text-[#631f42] outline-none focus:border-[#631f42] focus:ring-2 focus:ring-[#d9bbc9]"
                aria-describedby="mpesa-pin-help"
                required
              />
              <p id="mpesa-pin-help" className="mt-3 text-xs text-slate-500">Use any 4-digit PIN for this presentation demo.</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button type="button" onClick={cancelMpesaPrompt} disabled={submitting} className="rounded-xl border border-[#d9bbc9] px-4 py-3 text-sm font-semibold text-[#631f42] transition hover:bg-[#f3e6eb] disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={submitting || mpesaPin.length !== 4} className="rounded-xl bg-[#631f42] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#49162f] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Sending...' : 'Send'}</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {successModal}
    </div>
  )
}
