export default function BottomNav({ currentPage, onNavigate, user, onLoginClick }) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-primary' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'about',
      label: 'About',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-primary' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'account',
      label: user ? 'Account' : 'Login',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-primary' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  const handleTabClick = (id) => {
    if (id === 'account' && !user) {
      onLoginClick()
      return
    }
    onNavigate(id)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-md border-t border-white/10 safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = currentPage === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center gap-1 py-3 px-6 flex-1 transition-all ${
                active ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.icon(active)}
              <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-primary' : 'text-gray-500'}`}>
                {tab.label.toUpperCase()}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
