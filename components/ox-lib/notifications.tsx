"use client"

import { useState, useEffect } from "react"

interface NotificationProps {
  onClose: () => void
}

interface Notification {
  id: number
  type: "success" | "error" | "warning" | "info"
  message: string
}

const notifications: Notification[] = [
  { id: 1, type: "error", message: "You don't have the appropriate items" },
  { id: 2, type: "error", message: "You don't have the appropriate items" },
  { id: 3, type: "warning", message: "Police are being notified" },
  { id: 4, type: "success", message: "Vehicle has been stored in garage" },
  { id: 5, type: "info", message: "Press E to interact" },
]

const typeConfig = {
  success: {
    iconBg: "bg-white/80",
    iconColor: "text-white",
    glowColor: "rgba(16, 185, 129, 0.15)",
  },
  error: {
    iconBg: "bg-red-500",
    iconColor: "text-white",
    glowColor: "rgba(239, 68, 68, 0.15)",
  },
  warning: {
    iconBg: "bg-amber-500",
    iconColor: "text-white",
    glowColor: "rgba(245, 158, 11, 0.15)",
  },
  info: {
    iconBg: "bg-sky-500",
    iconColor: "text-white",
    glowColor: "rgba(14, 165, 233, 0.15)",
  },
}

const icons = {
  success: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
    </svg>
  ),
  info: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
    </svg>
  ),
}

export function OxLibNotifications({ onClose }: NotificationProps) {
  const [visibleNotifs, setVisibleNotifs] = useState<Notification[]>([])
  const [exitingIds, setExitingIds] = useState<number[]>([])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < notifications.length) {
        setVisibleNotifs(prev => [...prev, notifications[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [])

  const removeNotification = (id: number) => {
    setExitingIds(prev => [...prev, id])
    setTimeout(() => {
      setVisibleNotifs(prev => prev.filter(n => n.id !== id))
      setExitingIds(prev => prev.filter(i => i !== id))
    }, 300)
  }

  useEffect(() => {
    const timers: Map<number, NodeJS.Timeout> = new Map()
    
    visibleNotifs.forEach(notif => {
      if (notif && notif.id && !exitingIds.includes(notif.id) && !timers.has(notif.id)) {
        const timer = setTimeout(() => {
          removeNotification(notif.id)
        }, 4000)
        timers.set(notif.id, timer)
      }
    })
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
      timers.clear()
    }
  }, [visibleNotifs.length])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 pointer-events-auto w-10 h-10 rounded-full 
          border border-white/10 flex items-center justify-center
          hover:bg-white/10 transition-all duration-300 ox-glass-btn"
        style={{
          background: "linear-gradient(135deg, rgba(22, 22, 26, 0.9) 0%, rgba(14, 14, 18, 0.95) 100%)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        }}
      >
        <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Notifications Stack - Pill Style like FiveM */}
      <div className="absolute top-6 right-20 flex flex-col gap-2">
        {visibleNotifs.filter(Boolean).map((notif, index) => {
          if (!notif) return null
          const config = typeConfig[notif.type]
          const isExiting = exitingIds.includes(notif.id)
          
          return (
            <div
              key={notif.id}
              className={`
                relative flex items-center gap-3 px-4 py-2.5 rounded-full
                transition-all duration-300 ease-out cursor-pointer
                hover:scale-[1.02] group
                ${isExiting 
                  ? "opacity-0 translate-x-8 scale-95" 
                  : "opacity-100 translate-x-0 scale-100"}
              `}
              style={{
                background: "linear-gradient(135deg, rgba(22, 22, 26, 0.92) 0%, rgba(14, 14, 18, 0.96) 100%)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.04),
                  inset 0 1px 0 rgba(255, 255, 255, 0.08),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.3)
                `,
                animationDelay: `${index * 100}ms`,
                animation: isExiting ? "none" : "ox-notif-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
              onClick={() => removeNotification(notif.id)}
            >
              {/* Liquid Glass Reflection */}
              <div 
                className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 50%)",
                }}
              />
              
              {/* Silver Shimmer Effect */}
              <div 
                className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              >
                <div 
                  className="absolute inset-0 ox-shimmer"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(192, 192, 192, 0.15), transparent)",
                    width: "50%",
                  }}
                />
              </div>

              {/* Icon Circle */}
              <div 
                className={`relative flex-shrink-0 w-6 h-6 rounded-full ${config.iconBg} ${config.iconColor} 
                  flex items-center justify-center shadow-lg`}
                style={{
                  boxShadow: `0 2px 8px ${config.glowColor}, 0 0 20px ${config.glowColor}`,
                }}
              >
                {icons[notif.type]}
              </div>
              
              {/* Message */}
              <span className="relative text-sm text-white/90 font-medium tracking-wide pr-2">
                {notif.message}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
