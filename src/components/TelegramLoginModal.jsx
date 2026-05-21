// ============================================================
// COMPLETE FIXED TelegramLoginModal.jsx
// WORKING TELEGRAM LOGIN WIDGET
// ============================================================

import { useState, useEffect } from 'react'
import { setSession } from '../lib/session'
import { showToast } from '../lib/toast'

export default function TelegramLoginModal({ onClose, onLogin }) {
  const [step, setStep] = useState('login')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [telegramUser, setTelegramUser] = useState(null)

  // Load Telegram Login Widget Script
  useEffect(() => {
    // Remove any existing script to avoid duplicates
    const existingScript = document.querySelector('#telegram-login-script')
    if (existingScript) {
      existingScript.remove()
    }

    // Create and add the Telegram Login Widget script
    const script = document.createElement('script')
    script.id = 'telegram-login-script'
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.onload = () => {
      console.log('Telegram Widget loaded')
    }
    document.body.appendChild(script)

    // Define the callback function globally
    window.onTelegramAuth = (user) => {
      console.log('Telegram user:', user)
      setTelegramUser(user)
      setName(`${user.first_name} ${user.last_name || ''}`.trim())
      setUsername(user.username || '')
      setStep('profile')
      showToast(`Welcome ${user.first_name}!`, 'success')
    }

    return () => {
      // Cleanup
      delete window.onTelegramAuth
      const scriptToRemove = document.querySelector('#telegram-login-script')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [])

  const handleComplete = () => {
    if (!name.trim()) {
      showToast('Please enter your full name', 'error')
      return
    }

    const user = {
      id: telegramUser?.id,
      name: name.trim(),
      username: username.trim() ? `@${username.trim()}` : null,
      firstName: telegramUser?.first_name,
      lastName: telegramUser?.last_name,
      photoUrl: telegramUser?.photo_url,
      authDate: telegramUser?.auth_date,
      loginTime: Date.now()
    }

    setSession(user)
    onLogin(user)
    showToast(`Welcome ${user.name}! 🎉`, 'success')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2AABEE] to-[#229ED9] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Telegram Login</h2>
              <p className="text-gray-500 text-xs">Secure & instant access</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Step: Login via Telegram Widget */}
          {step === 'login' && (
            <div className="space-y-4 text-center">
              <div className="text-5xl mb-3">🔐</div>
              <h3 className="text-white font-semibold text-lg">Login with Telegram</h3>
              <p className="text-gray-400 text-sm">Click the button below to login instantly</p>
              
              <div className="flex justify-center my-6">
                {/* Telegram Login Button - Direct HTML */}
                <div 
                  className="telegram-login-container"
                  dangerouslySetInnerHTML={{
                    __html: `
                      <script async src="https://telegram.org/js/telegram-widget.js?22"
                        data-telegram-login="Creator_Hacking_bot"
                        data-size="large"
                        data-radius="12"
                        data-request-access="write"
                        data-onauth="onTelegramAuth(user)"
                        data-userpic="true">
                      </script>
                    `
                  }}
                />
              </div>

              <div className="bg-gray-800/50 rounded-xl p-3 text-xs text-gray-400">
                🔒 Your Telegram account info is used only for authentication
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full text-gray-500 text-sm hover:text-gray-300 transition-colors"
              >
                Having issues? Try refreshing the page
              </button>
            </div>
          )}

          {/* Step: Profile Completion */}
          {step === 'profile' && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-white font-medium">Welcome to NExXON!</p>
                <p className="text-gray-400 text-sm">Complete your profile</p>
              </div>

              {telegramUser?.photo_url && (
                <div className="flex justify-center">
                  <img 
                    src={telegramUser.photo_url} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full border-2 border-primary"
                  />
                </div>
              )}

              <div>
                <label className="text-gray-400 text-sm block mb-2">Full Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Full Name"
                  onKeyDown={e => e.key === 'Enter' && handleComplete()}
                  autoFocus
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Telegram Username <span className="text-gray-600">(optional)</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.replace('@', ''))}
                    placeholder="username"
                    className="w-full bg-surface border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                ✅ Complete Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}