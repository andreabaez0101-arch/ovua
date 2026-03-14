"use client"

import { useState, useEffect, useCallback } from "react"

interface SkillCheckProps {
  onClose: () => void
}

export function OxLibSkillCheck({ onClose }: SkillCheckProps) {
  const [angle, setAngle] = useState(0)
  const [result, setResult] = useState<"success" | "fail" | null>(null)
  const [isAnimating, setIsAnimating] = useState(true)
  
  const targetStart = 70
  const targetEnd = 110
  const perfectStart = 85
  const perfectEnd = 95
  
  const speed = 4

  useEffect(() => {
    if (!isAnimating || result) return
    
    const interval = setInterval(() => {
      setAngle(prev => {
        const newAngle = prev + speed
        if (newAngle >= 360) return 0
        return newAngle
      })
    }, 16)

    return () => clearInterval(interval)
  }, [isAnimating, result])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space" && !result) {
      setIsAnimating(false)
      
      if (angle >= perfectStart && angle <= perfectEnd) {
        setResult("success")
      } else if (angle >= targetStart && angle <= targetEnd) {
        setResult("success")
      } else {
        setResult("fail")
      }
      
      setTimeout(onClose, 2000)
    }
  }, [angle, result, onClose])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  const isPerfect = angle >= perfectStart && angle <= perfectEnd

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl ox-fade-in" />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full 
          bg-white/5 border border-white/10 flex items-center justify-center
          hover:bg-white/10 transition-colors z-10"
      >
        <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Skill Check Ring */}
      <div className="relative ox-scale-in" onClick={e => e.stopPropagation()}>
        {/* Outer Glow */}
        <div 
          className={`absolute inset-0 rounded-full blur-2xl transition-colors duration-300 ${
            result === "success" ? "bg-white/20" : 
            result === "fail" ? "bg-red-500/30" : 
            "bg-white/10"
          }`}
          style={{ transform: "scale(1.3)" }}
        />

        {/* Main Ring */}
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Background Ring */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="16"
            />

            {/* Target Zone */}
            <path
              d={describeArc(100, 100, 85, targetStart, targetEnd)}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Perfect Zone */}
            <path
              d={describeArc(100, 100, 85, perfectStart, perfectEnd)}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Moving Indicator */}
            <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "100px 100px" }}>
              <circle
                cx="100"
                cy="15"
                r="8"
                fill={
                  result === "success" ? "#e2e8f0" :
                  result === "fail" ? "#ef4444" :
                  isPerfect ? "#ffffff" : "#a0a0a0"
                }
                className="transition-colors duration-150"
              />
              <circle
                cx="100"
                cy="15"
                r="12"
                fill="none"
                stroke={
                  result === "success" ? "#e2e8f0" :
                  result === "fail" ? "#ef4444" :
                  "rgba(255,255,255,0.3)"
                }
                strokeWidth="2"
                className="transition-colors duration-150"
              />
            </g>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-32 h-32 rounded-full flex flex-col items-center justify-center"
              style={{
                background: "linear-gradient(180deg, rgba(22, 22, 26, 0.96) 0%, rgba(14, 14, 18, 0.98) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 0 40px -10px rgba(0, 0, 0, 0.6)",
                border: "1px solid rgba(192, 192, 192, 0.08)",
              }}
            >
              {/* Glass Reflection */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
              
              {result ? (
                <div className="ox-scale-result">
                  {result === "success" ? (
                    <>
                      <svg className="w-10 h-10 text-slate-200 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-semibold text-slate-200">SUCCESS</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm font-semibold text-red-400">FAILED</span>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 text-white/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="text-xs text-white/50">Press SPACE</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        {!result && (
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06]">
              <kbd className="px-2 py-1 rounded bg-white/[0.08] text-white/70 text-xs font-mono">SPACE</kbd>
              <span className="text-xs text-white/40">to lock</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
