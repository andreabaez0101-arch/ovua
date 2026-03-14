"use client"

import { useState, useEffect } from "react"

interface TextUIProps {
  onClose: () => void
}

const textUIExamples = [
  { id: 1, text: "[E] Open", icon: "door", position: "right" },
  { id: 2, text: "[G] Pick up", icon: "hand", position: "right" },
  { id: 3, text: "[F] Enter", icon: "car", position: "left" },
]

const icons: Record<string, JSX.Element> = {
  door: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  hand: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>,
  car: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>,
}

export function OxLibTextUI({ onClose }: TextUIProps) {
  const [visible, setVisible] = useState<number[]>([])
  const [currentExample, setCurrentExample] = useState(0)

  useEffect(() => {
    // Show text UIs one by one
    textUIExamples.forEach((example, index) => {
      setTimeout(() => {
        setVisible(prev => [...prev, example.id])
      }, index * 600)
    })

    // Cycle through highlighting
    const cycleInterval = setInterval(() => {
      setCurrentExample(prev => (prev + 1) % textUIExamples.length)
    }, 2000)

    return () => clearInterval(cycleInterval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 pointer-events-auto w-10 h-10 rounded-full 
          bg-white/5 border border-white/10 flex items-center justify-center
          hover:bg-white/10 transition-colors z-10"
      >
        <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Info Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full 
        bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl">
        <span className="text-xs text-white/50">Text UI Preview - Interaction Hints</span>
      </div>

      {/* Right Side Text UIs */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {textUIExamples.filter(e => e.position === "right").map((example, index) => (
          <div
            key={example.id}
            className={`
              transition-all duration-500 ease-out
              ${visible.includes(example.id) 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 translate-x-8"}
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <TextUIBadge 
              text={example.text} 
              icon={icons[example.icon]}
              isActive={currentExample === textUIExamples.indexOf(example)}
              align="right"
            />
          </div>
        ))}
      </div>

      {/* Left Side Text UIs */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {textUIExamples.filter(e => e.position === "left").map((example, index) => (
          <div
            key={example.id}
            className={`
              transition-all duration-500 ease-out
              ${visible.includes(example.id) 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 -translate-x-8"}
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <TextUIBadge 
              text={example.text} 
              icon={icons[example.icon]}
              isActive={currentExample === textUIExamples.indexOf(example)}
              align="left"
            />
          </div>
        ))}
      </div>

      {/* Center Crosshair Area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Subtle Crosshair */}
        <div className="relative w-8 h-8">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  )
}

interface TextUIBadgeProps {
  text: string
  icon: JSX.Element
  isActive: boolean
  align: "left" | "right"
}

function TextUIBadge({ text, icon, isActive, align }: TextUIBadgeProps) {
  // Parse text to highlight keybinds
  const parts = text.split(/(\[[^\]]+\])/)

  return (
    <div 
      className={`
        relative flex items-center gap-2.5 px-3 py-2 rounded-xl
        transition-all duration-300 ease-out
        ${isActive ? "scale-105" : "scale-100"}
        ${align === "right" ? "flex-row" : "flex-row-reverse"}
      `}
      style={{
        background: isActive 
          ? "linear-gradient(135deg, rgba(35, 35, 45, 0.95) 0%, rgba(25, 25, 32, 0.98) 100%)"
          : "linear-gradient(135deg, rgba(25, 25, 32, 0.9) 0%, rgba(18, 18, 24, 0.95) 100%)",
        boxShadow: isActive 
          ? "0 15px 40px -10px rgba(0, 0, 0, 0.5), 0 0 30px -5px rgba(255, 255, 255, 0.05)"
          : "0 8px 25px -8px rgba(0, 0, 0, 0.4)",
        border: isActive 
          ? "1px solid rgba(255, 255, 255, 0.12)"
          : "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Glass Reflection */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
      
      {/* Icon */}
      <div className={`
        flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
        transition-all duration-300
        ${isActive 
          ? "bg-white/[0.1] text-white/80" 
          : "bg-white/[0.04] text-white/40"}
      `}>
        {icon}
      </div>

      {/* Text */}
      <span className="relative text-sm">
        {parts.map((part, index) => {
          if (part.match(/^\[[^\]]+\]$/)) {
            return (
              <kbd 
                key={index} 
                className={`
                  inline-block px-2 py-0.5 mx-0.5 rounded-md font-mono text-xs
                  transition-all duration-300
                  ${isActive 
                    ? "bg-white/15 text-white/90 border border-white/20" 
                    : "bg-white/[0.06] text-white/60 border border-white/[0.08]"}
                `}
              >
                {part.slice(1, -1)}
              </kbd>
            )
          }
          return (
            <span 
              key={index} 
              className={`transition-colors duration-300 ${isActive ? "text-white/90" : "text-white/60"}`}
            >
              {part}
            </span>
          )
        })}
      </span>

      {/* Pulse indicator for active */}
      {isActive && (
        <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-white/80 animate-pulse" />
      )}
    </div>
  )
}
