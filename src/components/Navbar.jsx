import { useState } from 'react'
import { clearSession } from '../lib/session'

export default function Navbar({ user, onLoginClick, onLogout, currentPage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    clearSession()
    onLogout()
    setProfileOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm">
              N
            </div>
            <span className="text-white font-bold text-lg tracking-wide">
              <span className="text-primary">NEx</span>
              <span className="text-secondary">XON</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'about' ? 'text-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              About Us
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl px-3 py-2 hover:border-primary/50 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-white text-sm font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-white/10 rounded-xl shadow-2xl animate-fade-in overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-white font-semibold text-sm">{user.name}</p>
                      {user.username && (
                        <p className="text-gray-400 text-xs">@{user.username.replace('@', '')}</p>
                      )}
                      <p className="text-gray-500 text-xs">{user.phone}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Login with Telegram
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-white/10 animate-fade-in">
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={() => { onNavigate('home'); setMenuOpen(false) }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === 'home' ? 'bg-primary/20 text-primary' : 'text-gray-400'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('about'); setMenuOpen(false) }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === 'about' ? 'bg-primary/20 text-primary' : 'text-gray-400'
              }`}
            >
              About Us
            </button>

            {user ? (
              <div className="border-t border-white/10 pt-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onLoginClick(); setMenuOpen(false) }}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold"
              >
                Login with Telegram
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
