"use client"

import { useState } from "react"

interface ContextMenuProps {
  onClose: () => void
}

const menuItems = [
  { id: "vehicle", label: "Vehicle Options", icon: "car", hasSubmenu: true },
  { id: "inventory", label: "Open Inventory", icon: "bag", keybind: "TAB" },
  { id: "phone", label: "Phone", icon: "phone", keybind: "F1" },
  { id: "divider1", type: "divider" },
  { id: "job", label: "Job Menu", icon: "briefcase", hasSubmenu: true },
  { id: "billing", label: "Send Bill", icon: "receipt" },
  { id: "divider2", type: "divider" },
  { id: "settings", label: "Settings", icon: "settings", disabled: false },
  { id: "logout", label: "Disconnect", icon: "logout", danger: true },
]

const iconComponents = {
  car: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  bag: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  phone: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  briefcase: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  receipt: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  logout: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
}

export function OxLibContextMenu({ onClose }: ContextMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md ox-fade-in" />

      {/* Menu */}
      <div 
        className="relative w-72 ox-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Glass Container with Liquid Effect */}
        <div 
          className="relative overflow-hidden rounded-2xl ox-border-shimmer"
          style={{
            background: "linear-gradient(135deg, rgba(22, 22, 26, 0.92) 0%, rgba(14, 14, 18, 0.96) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(192, 192, 192, 0.08)",
            boxShadow: `
              0 25px 60px -12px rgba(0, 0, 0, 0.7),
              0 0 0 1px rgba(255, 255, 255, 0.04) inset,
              inset 0 1px 0 rgba(255, 255, 255, 0.08),
              0 0 80px -20px rgba(192, 192, 192, 0.1)
            `,
          }}
        >
          {/* Liquid Glass Reflections */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-silver/30 to-transparent" />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 30%)",
            }}
          />
          
          {/* Silver Shimmer Overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute inset-0 ox-shimmer opacity-30"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(192, 192, 192, 0.1), transparent)",
                width: "40%",
              }}
            />
          </div>

          {/* Header */}
          <div className="relative px-4 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(192, 192, 192, 0.05) 100%)",
                  border: "1px solid rgba(192, 192, 192, 0.1)",
                }}
              >
                <svg className="w-4 h-4 text-silver" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/95">Quick Actions</h3>
                <p className="text-[10px] text-silver/50 mt-0.5">Select an option</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="relative p-2 max-h-[320px] overflow-y-auto ox-scrollbar">
            {menuItems.map((item, index) => {
              if (item.type === "divider") {
                return (
                  <div key={item.id} className="my-2 h-px bg-gradient-to-r from-transparent via-silver/10 to-transparent" />
                )
              }

              const Icon = iconComponents[item.icon as keyof typeof iconComponents]
              const isHovered = hoveredItem === item.id
              const isDanger = item.danger

              return (
                <button
                  key={item.id}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-300 ease-out group
                    ${item.disabled 
                      ? "opacity-40 cursor-not-allowed" 
                      : "cursor-pointer"}
                  `}
                  style={{
                    background: isHovered && !item.disabled
                      ? isDanger 
                        ? "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%)"
                        : "linear-gradient(135deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.04) 100%)"
                      : "transparent",
                    boxShadow: isHovered && !item.disabled
                      ? isDanger
                        ? "inset 0 0 20px rgba(239, 68, 68, 0.1)"
                        : "inset 0 0 20px rgba(192, 192, 192, 0.05)"
                      : "none",
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Icon */}
                  <div 
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      transition-all duration-300
                    `}
                    style={{
                      background: isHovered && !item.disabled
                        ? isDanger 
                          ? "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)"
                          : "linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(192, 192, 192, 0.08) 100%)"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                      border: isHovered && !item.disabled
                        ? isDanger
                          ? "1px solid rgba(239, 68, 68, 0.2)"
                          : "1px solid rgba(192, 192, 192, 0.15)"
                        : "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <span className={`transition-colors duration-300 ${
                      isHovered && !item.disabled
                        ? isDanger ? "text-red-400" : "text-silver"
                        : "text-white/50"
                    }`}>
                      {Icon}
                    </span>
                  </div>

                  {/* Label */}
                  <span className={`
                    flex-1 text-left text-sm font-medium
                    transition-colors duration-300
                    ${isHovered && !item.disabled
                      ? isDanger ? "text-red-400" : "text-white/95"
                      : "text-white/70"}
                  `}>
                    {item.label}
                  </span>

                  {/* Keybind or Arrow */}
                  {item.keybind && (
                    <span 
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono transition-all duration-300"
                      style={{
                        background: isHovered 
                          ? "linear-gradient(135deg, rgba(192, 192, 192, 0.12) 0%, rgba(192, 192, 192, 0.06) 100%)"
                          : "rgba(255, 255, 255, 0.04)",
                        color: isHovered ? "rgba(192, 192, 192, 0.9)" : "rgba(255, 255, 255, 0.4)",
                        border: isHovered 
                          ? "1px solid rgba(192, 192, 192, 0.1)"
                          : "1px solid transparent",
                      }}
                    >
                      {item.keybind}
                    </span>
                  )}
                  {item.hasSubmenu && (
                    <svg 
                      className={`w-4 h-4 transition-all duration-300 ${
                        isHovered ? "text-silver translate-x-0.5" : "text-white/30"
                      }`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="relative px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[10px] text-silver/40 font-medium">ESC to close</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 ox-glow-pulse" 
                style={{ boxShadow: "0 0 8px rgba(52, 211, 153, 0.5)" }}
              />
              <span className="text-[10px] text-silver/50 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
