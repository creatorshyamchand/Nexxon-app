import { CATEGORY_COLORS } from '../lib/apis'

export default function APICard({ api, onBuyClick }) {
  const gradient = CATEGORY_COLORS[api.category] || 'from-gray-600 to-slate-600'

  return (
    <div className="group relative bg-card border border-white/5 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 cursor-default">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-300" />

      <div className="relative">
        {/* Icon + Category */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
            {api.icon}
          </div>
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${gradient} bg-opacity-20 text-white/80`}>
            {api.category}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-white font-semibold text-sm mb-1 leading-tight tracking-wide">
          {api.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
          {api.description}
        </p>

        {/* Price + Buy */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-primary font-black text-xl">₹{api.price}</span>
            <span className="text-gray-600 text-xs ml-1">one-time</span>
          </div>
          <button
            onClick={() => onBuyClick(api)}
            className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 animate-pulse-red"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
