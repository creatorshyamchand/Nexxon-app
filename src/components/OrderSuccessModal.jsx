export default function OrderSuccessModal({ order, onClose }) {
  const copyOrderId = () => {
    navigator.clipboard.writeText(order.orderId)
    alert('Order ID copied!')
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <div className="relative bg-card border border-success/30 rounded-2xl w-full max-w-md animate-slide-up shadow-2xl shadow-success/10 text-center">

        {/* Success animation */}
        <div className="p-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-success/30 to-emerald-500/30 flex items-center justify-center border-2 border-success/50">
              <svg className="w-12 h-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-white font-black text-2xl mb-2">Order Submitted!</h2>
          <p className="text-gray-400 text-sm mb-6">
            Your order has been placed successfully. Our team will process it within 24 hours.
          </p>

          {/* Order details */}
          <div className="bg-surface rounded-xl p-4 mb-6 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Order ID</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono text-sm font-bold">{order.orderId}</span>
                <button
                  onClick={copyOrderId}
                  className="text-primary text-xs hover:text-white transition-colors"
                  title="Copy Order ID"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">API</span>
              <span className="text-white text-sm">{order.api.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Amount Paid</span>
              <span className="text-success font-bold">₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">You Saved</span>
              <span className="text-warning font-bold">₹{order.discount} 🎉</span>
            </div>
          </div>

          {/* What's next */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 text-left">
            <p className="text-blue-300 text-xs font-semibold mb-2">📋 What happens next?</p>
            <ul className="text-gray-400 text-xs space-y-1.5">
              <li>• Your payment is being verified manually</li>
              <li>• API credentials will be sent via Telegram</li>
              <li>• Processing time: up to 24 hours</li>
              <li>• Contact support if you don't hear back</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
