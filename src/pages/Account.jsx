import { useState, useEffect, useCallback } from 'react'
import { clearSession, getOrders } from '../lib/session'
import { showToast } from '../lib/toast'
import { supabase } from '../lib/supabase'
import TelegramLoginModal from '../components/TelegramLoginModal'

export default function Account({ user, onLogin, onLogout, onNavigate }) {
  const [showLogin, setShowLogin] = useState(false)
  const [orders, setOrders] = useState(getOrders())
  const [refreshing, setRefreshing] = useState(false)

  // Merge localStorage orders with live Supabase status
  const fetchLiveOrders = useCallback(async () => {
    const localOrders = getOrders()
    if (localOrders.length === 0) { setOrders([]); return }
    const ids = localOrders.map(o => o.orderId).filter(Boolean)
    if (ids.length === 0) { setOrders(localOrders); return }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('order_id, status, updated_at')
        .in('order_id', ids)

      if (error || !data) return

      // Merge live status into local order data
      const statusMap = {}
      data.forEach(r => { statusMap[r.order_id] = r.status })

      setOrders(localOrders.map(o => ({
        ...o,
        status: statusMap[o.orderId] || o.status,
      })))
    } catch (e) {
      // silently keep local data on network error
    }
  }, [])

  // Fetch on mount and poll every 15s while Account is visible
  useEffect(() => {
    if (!user) return
    fetchLiveOrders()
    const interval = setInterval(fetchLiveOrders, 15000)
    return () => clearInterval(interval)
  }, [user, fetchLiveOrders])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchLiveOrders()
    setRefreshing(false)
  }

  const handleLogout = () => {
    clearSession()
    onLogout()
    showToast('Logged out successfully', 'success')
  }

  const handleLogin = (u) => {
    onLogin(u)
    setShowLogin(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark pt-8 pb-24 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center text-4xl mx-auto mb-6">
            👤
          </div>
          <h2 className="text-white font-black text-2xl mb-2">Not Logged In</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Login with your Telegram account to view your profile and order history.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
            </svg>
            Login with Telegram
          </button>
        </div>

        {showLogin && (
          <TelegramLoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
        )}
      </div>
    )
  }

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const memberDays = user.loginTime
    ? Math.max(1, Math.ceil((Date.now() - user.loginTime) / (1000 * 60 * 60 * 24)))
    : 1

  return (
    <div className="min-h-screen bg-dark pt-8 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-5">

        {/* Profile Card */}
        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 h-20 relative">
            <div className="absolute -bottom-8 left-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-black border-4 border-dark">
                {initials}
              </div>
            </div>
          </div>
          <div className="pt-10 pb-5 px-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-white font-bold text-xl">{user.name}</h2>
                {user.username && (
                  <p className="text-[#2AABEE] text-sm font-medium">@{user.username}</p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-medium border border-red-400/20 hover:border-red-400/40 rounded-lg px-3 py-2 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <InfoRow icon="📱" label="Phone" value={user.phone} />
              <InfoRow icon="🆔" label="Member" value={`${memberDays}d`} />
              <InfoRow icon="📦" label="Orders" value={String(orders.length)} />
              <InfoRow icon="✅" label="Status" value="Verified" valueClass="text-green-400" />
            </div>
          </div>
        </div>

        {/* Telegram Support CTA */}
        <a
          href="https://t.me/Creator_Hacking_bot"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 bg-[#2AABEE]/10 border border-[#2AABEE]/20 rounded-2xl p-4 hover:border-[#2AABEE]/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2AABEE]/20 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="#2AABEE" className="w-6 h-6">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">@Creator_Hacking_bot</p>
            <p className="text-gray-500 text-xs">Contact support or get your API key</p>
          </div>
          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        {/* Orders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-lg">📦 My Orders</h3>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xs">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                title="Refresh order status"
                className="text-gray-500 hover:text-primary transition-colors disabled:opacity-40"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-card border border-white/5 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-white font-semibold mb-1">No orders yet</p>
              <p className="text-gray-500 text-sm mb-4">Browse the marketplace and purchase your first API!</p>
              <button
                onClick={() => onNavigate('home')}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Browse APIs →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, i) => (
                <OrderCard key={i} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, valueClass = 'text-white' }) {
  return (
    <div className="bg-surface rounded-xl px-3 py-2.5">
      <p className="text-gray-500 text-xs flex items-center gap-1.5 mb-0.5">
        <span>{icon}</span>{label}
      </p>
      <p className={`font-semibold text-sm ${valueClass}`}>{value}</p>
    </div>
  )
}

function OrderCard({ order }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(order.orderId || order.order_id || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const id = order.orderId || order.order_id || 'N/A'
  const apiName = order.apiName || order.api_name || order.api?.name || 'API'
  const total = order.totalAmount || order.total_amount || order.total || 0
  const discount = order.discount || 0
  const utr = order.utrNumber || order.utr_number || '—'
  const savedAt = order.savedAt ? new Date(order.savedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '—'

  const statusMap = {
    pending:    { label: '⏳ Pending Review',  cls: 'bg-yellow-500/20 text-yellow-400', border: 'border-white/5' },
    processing: { label: '🔄 Processing',      cls: 'bg-blue-500/20 text-blue-400',    border: 'border-white/5' },
    approved:   { label: '✅ Approved',         cls: 'bg-green-500/20 text-green-400',  border: 'border-green-500/20' },
    fulfilled:  { label: '✅ Fulfilled',        cls: 'bg-green-500/20 text-green-400',  border: 'border-green-500/20' },
    rejected:   { label: '❌ Rejected',         cls: 'bg-red-500/20 text-red-400',      border: 'border-red-500/20' },
    cancelled:  { label: '🚫 Cancelled',        cls: 'bg-red-500/20 text-red-400',      border: 'border-white/5' },
  }
  const status = statusMap[order.status] || statusMap.pending
  const isApproved = order.status === 'approved' || order.status === 'fulfilled'
  const isRejected = order.status === 'rejected' || order.status === 'cancelled'

  return (
    <div className={`bg-card border ${status.border} rounded-2xl p-4 space-y-3`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{apiName}</p>
          <button
            onClick={copy}
            className="flex items-center gap-1 text-gray-500 text-xs hover:text-gray-300 transition-colors mt-0.5"
          >
            <span className="font-mono truncate max-w-[120px]">{id}</span>
            <span>{copied ? '✓' : '⎘'}</span>
          </button>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${status.cls}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-surface rounded-lg p-2">
          <p className="text-gray-600 mb-0.5">Paid</p>
          <p className="text-primary font-bold">₹{total}</p>
        </div>
        <div className="bg-surface rounded-lg p-2">
          <p className="text-gray-600 mb-0.5">Saved</p>
          <p className="text-green-400 font-bold">₹{discount}</p>
        </div>
        <div className="bg-surface rounded-lg p-2">
          <p className="text-gray-600 mb-0.5">UTR</p>
          <p className="text-white font-medium truncate">{utr.length > 10 ? utr.slice(0, 10) + '…' : utr}</p>
        </div>
      </div>

      {isApproved && (
        <a
          href="https://t.me/nexxxon_dm_bot"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold py-2 rounded-xl hover:bg-green-500/20 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
          </svg>
          Get Your API Key → @nexxxon_dm_bot
        </a>
      )}

      {isRejected && (
        <a
          href="https://t.me/nexxxon_dm_bot"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold py-2 rounded-xl hover:bg-red-500/20 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
          </svg>
          Contact Support → @nexxxon_dm_bot
        </a>
      )}

      <p className="text-gray-700 text-xs">{savedAt}</p>
    </div>
  )
}
