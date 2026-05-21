const SESSION_KEY = 'nexxon_user_session'
const ORDERS_KEY = 'nexxon_user_orders'
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    if (!data) return null
    const parsed = JSON.parse(data)
    if (parsed.loginTime && Date.now() - parsed.loginTime > SESSION_TTL) {
      clearSession()
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function setSession(user) {
  try {
    const session = { ...user, loginTime: Date.now() }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch (e) {
    console.error('Failed to save session:', e)
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function saveOrder(orderData) {
  try {
    const orders = getOrders()
    orders.unshift({ ...orderData, savedAt: Date.now() })
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  } catch (e) {
    console.error('Failed to save order:', e)
  }
}

export function getOrders() {
  try {
    const data = localStorage.getItem(ORDERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function generateOrderId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `n3xxon-${result}`
}

export function generateDiscount() {
  return Math.floor(Math.random() * 11) + 20 // 20–30
}
