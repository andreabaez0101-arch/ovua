"use client"

import { useState } from "react"

interface MenuProps {
  onClose: () => void
}

const menuData = {
  title: "Garage Menu",
  subtitle: "Legion Square Garage",
  items: [
    { id: "car1", label: "Lamborghini Aventador", description: "Plate: ABC 123", icon: "car", metadata: { speed: "95%", handling: "88%" } },
    { id: "car2", label: "Mercedes-AMG GT", description: "Plate: XYZ 789", icon: "car", metadata: { speed: "87%", handling: "92%" } },
    { id: "car3", label: "Porsche 911 GT3", description: "Plate: DEF 456", icon: "car", metadata: { speed: "91%", handling: "94%" } },
    { id: "bike1", label: "Ducati Panigale V4", description: "Plate: MOT 001", icon: "bike", metadata: { speed: "89%", handling: "78%" } },
    { id: "car4", label: "BMW M4 Competition", description: "Plate: BMW 420", icon: "car", metadata: { speed: "85%", handling: "90%" }, disabled: true },
  ]
}

const icons: Record<string, JSX.Element> = {
  car: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>,
  bike: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" /><circle cx="12" cy="12" r="3" /></svg>,
}

export function OxLibMenu({ onClose }: MenuProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const selectedItem = menuData.items.find(item => item.id === (hoveredId || selectedId))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 ox-fade-in" />

      {/* Menu Container */}
      <div 
        className="relative flex gap-4 ox-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Main Menu */}
        <div 
          className="relative w-80 overflow-hidden rounded-2xl border border-white/[0.08]"
          style={{
            background: "linear-gradient(180deg, rgba(25, 25, 32, 0.95) 0%, rgba(18, 18, 24, 0.98) 100%)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
          }}
        >
          {/* Top Reflection */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

          {/* Header */}
          <div className="relative px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white/95">{menuData.title}</h2>
                <p className="text-xs text-white/40 mt-0.5">{menuData.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] 
                  flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="relative mt-3">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search vehicles..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]
                  text-sm text-white/80 placeholder:text-white/25
                  focus:outline-none focus:border-white/[0.12] focus:bg-white/[0.06]
                  transition-all"
              />
            </div>
          </div>

          {/* Items */}
          <div className="relative p-2 max-h-[400px] overflow-y-auto ox-scrollbar">
            {menuData.items.map((item) => {
              const isSelected = selectedId === item.id
              const isHovered = hoveredId === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => !item.disabled && setSelectedId(item.id)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1
                    transition-all duration-200 ease-out
                    ${item.disabled 
                      ? "opacity-40 cursor-not-allowed" 
                      : "cursor-pointer"}
                    ${isSelected 
                      ? "bg-white/[0.08] border border-white/[0.12]" 
                      : isHovered 
                        ? "bg-white/[0.04]" 
                        : "bg-transparent border border-transparent"}
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    transition-all duration-200
                    ${isSelected 
                      ? "bg-white/[0.1] text-white/90" 
                      : "bg-white/[0.04] text-white/50"}
                  `}>
                    {icons[item.icon]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-sm font-medium truncate transition-colors ${isSelected ? "text-white/95" : "text-white/70"}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-white/40 truncate">{item.description}</p>
                  </div>

                  {/* Arrow */}
                  <svg className={`w-4 h-4 transition-all ${isSelected ? "text-white/60 translate-x-0" : "text-white/20 -translate-x-1"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="relative px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[10px] text-white/30">{menuData.items.length} vehicles</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/30">Navigate with</span>
              <div className="flex gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40 text-[10px] font-mono">W</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40 text-[10px] font-mono">S</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        {selectedItem && (
          <div 
            className="relative w-64 overflow-hidden rounded-2xl border border-white/[0.08] ox-slide-in-right"
            style={{
              background: "linear-gradient(180deg, rgba(25, 25, 32, 0.95) 0%, rgba(18, 18, 24, 0.98) 100%)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Top Reflection */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative p-5">
              {/* Vehicle Preview */}
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] 
                border border-white/[0.06] flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center">
                  {icons[selectedItem.icon]}
                </div>
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-white/95 mb-1">{selectedItem.label}</h3>
              <p className="text-xs text-white/40 mb-4">{selectedItem.description}</p>

              {/* Stats */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/50">Speed</span>
                    <span className="text-white/70 font-mono">{selectedItem.metadata.speed}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-white/70 to-silver/60"
                      style={{ width: selectedItem.metadata.speed }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/50">Handling</span>
                    <span className="text-white/70 font-mono">{selectedItem.metadata.handling}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-sky-500/80 to-sky-400/80"
                      style={{ width: selectedItem.metadata.handling }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <button className="w-full py-2.5 rounded-xl bg-white/90 hover:bg-white
                  text-sm font-semibold text-black transition-all active:scale-[0.98]">
                  Spawn Vehicle
                </button>
                <button className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08]
                  border border-white/[0.08] text-sm font-medium text-white/60 hover:text-white/80
                  transition-all active:scale-[0.98]">
                  Transfer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
