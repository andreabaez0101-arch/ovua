"use client"

import { useState, useEffect } from "react"

interface ProgressBarProps {
  onClose: () => void
}

export function OxLibProgressBar({ onClose }: ProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsComplete(true)
          setTimeout(() => {
            setIsClosing(true)
            setTimeout(onClose, 500)
          }, 1000)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onClose])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-32 pointer-events-none select-none">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`fixed top-4 right-4 pointer-events-auto w-10 h-10 rounded-full 
          border border-white/10 flex items-center justify-center
          hover:bg-white/10 transition-all duration-500 ox-glass-btn
          ${isClosing ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
        style={{
          background: "linear-gradient(135deg, rgba(22, 22, 26, 0.9) 0%, rgba(14, 14, 18, 0.95) 100%)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        }}
      >
        <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress Container */}
      <div 
        className={`transition-all duration-500 ease-out ${
          isClosing 
            ? "opacity-0 translate-y-8 scale-95" 
            : "ox-slide-up"
        }`}
      >
        {/* Liquid Glass Card */}
        <div 
          className="relative overflow-hidden rounded-2xl px-5 py-3.5 min-w-[260px] ox-border-shimmer"
          style={{
            background: "linear-gradient(135deg, rgba(22, 22, 26, 0.92) 0%, rgba(14, 14, 18, 0.96) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(192, 192, 192, 0.08)",
            boxShadow: `
              0 25px 60px -12px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.06),
              0 0 60px -20px rgba(192, 192, 192, 0.08)
            `,
          }}
        >
          {/* Liquid Glass Reflection */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-silver/25 to-transparent" />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 40%)",
            }}
          />

          {/* Content */}
          <div className="relative">
            {/* Icon & Text */}
            <div className="flex items-center gap-3 mb-2.5">
              {/* Animated Icon */}
              <div className="relative w-8 h-8">
                <div 
                  className="absolute inset-0 rounded-lg flex items-center justify-center transition-all duration-500"
                  style={{
                    background: isComplete
                      ? "linear-gradient(135deg, rgba(226, 232, 240, 0.2) 0%, rgba(226, 232, 240, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)",
                    border: isComplete
                      ? "1px solid rgba(226, 232, 240, 0.3)"
                      : "1px solid rgba(192, 192, 192, 0.1)",
                    boxShadow: isComplete
                      ? "0 0 20px rgba(226, 232, 240, 0.15)"
                      : "0 0 15px rgba(192, 192, 192, 0.05)",
                  }}
                >
                  {isComplete ? (
                    <svg className="w-4 h-4 text-slate-200 ox-scale-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-silver ox-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </div>
                {/* Pulse Ring */}
                {!isComplete && (
                  <div 
                    className="absolute inset-0 rounded-lg ox-ping-slow" 
                    style={{ border: "1px solid rgba(192, 192, 192, 0.15)" }}
                  />
                )}
              </div>
              
              <div>
                <h3 className={`text-sm font-semibold transition-colors duration-500 ${isComplete ? "text-white" : "text-white/95"}`}>
                  {isComplete ? "Completed!" : "Processing..."}
                </h3>
                <p className="text-[10px] text-silver/50">
                  {isComplete ? "Transaction successful" : "Repairing vehicle"}
                </p>
              </div>

              {/* Percentage on right */}
              <span 
                className={`ml-auto text-sm font-bold font-mono transition-colors duration-500 ${isComplete ? "text-white" : "text-silver/80"}`}
              >
                {progress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              {/* Track */}
              <div 
                className="h-1 rounded-full overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* Fill */}
                <div 
                  className="h-full rounded-full transition-all duration-100 ease-linear relative overflow-hidden"
                  style={{ 
                    width: `${progress}%`,
                    background: isComplete
                      ? "linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(220, 220, 220, 1))"
                      : "linear-gradient(90deg, rgba(192, 192, 192, 0.7), rgba(220, 220, 220, 0.9))",
                    boxShadow: isComplete
                      ? "0 0 12px rgba(255, 255, 255, 0.5)"
                      : "0 0 8px rgba(192, 192, 192, 0.3)",
                  }}
                >
                  {/* Shine Effect */}
                  <div 
                    className="absolute inset-0 ox-shimmer"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                      width: "50%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
