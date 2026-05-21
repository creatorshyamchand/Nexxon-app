// App.jsx - Complete working version with proper Telegram Login
import { useState, useEffect } from 'react'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import About from './pages/About'
import Account from './pages/Account'
import TelegramLoginModal from './components/TelegramLoginModal'
import { getSession, setSession } from './lib/session'
import { showToast } from './lib/toast'

export default function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check for existing session on load
  useEffect(() => {
    const savedUser = getSession()
    if (savedUser) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  // Listen for Telegram login events
  useEffect(() => {
    const handleTelegramLogin = (event) => {
      const telegramUser = event.detail
      if (telegramUser) {
        // Create user object from Telegram data
        const newUser = {
          id: telegramUser.id,
          name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
          username: telegramUser.username ? `@${telegramUser.username}` : null,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name || '',
          photoUrl: telegramUser.photo_url,
          authDate: telegramUser.auth_date,
          loginTime: Date.now()
        }
        
        setSession(newUser)
        setUser(newUser)
        setShowLogin(false)
        showToast(`Welcome ${newUser.name}! 🎉`, 'success')
      }
    }

    window.addEventListener('telegram-login-success', handleTelegramLogin)
    return () => window.removeEventListener('telegram-login-success', handleTelegramLogin)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('home')
    localStorage.removeItem('telegram_session')
    showToast('Logged out successfully', 'info')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-md border-b border-white/10 h-14 flex items-center px-4">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">
            N
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">
              NEx<span className="text-primary">XON</span>
            </span>
            <p className="text-[10px] text-gray-500 -mt-1">API Marketplace</p>
          </div>
        </button>
        
        <div className="flex-1" />
        
        {user ? (
          <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="text-gray-200 text-sm font-medium max-w-[120px] truncate hidden sm:block">
              {user.name?.split(' ')[0]}
            </span>
            <button 
              onClick={() => setCurrentPage('account')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
            </svg>
            Login
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-20">
        {currentPage === 'home' && <Home user={user} onLogin={() => setShowLogin(true)} />}
        {currentPage === 'about' && <About onNavigate={setCurrentPage} />}
        {currentPage === 'account' && (
          <Account
            user={user}
            onLogin={() => setShowLogin(true)}
            onLogout={handleLogout}
            onNavigate={setCurrentPage}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onLoginClick={() => setShowLogin(true)}
      />

      {/* Login Modal */}
      {showLogin && (
        <TelegramLoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  )
}