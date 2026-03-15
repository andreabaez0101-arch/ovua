"use client"

import { useState } from "react"

interface InputDialogProps {
  onClose: () => void
}

export function OxLibInputDialog({ onClose }: InputDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    plate: "",
    price: "",
    description: "",
    private: false,
    color: "black"
  })

  const colors = [
    { id: "black", color: "#1a1a1a" },
    { id: "white", color: "#f5f5f5" },
    { id: "red", color: "#ef4444" },
    { id: "blue", color: "#3b82f6" },
    { id: "green", color: "#c0c0c0" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 ox-fade-in" />

      {/* Dialog */}
      <div 
        className="relative w-full max-w-md ox-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Glass Container */}
        <div 
          className="relative overflow-hidden rounded-3xl border border-white/[0.08]"
          style={{
            background: "linear-gradient(180deg, rgba(28, 28, 35, 0.95) 0%, rgba(18, 18, 22, 0.98) 100%)",
            boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
          }}
        >
          {/* Top Reflection */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent pointer-events-none" />

          {/* Header */}
          <div className="relative px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white/95">Sell Vehicle</h2>
                  <p className="text-xs text-white/40">Enter vehicle details</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] 
                  flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="relative px-6 py-5 space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Vehicle Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Lamborghini Aventador"
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08]
                    rounded-xl text-sm text-white/90 placeholder:text-white/25
                    focus:outline-none focus:bg-white/[0.06] focus:border-white/20 transition-all"
                />
              </div>
            </div>

            {/* Plate & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Plate</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.plate}
                    onChange={e => setFormData({...formData, plate: e.target.value.toUpperCase()})}
                    placeholder="ABC 123"
                    maxLength={8}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08]
                      rounded-xl text-sm text-white/90 placeholder:text-white/25 font-mono
                      focus:outline-none focus:bg-white/[0.06] focus:border-white/20 transition-all uppercase"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="0"
                    className="w-full px-4 py-3 pl-8 bg-white/[0.04] border border-white/[0.08]
                      rounded-xl text-sm text-white/90 placeholder:text-white/25
                      focus:outline-none focus:bg-white/[0.06] focus:border-white/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Color</label>
              <div className="flex items-center gap-2">
                {colors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setFormData({...formData, color: c.id})}
                    className={`
                      w-10 h-10 rounded-xl transition-all duration-200
                      ${formData.color === c.id 
                        ? "ring-2 ring-white/30 scale-110" 
                        : "hover:scale-105"}
                    `}
                    style={{ 
                      background: c.color,
                      boxShadow: formData.color === c.id ? `0 4px 12px ${c.color}40` : "none"
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Description</label>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Additional details..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08]
                    rounded-xl text-sm text-white/90 placeholder:text-white/25 resize-none
                    focus:outline-none focus:bg-white/[0.06] focus:border-white/20 transition-all"
                />
              </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div>
                <p className="text-sm font-medium text-white/80">Private Listing</p>
                <p className="text-xs text-white/40">Only visible to nearby players</p>
              </div>
              <button
                onClick={() => setFormData({...formData, private: !formData.private})}
                className={`
                  relative w-12 h-7 rounded-full transition-all duration-300
                  ${formData.private 
                    ? "bg-white/70" 
                    : "bg-white/10"}
                `}
              >
                <div className={`
                  absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-lg
                  transition-transform duration-300
                  ${formData.private ? "translate-x-5" : "translate-x-0"}
                `} />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-6 py-4 border-t border-white/[0.06] flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08]
                border border-white/[0.08] text-sm font-medium text-white/60 hover:text-white/80
                transition-all duration-200"
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-3 rounded-xl bg-white/90 hover:bg-white
                text-sm font-semibold text-black
                transition-all duration-200 hover:shadow-lg hover:shadow-white/20
                active:scale-[0.98]"
            >
              Confirm Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
