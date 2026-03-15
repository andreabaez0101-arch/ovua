"use client"

import { useState } from "react"

interface AlertDialogProps {
  onClose: () => void
}

export function OxLibAlertDialog({ onClose }: AlertDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = () => {
    setIsConfirming(true)
    setTimeout(onClose, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 ox-fade-in" />

      {/* Dialog */}
      <div 
        className="relative w-full max-w-sm ox-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Glass Container */}
        <div 
          className="relative overflow-hidden rounded-3xl border border-white/[0.08]"
          style={{
            background: "linear-gradient(180deg, rgba(30, 30, 38, 0.95) 0%, rgba(20, 20, 26, 0.98) 100%)",
            boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
          }}
        >
          {/* Top Reflection */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative p-8 text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/10 
              border border-red-500/20 flex items-center justify-center mb-6 animate-bounce">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-white/95 mb-2">
              Confirm Action
            </h2>

            {/* Description */}
            <p className="text-sm text-white/50 leading-relaxed mb-8">
              Are you sure you want to sell this vehicle? This action cannot be undone and the vehicle will be permanently removed from your garage.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08]
                  border border-white/[0.08] text-sm font-medium text-white/60 hover:text-white/80
                  transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className={`
                  flex-1 px-5 py-3.5 rounded-xl
                  text-sm font-semibold
                  transition-all duration-300 active:scale-[0.98]
                  flex items-center justify-center gap-2
                  ${isConfirming 
                    ? "bg-white/80 text-black" 
                    : "bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white hover:shadow-lg hover:shadow-red-500/20"}
                `}
              >
                {isConfirming ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Sell"
                )}
              </button>
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="relative px-6 py-3 border-t border-white/[0.05] text-center">
            <span className="text-[10px] text-white/25">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40 font-mono">ESC</kbd> to cancel
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
