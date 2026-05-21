import { useState, useMemo } from 'react'
import APICard from '../components/APICard'
import PaymentModal from '../components/PaymentModal'
import OrderSuccessModal from '../components/OrderSuccessModal'
import TelegramLoginModal from '../components/TelegramLoginModal'
import { APIS } from '../lib/apis'

const CATEGORIES = ['All', ...Array.from(new Set(APIS.map(a => a.category)))]

export default function Home({ user, onLogin }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedAPI, setSelectedAPI] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [successOrder, setSuccessOrder] = useState(null)
  const [showLogin, setShowLogin] = useState(false)

  const filteredAPIs = useMemo(() => {
    return APIS.filter(api => {
      const matchSearch = api.name.toLowerCase().includes(search.toLowerCase()) ||
                         api.description.toLowerCase().includes(search.toLowerCase()) ||
                         api.category.toLowerCase().includes(search.toLowerCase())
      const matchCategory = selectedCategory === 'All' || api.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [search, selectedCategory])

  const handleBuyClick = (api) => {
    if (!user) {
      setShowLogin(true)
      return
    }
    setSelectedAPI(api)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (order) => {
    setShowPayment(false)
    setSelectedAPI(null)
    setSuccessOrder(order)
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-[200px] h-[200px] bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-[200px] h-[200px] bg-primary/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-semibold tracking-wider">PERMANENT API ACCESS — ONE-TIME PAYMENT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            <span className="text-primary">NEx</span>
            <span className="text-secondary">XON</span>
            <br />
            <span className="text-white text-3xl sm:text-4xl lg:text-5xl">API MARKETPLACE</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Premium API access for developers & researchers. No subscriptions, no recurring fees.
            Pay once, use forever. Verified & fast delivery via Telegram.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 mb-10">
            {[
              { label: 'APIs Available', value: `${APIS.length}+` },
              { label: 'Orders Fulfilled', value: '2,400+' },
              { label: 'Delivery Time', value: '<24h' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-primary">{stat.value}</div>
                <div className="text-gray-500 text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search APIs..."
              className="w-full bg-surface border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-surface text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* API Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredAPIs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white font-semibold text-lg">No APIs found</p>
            <p className="text-gray-500 text-sm mt-2">Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                Showing <span className="text-white font-semibold">{filteredAPIs.length}</span> APIs
              </p>
              {search && (
                <button
                  onClick={() => { setSearch(''); setSelectedCategory('All') }}
                  className="text-primary text-xs hover:text-white transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAPIs.map(api => (
                <APICard key={api.id} api={api} onBuyClick={handleBuyClick} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showLogin && (
        <TelegramLoginModal
          onClose={() => setShowLogin(false)}
          onLogin={onLogin}
        />
      )}

      {showPayment && selectedAPI && (
        <PaymentModal
          api={selectedAPI}
          user={user}
          onClose={() => { setShowPayment(false); setSelectedAPI(null) }}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {successOrder && (
        <OrderSuccessModal
          order={successOrder}
          onClose={() => setSuccessOrder(null)}
        />
      )}
    </div>
  )
}
