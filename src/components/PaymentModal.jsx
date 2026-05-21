import { useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { generateOrderId, generateDiscount, saveOrder } from '../lib/session'
import { showToast } from '../lib/toast'

const UPI_ID = 'nexxon@upi'
const MERCHANT_NAME = 'NExXON API Marketplace'
const TG_BOT_TOKEN = '8380074229:AAFgmH4xBaD_Z_pVIjez-qC-mXBBBs4z4cI'
const TG_ADMIN_CHAT_ID = '7224704901'

function buildOrderCaption(order) {
  return `🆕 <b>NEW ORDER — REVIEW REQUIRED</b>

🆔 Order ID: <code>${order.orderId}</code>
👤 Name: ${order.userName}
📱 Username: ${order.userUsername ? '@' + order.userUsername.replace('@', '') : 'N/A'}
📞 Phone: ${order.userPhone || 'N/A'}

🏷️ API: <b>${order.apiName}</b>
💰 Amount Paid: ₹${order.totalAmount} (saved ₹${order.discount})
🔢 UTR: <code>${order.utrNumber}</code>

⏰ Time: ${new Date().toLocaleString('en-IN')}
🌐 IP: ${order.ipAddress}`
}

function buildApproveRejectKeyboard(orderId) {
  return {
    inline_keyboard: [[
      { text: '✅ Approve', callback_data: `approve:${orderId}` },
      { text: '❌ Reject',  callback_data: `reject:${orderId}` },
    ]],
  }
}

// Send order notification to admin — photo+caption+buttons if screenshot exists, else text+buttons
async function sendOrderToAdmin(order, screenshotFile) {
  const caption = buildOrderCaption(order)
  const keyboard = buildApproveRejectKeyboard(order.orderId)

  if (screenshotFile) {
    try {
      const fd = new FormData()
      fd.append('chat_id', TG_ADMIN_CHAT_ID)
      fd.append('photo', screenshotFile)
      fd.append('caption', caption)
      fd.append('parse_mode', 'HTML')
      fd.append('reply_markup', JSON.stringify(keyboard))
      await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendPhoto`, { method: 'POST', body: fd })
    } catch { /* non-critical */ }
  } else {
    try {
      await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_ADMIN_CHAT_ID,
          text: caption,
          parse_mode: 'HTML',
          reply_markup: keyboard,
        }),
      })
    } catch { /* non-critical */ }
  }
}

export default function PaymentModal({ api, user, onClose, onSuccess }) {
  const [utr, setUtr] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  const discount = generateDiscount()
  const totalAmount = api.price - discount
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('NExXON API: ' + api.name)}`

  const handleFileChange = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Only image files are allowed', 'error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Screenshot must be under 5MB', 'error')
      return
    }
    setScreenshot(file)
    const reader = new FileReader()
    reader.onload = e => setScreenshotPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback(e => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }, [])

  const handleSubmit = async () => {
    if (!utr.trim() || utr.trim().length < 6) {
      showToast('Enter a valid UTR / Transaction ID (min 6 chars)', 'error')
      return
    }

    setLoading(true)

    try {
      const orderId = generateOrderId()

      // Upload screenshot if provided
      let screenshotUrl = null
      if (screenshot) {
        const ext = screenshot.name.split('.').pop()
        const path = `orders/${orderId}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('payment-screenshots')
          .upload(path, screenshot)

        if (!uploadErr) {
          const { data: urlData } = supabase.storage
            .from('payment-screenshots')
            .getPublicUrl(path)
          screenshotUrl = urlData.publicUrl
        }
      }

      // Get user IP (best-effort)
      let ipAddress = 'Unknown'
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) })
        const ipData = await ipRes.json()
        ipAddress = ipData.ip || 'Unknown'
      } catch { /* no-op */ }

      // Save to database (include telegram_user_id for per-user order lookup)
      const orderData = {
        order_id: orderId,
        user_name: user.name,
        user_username: user.username || null,
        user_phone: user.phone || null,
        telegram_user_id: user.id ? String(user.id) : null,
        api_name: api.name,
        original_price: api.price,
        discount,
        total_amount: totalAmount,
        utr_number: utr.trim(),
        screenshot_url: screenshotUrl,
        status: 'pending',
        ip_address: ipAddress,
      }

      const { error: dbErr } = await supabase
        .from('orders')
        .insert(orderData)

      if (dbErr) {
        console.error('DB insert error:', dbErr)
        showToast('Failed to save order. Please try again.', 'error')
        setLoading(false)
        return
      }

      // Save order_id to localStorage so Account page can look it up in Supabase
      saveOrder({
        orderId,
        apiName: api.name,
        totalAmount,
        discount,
        originalPrice: api.price,
        utrNumber: utr.trim(),
        status: 'pending',
      })

      // Send to admin with Approve / Reject inline keyboard
      await sendOrderToAdmin({
        orderId,
        userName: user.name,
        userUsername: user.username,
        userPhone: user.phone,
        apiName: api.name,
        discount,
        totalAmount,
        utrNumber: utr.trim(),
        ipAddress,
      }, screenshot)

      onSuccess({ orderId, api, totalAmount, discount, originalPrice: api.price })
    } catch (err) {
      console.error('Submit error:', err)
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-white/10 rounded-2xl w-full max-w-lg animate-slide-up shadow-2xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-white font-bold text-lg">Complete Payment</h2>
            <p className="text-gray-500 text-xs">{api.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Order Summary */}
          <div className="bg-surface rounded-xl p-4 space-y-2">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <span>🧾</span> Order Summary
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">API Access</span>
              <span className="text-white">{api.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Original Price</span>
              <span className="text-white">₹{api.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Discount</span>
              <span className="text-success">-₹{discount}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-primary font-black text-lg">₹{totalAmount}</span>
            </div>
          </div>

          {/* UPI Payment */}
          <div className="bg-surface rounded-xl p-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <span>💳</span> Pay via UPI
            </h3>
            <div className="text-center space-y-3">
              <div className="bg-white rounded-xl p-4 inline-block">
                {/* QR Code placeholder */}
                <div className="w-36 h-36 mx-auto bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-1">
                  <div className="grid grid-cols-7 gap-0.5 opacity-70">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-black text-xs font-bold mt-2">{UPI_ID}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-500 text-xs">or use UPI ID</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="bg-dark rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">UPI ID</p>
                  <p className="text-white font-mono font-bold">{UPI_ID}</p>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(UPI_ID); showToast('UPI ID copied!', 'success') }}
                  className="text-primary text-xs hover:text-white transition-colors border border-primary/30 rounded-lg px-3 py-1.5"
                >
                  Copy
                </button>
              </div>
              <a
                href={upiLink}
                className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                📱 Open UPI App
              </a>
            </div>
          </div>

          {/* Proof of Payment */}
          <div className="bg-surface rounded-xl p-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <span>✅</span> Proof of Payment
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs block mb-1.5">UTR / Transaction ID *</label>
                <input
                  type="text"
                  value={utr}
                  onChange={e => setUtr(e.target.value)}
                  placeholder="Enter UTR number or Transaction ID"
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1.5">Payment Screenshot <span className="text-gray-600">(optional but recommended)</span></label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    dragging ? 'border-primary bg-primary/10' :
                    screenshotPreview ? 'border-success/50 bg-success/5' :
                    'border-white/10 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  {screenshotPreview ? (
                    <div className="space-y-2">
                      <img src={screenshotPreview} alt="Screenshot" className="w-full max-h-32 object-contain rounded-lg mx-auto" />
                      <p className="text-success text-xs font-medium">Screenshot uploaded ✓</p>
                      <button
                        onClick={e => { e.stopPropagation(); setScreenshot(null); setScreenshotPreview(null) }}
                        className="text-red-400 text-xs hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-gray-400 text-sm">Drop screenshot here or click to upload</p>
                      <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP — Max 5MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleFileChange(e.target.files[0])}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !utr.trim()}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3.5 rounded-xl font-bold text-base hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner />
                Processing Order...
              </>
            ) : '🚀 Submit Order'}
          </button>

          <p className="text-gray-600 text-xs text-center">
            Your order will be processed within 24 hours. You'll be notified via Telegram.
          </p>
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
