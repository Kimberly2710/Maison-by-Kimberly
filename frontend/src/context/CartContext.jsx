import { useEffect, useMemo, useState } from 'react'
import { CartContext } from './cart-context'

const STORAGE_KEY = 'maison-cart'

function readStoredCart() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addToCart(product, quantity = 1) {
    if (product.sold) return
    const amount = Math.max(1, Number(quantity) || 1)
    setItems(current => {
      const existing = current.find(item => item.id === product.id)
      if (existing) {
        return current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + amount } : item)
      }
      return [...current, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        size: product.size || '',
        image: product.image || product.front_image || product.back_image || '',
        quantity: amount,
      }]
    })
  }

  function updateQuantity(id, quantity) {
    setItems(current => quantity > 0
      ? current.map(item => item.id === id ? { ...item, quantity } : item)
      : current.filter(item => item.id !== id))
  }

  function removeFromCart(id) {
    setItems(current => current.filter(item => item.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const value = useMemo(() => ({
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

