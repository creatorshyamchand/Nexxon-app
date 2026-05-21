import { useState } from 'react'

export default function About({ onNavigate }) {
  const features = [
    {
      icon: '⚡',
      title: 'One-Time Payment',
      description: 'Pay once and get permanent API access. No hidden fees, no recurring subscriptions. Your key works forever.',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'All transactions are encrypted. We never store sensitive data. Your privacy is our top priority.',
    },
    {
      icon: '📱',
      title: 'Telegram Delivery',
      description: 'Receive your API keys directly via Telegram within 24 hours. Fast, reliable, and personal.',
    },
    {
      icon: '🚀',
      title: 'Premium APIs',
      description: 'Hand-picked premium APIs covering telecom, OSINT, vehicle, social media, banking and more.',
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Reach us anytime on Telegram. Our team responds within hours for any issues or questions.',
    },
    {
      icon: '🎯',
      title: 'Instant Discount',
      description: 'Every purchase comes with an auto-applied random discount of 20–30 rupees. Save automatically!',
    },
  ]

  const team = [
    { name: 'NEXUS', role: 'Founder & Lead Dev', avatar: '🧠', desc: 'The architect behind NExXON. Building privacy-first tools since 2020.' },
    { name: 'XORA', role: 'API Engineer', avatar: '⚙️', desc: 'Manages API integrations, uptime monitoring, and new partner onboarding.' },
    { name: 'NOVA', role: 'Support Head', avatar: '🛡️', desc: 'Ensures every customer gets their access within 24 hours, guaranteed.' },
  ]

  const faqs = [
    {
      q: 'What does "permanent access" mean?',
      a: 'Once you purchase, you receive an API key that works indefinitely. No monthly renewals, no expiry.',
    },
    {
      q: 'How do I receive my API key?',
      a: 'After payment verification, your API key and integration docs are delivered to your Telegram account within 24 hours.',
    },
    {
      q: 'What payment methods are accepted?',
      a: 'We accept all UPI payment methods including Google Pay, PhonePe, Paytm, and any UPI-enabled app.',
    },
    {
      q: 'What if my payment fails or I get no response?',
      a: 'Contact us immediately on Telegram with your UTR number. We process all valid payments and never ignore customers.',
    },
    {
      q: 'Can I use the APIs for commercial projects?',
      a: 'Yes! Our APIs come with no usage restrictions for personal or commercial use.',
    },
    {
      q: 'Is there a refund policy?',
      a: 'Due to the digital nature of API keys, all sales are final. We encourage you to reach out for support before requesting a refund.',
    },
  ]

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            About <span className="text-primary">NEx</span><span className="text-secondary">XON</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We are a team of developers and researchers building the most affordable API marketplace
            in India. Our mission: make powerful APIs accessible to everyone.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-3xl p-8 sm:p-12 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-white font-black text-2xl sm:text-3xl mb-4">Our Mission</h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            To democratize access to high-quality APIs by eliminating expensive subscription models.
            We believe every developer, researcher, and business — regardless of size — should have
            access to powerful data tools without recurring bills eating into their budget.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-white font-black text-2xl sm:text-3xl text-center mb-3">Why Choose NExXON?</h2>
        <p className="text-gray-500 text-center mb-10">Everything you need, nothing you don't.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-card border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all group">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-white font-black text-2xl sm:text-3xl text-center mb-3">The Team</h2>
        <p className="text-gray-500 text-center mb-10">The people behind the marketplace.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {team.map((member, i) => (
            <div key={i} className="bg-card border border-white/5 rounded-2xl p-6 text-center hover:border-secondary/30 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                {member.avatar}
              </div>
              <h3 className="text-white font-bold mb-1">{member.name}</h3>
              <p className="text-primary text-xs font-semibold mb-3">{member.role}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-white font-black text-2xl sm:text-3xl text-center mb-3">How It Works</h2>
        <p className="text-gray-500 text-center mb-10">Simple, fast, and transparent.</p>
        <div className="flex flex-col sm:flex-row items-start gap-0 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Browse APIs', desc: 'Explore our marketplace and find the API that fits your needs.', icon: '🔍' },
            { step: '02', title: 'Pay via UPI', desc: 'Make a one-time payment using any UPI app. Instant, secure.', icon: '💳' },
            { step: '03', title: 'Submit Proof', desc: 'Share your UTR number and payment screenshot with us.', icon: '📸' },
            { step: '04', title: 'Get Your Key', desc: 'Receive API credentials on Telegram within 24 hours. Done!', icon: '🔑' },
          ].map((step, i) => (
            <div key={i} className="flex-1 flex flex-col sm:items-center text-left sm:text-center relative">
              {i < 3 && (
                <div className="hidden sm:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 z-0" />
              )}
              <div className="relative z-10 bg-surface border border-white/10 rounded-2xl p-5 mx-2 mb-4 sm:mb-0">
                <div className="flex sm:flex-col items-center gap-4 sm:gap-3">
                  <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-primary text-xs font-bold mb-0.5">STEP {step.step}</div>
                    <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-white font-black text-2xl sm:text-3xl text-center mb-3">FAQ</h2>
        <p className="text-gray-500 text-center mb-10">Answers to common questions.</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-3xl p-10 text-center">
          <h2 className="text-white font-black text-3xl mb-4">Ready to start?</h2>
          <p className="text-gray-400 mb-6">Browse our marketplace and find the perfect API for your project.</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
          >
            Explore APIs →
          </button>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-medium text-sm">{q}</span>
        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3">
          {a}
        </div>
      )}
    </div>
  )
}


