"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart, Shield, Utensils, Droplets, Zap, Wind, Brain, DollarSign, CreditCard, Mic, Fuel, X, Settings, Check, Eye, EyeOff } from "lucide-react"

// HUD Style Types - 12 different styles
type HudStyle = 'bars' | 'bars-vertical' | 'circles-outline' | 'circles-fill' | 'circles-glow' | 'pills' | 'minimal' | 'modern-cards' | 'compact' | 'neon' | 'gradient' | 'classic'

interface HudSettings {
  style: HudStyle
  showMoney: boolean
  showCompass: boolean
  showPlayerInfo: boolean
  statusPosition: 'left' | 'right'
  speedoPosition: 'left' | 'right' | 'center'
  scale: number
  opacity: number
  colorScheme: 'default' | 'red' | 'blue' | 'green' | 'purple' | 'orange'
}

const colorSchemes = {
  default: { health: '#ef4444', armor: '#3b82f6', food: '#f97316', water: '#06b6d4', stamina: '#eab308', oxygen: '#8b5cf6', stress: '#ec4899' },
  red: { health: '#ef4444', armor: '#f87171', food: '#fb923c', water: '#fca5a5', stamina: '#fcd34d', oxygen: '#f9a8d4', stress: '#fb7185' },
  blue: { health: '#60a5fa', armor: '#3b82f6', food: '#38bdf8', water: '#22d3ee', stamina: '#a78bfa', oxygen: '#818cf8', stress: '#c084fc' },
  green: { health: '#22c55e', armor: '#4ade80', food: '#a3e635', water: '#2dd4bf', stamina: '#fde047', oxygen: '#34d399', stress: '#86efac' },
  purple: { health: '#a855f7', armor: '#8b5cf6', food: '#c084fc', water: '#e879f9', stamina: '#f472b6', oxygen: '#a78bfa', stress: '#d946ef' },
  orange: { health: '#f97316', armor: '#fb923c', food: '#fbbf24', water: '#facc15', stamina: '#fcd34d', oxygen: '#fdba74', stress: '#f59e0b' }
}

// ============ STYLE 1: BARS (Horizontal) - Compact ============
function StatusBars({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-md transition-all duration-300 ${critical ? 'animate-pulse border-red-500/40' : ''}`}>
      <div className="w-4 h-4 flex items-center justify-center" style={{ color }}>{icon}</div>
      <div className="w-10 h-1 bg-white/[0.08] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color, boxShadow: `0 0 4px ${color}60` }}
        />
      </div>
    </div>
  )
}

// ============ STYLE 2: BARS VERTICAL - Compact ============
function StatusBarsVertical({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 px-1.5 py-1.5 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-md ${critical ? 'animate-pulse border-red-500/40' : ''}`}>
      <div className="w-3.5 h-3.5 flex items-center justify-center" style={{ color }}>{icon}</div>
      <div className="w-1 h-6 bg-white/[0.08] rounded-full overflow-hidden flex flex-col-reverse">
        <div className="w-full rounded-full transition-all duration-500" style={{ height: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

// ============ STYLE 3: CIRCLES OUTLINE - Compact ============
function StatusCirclesOutline({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  const circumference = 2 * Math.PI * 14
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className={`relative w-9 h-9 flex items-center justify-center ${critical ? 'animate-pulse' : ''}`}>
      <svg className="absolute inset-0 -rotate-90 w-full h-full">
        <circle cx="50%" cy="50%" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
        <circle cx="50%" cy="50%" r="14" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease', filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
      </svg>
      <div className="w-3.5 h-3.5" style={{ color }}>{icon}</div>
    </div>
  )
}

// ============ STYLE 4: CIRCLES FILL - Compact ============
function StatusCirclesFill({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  return (
    <div className={`relative w-9 h-9 flex items-center justify-center ${critical ? 'animate-pulse' : ''}`}>
      <div className="absolute inset-0 rounded-full overflow-hidden" style={{ background: `conic-gradient(${color} ${value * 3.6}deg, rgba(255,255,255,0.06) 0deg)` }} />
      <div className="absolute inset-[3px] rounded-full bg-[rgba(18,18,22,0.95)]" />
      <div className="relative w-3.5 h-3.5" style={{ color }}>{icon}</div>
    </div>
  )
}

// ============ STYLE 5: CIRCLES GLOW - Compact ============
function StatusCirclesGlow({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  const circumference = 2 * Math.PI * 14
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className={`relative w-9 h-9 flex items-center justify-center ${critical ? 'animate-pulse' : ''}`}>
      <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }} />
      <svg className="absolute inset-0 -rotate-90 w-full h-full">
        <circle cx="50%" cy="50%" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
        <circle cx="50%" cy="50%" r="14" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease', filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 10px ${color}60)` }}
        />
      </svg>
      <div className="w-3.5 h-3.5" style={{ color, filter: `drop-shadow(0 0 3px ${color})` }}>{icon}</div>
    </div>
  )
}

// ============ STYLE 6: PILLS - Compact ============
function StatusPills({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  const segments = 4
  const filledSegments = Math.ceil((value / 100) * segments)

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-full ${critical ? 'animate-pulse' : ''}`}>
      <div className="w-3.5 h-3.5" style={{ color }}>{icon}</div>
      <div className="flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className="w-2 h-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < filledSegments ? color : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
    </div>
  )
}

// ============ STYLE 7: MINIMAL - Compact ============
function StatusMinimal({ icon, value, color, critical }: { icon: React.ReactNode, value: number, color: string, critical?: boolean }) {
  return (
    <div className={`flex items-center gap-1 ${critical ? 'animate-pulse' : ''}`}>
      <div className="w-3.5 h-3.5" style={{ color }}>{icon}</div>
      <span className="text-[10px] font-bold tabular-nums" style={{ color, textShadow: `0 0 6px ${color}60` }}>{Math.round(value)}</span>
    </div>
  )
}

// ============ STYLE 8: MODERN CARDS - Compact ============
function StatusModernCards({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 bg-[rgba(18,18,22,0.85)] border border-white/[0.05] rounded-lg ${critical ? 'animate-pulse border-red-500/30' : ''}`}>
      <div className="w-4 h-4 flex items-center justify-center rounded" style={{ backgroundColor: `${color}20` }}>
        <div style={{ color }} className="w-3 h-3">{icon}</div>
      </div>
      <div className="w-8 h-1 bg-white/[0.08] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

// ============ STYLE 9: COMPACT - Ultra Compact ============
function StatusCompact({ icon, value, color, critical }: { icon: React.ReactNode, value: number, color: string, critical?: boolean }) {
  return (
    <div className={`flex items-center gap-1 px-1 py-0.5 ${critical ? 'animate-pulse' : ''}`}>
      <div className="w-3 h-3" style={{ color }}>{icon}</div>
      <div className="w-6 h-[3px] bg-white/[0.08] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

// ============ STYLE 10: NEON - Compact ============
function StatusNeon({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 bg-black/70 border rounded-md ${critical ? 'animate-pulse' : ''}`}
      style={{ borderColor: `${color}40`, boxShadow: `0 0 8px ${color}20` }}
    >
      <div className="w-3.5 h-3.5" style={{ color, filter: `drop-shadow(0 0 4px ${color})` }}>{icon}</div>
      <div className="w-10 h-1 bg-black/40 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
    </div>
  )
}

// ============ STYLE 11: GRADIENT - Compact ============
function StatusGradient({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${critical ? 'animate-pulse' : ''}`}
      style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`, border: `1px solid ${color}20` }}
    >
      <div className="w-3.5 h-3.5" style={{ color }}>{icon}</div>
      <div className="w-10 h-1 bg-black/20 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

// ============ STYLE 12: CLASSIC - Compact ============
function StatusClassic({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 ${critical ? 'animate-pulse' : ''}`}>
      <div className="w-3.5 h-3.5" style={{ color }}>{icon}</div>
      <div className="w-10 h-2 bg-black/60 rounded-sm border border-white/10 overflow-hidden">
        <div className="h-full transition-all duration-300" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

// ============ VOICE INDICATOR ============
function VoiceIndicator({ range, talking, style }: { range: 'whisper' | 'normal' | 'shout', talking: boolean, style: HudStyle }) {
  const levels = range === 'whisper' ? 1 : range === 'normal' ? 2 : 3
  const color = talking ? '#22c55e' : 'rgba(255,255,255,0.3)'
  
  if (style === 'minimal' || style === 'compact') {
    return (
      <div className="flex items-center gap-1">
        <Mic className="w-3.5 h-3.5" style={{ color }} />
        <div className="flex items-end gap-[2px] h-3">
          {[1, 2, 3].map((level) => (
            <span key={level} className="w-[3px] rounded-sm transition-all duration-200"
              style={{ height: level === 1 ? '5px' : level === 2 ? '8px' : '11px', backgroundColor: level <= levels ? '#22c55e' : 'rgba(255,255,255,0.15)', boxShadow: level <= levels && talking ? '0 0 6px #22c55e' : 'none' }}
            />
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-[rgba(18,18,22,0.9)] border rounded-lg ${talking ? 'border-green-500/30' : 'border-white/[0.06]'}`}>
      <Mic className="w-4 h-4" style={{ color }} />
      <div className="flex items-end gap-[3px] h-4">
        {[1, 2, 3].map((level) => (
          <span key={level} className="w-1 rounded-sm transition-all duration-200"
            style={{ height: level === 1 ? '6px' : level === 2 ? '10px' : '14px', backgroundColor: level <= levels ? '#22c55e' : 'rgba(255,255,255,0.15)', boxShadow: level <= levels && talking ? '0 0 8px rgba(34,197,94,0.6)' : 'none' }}
          />
        ))}
      </div>
      <span className="text-[9px] font-semibold text-white/40 uppercase">{range}</span>
    </div>
  )
}

// ============ SPEEDOMETER ============
function Speedometer({ visible, speed, fuel, gear, rpm, position, style }: { visible: boolean, speed: number, fuel: number, gear: string, rpm: number, position: 'left' | 'right' | 'center', style: HudStyle }) {
  if (!visible) return null
  
  const positionClasses = { left: 'left-6', right: 'right-6', center: 'left-1/2 -translate-x-1/2' }
  
  // Circle speedometer for circle styles
  if (style.includes('circles') || style === 'neon') {
    const radius = 42
    const circumference = 2 * Math.PI * radius
    const maxSpeed = 220
    const speedPercent = Math.min(speed / maxSpeed, 1)
    const strokeDashoffset = circumference - speedPercent * circumference
    const speedColor = speed > 160 ? '#ef4444' : speed > 100 ? '#f97316' : '#3b82f6'
    
    return (
      <div className={`fixed bottom-6 ${positionClasses[position]}`}>
        <div className="relative w-32 h-32 flex items-center justify-center bg-[rgba(12,12,16,0.95)] border border-white/[0.08] rounded-full"
          style={style === 'neon' ? { boxShadow: `0 0 30px ${speedColor}30, inset 0 0 20px ${speedColor}10` } : {}}
        >
          <svg className="absolute inset-0 -rotate-90 w-full h-full">
            <circle cx="50%" cy="50%" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle cx="50%" cy="50%" r={radius} fill="none" stroke={speedColor} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.2s ease', filter: `drop-shadow(0 0 8px ${speedColor})` }}
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white tabular-nums">{Math.round(speed)}</span>
            <span className="text-[9px] font-semibold text-white/40 uppercase">KM/H</span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[rgba(18,18,22,0.98)] border border-white/[0.1] rounded-md">
            <span className="text-sm font-bold text-white">{gear}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-lg">
          <Fuel className="w-4 h-4 text-orange-500" />
          <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${fuel}%` }} />
          </div>
          <span className="text-[10px] font-semibold text-white/50 tabular-nums">{Math.round(fuel)}%</span>
        </div>
      </div>
    )
  }
  
  // Default bar-style speedometer
  return (
    <div className={`fixed bottom-6 ${positionClasses[position]}`}>
      <div className="flex flex-col gap-2 px-5 py-4 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-xl min-w-[180px]">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold text-white tabular-nums">{Math.round(speed)}</span>
          <span className="text-[10px] font-semibold text-white/40 uppercase">KM/H</span>
        </div>
        {/* RPM Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-semibold text-white/30 uppercase w-8">RPM</span>
          <div className="flex-1 h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-150"
              style={{ width: `${(rpm / 9000) * 100}%`, background: rpm > 7000 ? 'linear-gradient(90deg, #f97316 0%, #ef4444 100%)' : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)' }}
            />
          </div>
        </div>
        {/* Fuel & Gear */}
        <div className="flex items-center gap-3 pt-1 border-t border-white/[0.06]">
          <div className="flex-1 flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-orange-500" />
            <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${fuel}%` }} />
            </div>
            <span className="text-[9px] font-semibold text-white/40 tabular-nums">{Math.round(fuel)}%</span>
          </div>
          <div className="flex flex-col items-center px-2.5 py-1 bg-white/[0.05] rounded-lg">
            <span className="text-[7px] font-semibold text-white/30 uppercase">GEAR</span>
            <span className="text-base font-bold text-white leading-none">{gear}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ MONEY DISPLAY ============
function MoneyDisplay({ cash, bank, style }: { cash: number, bank: number, style: HudStyle }) {
  const formatMoney = (amount: number) => '$' + amount.toLocaleString('en-US')
  
  if (style === 'minimal') {
    return (
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-bold text-green-500 tabular-nums" style={{ textShadow: '0 0 8px rgba(34,197,94,0.4), 0 1px 2px rgba(0,0,0,0.8)' }}>{formatMoney(cash)}</span>
        <span className="text-sm font-bold text-blue-400 tabular-nums" style={{ textShadow: '0 0 8px rgba(96,165,250,0.4), 0 1px 2px rgba(0,0,0,0.8)' }}>{formatMoney(bank)}</span>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-lg">
        <div className="w-5 h-5 flex items-center justify-center rounded bg-green-500/20">
          <DollarSign className="w-3.5 h-3.5 text-green-500" />
        </div>
        <span className="text-sm font-bold text-green-500 tabular-nums">{formatMoney(cash)}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-lg">
        <div className="w-5 h-5 flex items-center justify-center rounded bg-blue-500/20">
          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <span className="text-sm font-bold text-blue-400 tabular-nums">{formatMoney(bank)}</span>
      </div>
    </div>
  )
}

// ============ HUD STYLE PREVIEW ============
function StylePreview({ style, selected, onClick }: { style: HudStyle, selected: boolean, onClick: () => void }) {
  const previewColors = ['#ef4444', '#3b82f6', '#22c55e', '#f97316']
  const previewValues = [85, 60, 45, 75]
  
  return (
    <button onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selected ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/30' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'}`}
    >
      {/* Mini preview */}
      <div className="flex gap-1 items-center justify-center min-h-[40px]">
        {style === 'bars' && previewColors.slice(0, 3).map((c, i) => (
          <div key={i} className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${previewValues[i]}%`, backgroundColor: c }} />
          </div>
        ))}
        {style === 'bars-vertical' && previewColors.map((c, i) => (
          <div key={i} className="w-1.5 h-8 bg-white/10 rounded-full overflow-hidden flex flex-col-reverse">
            <div className="w-full rounded-full" style={{ height: `${previewValues[i]}%`, backgroundColor: c }} />
          </div>
        ))}
        {(style === 'circles-outline' || style === 'circles-fill' || style === 'circles-glow') && previewColors.slice(0, 3).map((c, i) => (
          <div key={i} className="w-6 h-6 rounded-full border-2" style={{ borderColor: c, opacity: 0.8 }} />
        ))}
        {style === 'pills' && previewColors.slice(0, 2).map((c, i) => (
          <div key={i} className="flex gap-0.5">{[1,2,3].map(j => <div key={j} className="w-2 h-1 rounded-full" style={{ backgroundColor: j <= 2 ? c : 'rgba(255,255,255,0.1)' }} />)}</div>
        ))}
        {style === 'minimal' && previewColors.slice(0, 3).map((c, i) => (
          <span key={i} className="text-[10px] font-bold" style={{ color: c }}>{previewValues[i]}</span>
        ))}
        {style === 'modern-cards' && previewColors.slice(0, 2).map((c, i) => (
          <div key={i} className="w-8 h-10 rounded-lg border border-white/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: `${c}30` }} />
          </div>
        ))}
        {style === 'compact' && previewColors.map((c, i) => (
          <div key={i} className="w-6 h-0.5 rounded-full" style={{ backgroundColor: c }} />
        ))}
        {style === 'neon' && previewColors.slice(0, 2).map((c, i) => (
          <div key={i} className="w-10 h-2 rounded border" style={{ borderColor: `${c}50`, boxShadow: `0 0 4px ${c}40` }}>
            <div className="h-full rounded" style={{ width: `${previewValues[i]}%`, backgroundColor: c }} />
          </div>
        ))}
        {style === 'gradient' && previewColors.slice(0, 2).map((c, i) => (
          <div key={i} className="w-10 h-3 rounded-lg" style={{ background: `linear-gradient(135deg, ${c}30 0%, ${c}10 100%)` }} />
        ))}
        {style === 'classic' && previewColors.slice(0, 3).map((c, i) => (
          <div key={i} className="w-8 h-2 bg-black/60 rounded-sm border border-white/10">
            <div className="h-full" style={{ width: `${previewValues[i]}%`, backgroundColor: c }} />
          </div>
        ))}
      </div>
      <span className="text-[10px] font-medium text-white/70 capitalize">{style.replace('-', ' ')}</span>
      {selected && <Check className="absolute top-2 right-2 w-3.5 h-3.5 text-blue-400" />}
    </button>
  )
}

// ============ HUD SETTINGS PANEL ============
function HudSettingsPanel({ settings, onUpdateSettings, onClose }: { settings: HudSettings, onUpdateSettings: (settings: HudSettings) => void, onClose: () => void }) {
  const styles: HudStyle[] = ['bars', 'bars-vertical', 'circles-outline', 'circles-fill', 'circles-glow', 'pills', 'minimal', 'modern-cards', 'compact', 'neon', 'gradient', 'classic']
  const schemes = ['default', 'red', 'blue', 'green', 'purple', 'orange'] as const
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-[700px] max-h-[85vh] bg-[rgba(16,16,20,0.98)] border border-white/[0.08] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ boxShadow: '0 25px 80px -12px rgba(0,0,0,0.8)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/[0.08]">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">dopa - HUD Config</h2>
              <p className="text-xs text-white/40">Personaliza tu interfaz de juego</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.06] transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)] space-y-6">
          {/* Style Selection */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" /> Estilo del HUD
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {styles.map(s => (
                <StylePreview key={s} style={s} selected={settings.style === s} onClick={() => onUpdateSettings({ ...settings, style: s })} />
              ))}
            </div>
          </div>
          
          {/* Color Scheme */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3">Esquema de Colores</h3>
            <div className="flex gap-2">
              {schemes.map(scheme => (
                <button key={scheme} onClick={() => onUpdateSettings({ ...settings, colorScheme: scheme })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${settings.colorScheme === scheme ? 'bg-white/[0.08] border-white/20' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'}`}
                >
                  <div className="flex gap-0.5">
                    {Object.values(colorSchemes[scheme]).slice(0, 4).map((c, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-white/60 capitalize">{scheme}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Position Settings */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-3">Posicion Status</h3>
              <div className="flex gap-2">
                {(['left', 'right'] as const).map(pos => (
                  <button key={pos} onClick={() => onUpdateSettings({ ...settings, statusPosition: pos })}
                    className={`flex-1 py-2.5 rounded-lg border text-xs font-medium transition-all ${settings.statusPosition === pos ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.06]'}`}
                  >
                    {pos === 'left' ? 'Izquierda' : 'Derecha'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-3">Posicion Velocimetro</h3>
              <div className="flex gap-2">
                {(['left', 'center', 'right'] as const).map(pos => (
                  <button key={pos} onClick={() => onUpdateSettings({ ...settings, speedoPosition: pos })}
                    className={`flex-1 py-2.5 rounded-lg border text-xs font-medium transition-all ${settings.speedoPosition === pos ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.06]'}`}
                  >
                    {pos === 'left' ? 'Izq' : pos === 'center' ? 'Centro' : 'Der'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Toggle Elements */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3">Elementos Visibles</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'showMoney', label: 'Dinero', icon: DollarSign },
                { key: 'showCompass', label: 'Brujula', icon: Eye },
                { key: 'showPlayerInfo', label: 'Info Jugador', icon: Eye }
              ].map(item => (
                <button key={item.key} onClick={() => onUpdateSettings({ ...settings, [item.key]: !settings[item.key as keyof HudSettings] })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${settings[item.key as keyof HudSettings] ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-white/[0.02] border-white/[0.06] text-white/40'}`}
                >
                  {settings[item.key as keyof HudSettings] ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Scale & Opacity */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-3">Escala: {settings.scale}x</h3>
              <input type="range" min="0.7" max="1.3" step="0.05" value={settings.scale}
                onChange={(e) => onUpdateSettings({ ...settings, scale: parseFloat(e.target.value) })}
                className="w-full h-2 bg-white/[0.08] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-3">Opacidad: {Math.round(settings.opacity * 100)}%</h3>
              <input type="range" min="0.4" max="1" step="0.05" value={settings.opacity}
                onChange={(e) => onUpdateSettings({ ...settings, opacity: parseFloat(e.target.value) })}
                className="w-full h-2 bg-white/[0.08] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20"
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
          <span className="text-[11px] text-white/30">Comando: /hud | Atajo: Ctrl+H</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-sm font-medium text-white/70 transition-colors">
              Cancelar
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white transition-colors">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ MAIN HUD COMPONENT ============
export function OxLibHUD() {
  const [settings, setSettings] = useState<HudSettings>({
    style: 'circles-outline',
    showMoney: true,
    showCompass: true,
    showPlayerInfo: true,
    statusPosition: 'left',
    speedoPosition: 'right',
    scale: 1,
    opacity: 1,
    colorScheme: 'default'
  })
  const [showSettings, setShowSettings] = useState(false)
  
  // HUD state
  const [health, setHealth] = useState(85)
  const [armor, setArmor] = useState(60)
  const [hunger, setHunger] = useState(72)
  const [thirst, setThirst] = useState(55)
  const [stamina, setStamina] = useState(100)
  const [oxygen, setOxygen] = useState(100)
  const [stress, setStress] = useState(12)
  const [cash, setCash] = useState(56000)
  const [bank, setBank] = useState(156000)
  const [voiceRange, setVoiceRange] = useState<'whisper' | 'normal' | 'shout'>('normal')
  const [isTalking, setIsTalking] = useState(false)
  const [inVehicle, setInVehicle] = useState(true)
  const [speed, setSpeed] = useState(85)
  const [fuel, setFuel] = useState(72)
  const [gear, setGear] = useState('D')
  const [rpm, setRpm] = useState(4500)
  const [heading, setHeading] = useState('N')
  const [streetName, setStreetName] = useState('Vinewood Blvd')
  const [playerId] = useState(252)
  const [serverName] = useState('dopa server')
  const [playerCount] = useState('128/256')

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' && e.ctrlKey) { e.preventDefault(); setShowSettings(true) }
      if (e.key === 'Escape' && showSettings) { setShowSettings(false) }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSettings])

  const colors = colorSchemes[settings.colorScheme]

  const renderStatus = useCallback((icon: React.ReactNode, value: number, color: string, label: string, visible = true, critical = false) => {
    if (!visible) return null
    const props = { icon, value, color, label, critical }
    
    switch (settings.style) {
      case 'bars-vertical': return <StatusBarsVertical key={label} {...props} />
      case 'circles-outline': return <StatusCirclesOutline key={label} {...props} />
      case 'circles-fill': return <StatusCirclesFill key={label} {...props} />
      case 'circles-glow': return <StatusCirclesGlow key={label} {...props} />
      case 'pills': return <StatusPills key={label} {...props} />
      case 'minimal': return <StatusMinimal key={label} icon={icon} value={value} color={color} critical={critical} />
      case 'modern-cards': return <StatusModernCards key={label} {...props} />
      case 'compact': return <StatusCompact key={label} icon={icon} value={value} color={color} critical={critical} />
      case 'neon': return <StatusNeon key={label} {...props} />
      case 'gradient': return <StatusGradient key={label} {...props} />
      case 'classic': return <StatusClassic key={label} {...props} />
      default: return <StatusBars key={label} {...props} />
    }
  }, [settings.style])

  const statusItems = [
    { icon: <Heart className="w-full h-full" />, value: health, color: colors.health, label: 'Health', visible: true, critical: health <= 20 },
    { icon: <Shield className="w-full h-full" />, value: armor, color: colors.armor, label: 'Armor', visible: armor > 0, critical: false },
    { icon: <Utensils className="w-full h-full" />, value: hunger, color: colors.food, label: 'Food', visible: true, critical: hunger <= 20 },
    { icon: <Droplets className="w-full h-full" />, value: thirst, color: colors.water, label: 'Water', visible: true, critical: thirst <= 20 },
    { icon: <Zap className="w-full h-full" />, value: stamina, color: colors.stamina, label: 'Stamina', visible: true, critical: false },
    { icon: <Wind className="w-full h-full" />, value: oxygen, color: colors.oxygen, label: 'Oxygen', visible: oxygen < 100, critical: oxygen <= 20 },
    { icon: <Brain className="w-full h-full" />, value: stress, color: colors.stress, label: 'Stress', visible: stress > 0, critical: stress >= 80 }
  ]

  const isCircleStyle = settings.style.includes('circles') || settings.style === 'modern-cards'
  const isVertical = settings.style === 'bars-vertical'
  const statusPositionClass = settings.statusPosition === 'left' ? 'left-6' : 'right-6'
  // All styles now display horizontally in a row
  const statusFlexClass = isCircleStyle ? 'flex-row flex-wrap gap-2' : isVertical ? 'flex-row gap-1' : 'flex-row gap-2 items-center'

  return (
    <div className="fixed inset-0 pointer-events-none z-50" style={{ opacity: settings.opacity, transform: `scale(${settings.scale})`, transformOrigin: 'bottom left' }}>
      {/* Status - Bottom Left/Right */}
      <div className={`fixed bottom-6 ${statusPositionClass} flex ${statusFlexClass}`}>
        {statusItems.map(item => renderStatus(item.icon, item.value, item.color, item.label, item.visible, item.critical))}
      </div>

      {/* Voice Indicator - Above status */}
      <div className={`fixed ${statusPositionClass}`} style={{ bottom: '70px' }}>
        <VoiceIndicator range={voiceRange} talking={isTalking} style={settings.style} />
      </div>

      {/* Money Display - Top Right */}
      {settings.showMoney && (
        <div className="fixed top-6 right-6">
          <MoneyDisplay cash={cash} bank={bank} style={settings.style} />
        </div>
      )}

      {/* Player Info - Top Left */}
      {settings.showPlayerInfo && (
        <div className="fixed top-6 left-6 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-lg">
            <span className="text-[9px] font-semibold text-white/40 uppercase">ID</span>
            <span className="text-sm font-bold text-white tabular-nums">{playerId}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-lg">
            <span className="text-xs font-medium text-white/60">{serverName}</span>
            <span className="text-[10px] font-semibold text-white/30 px-1.5 py-0.5 bg-white/[0.05] rounded">{playerCount}</span>
          </div>
        </div>
      )}

      {/* Speedometer - Bottom Right/Center/Left */}
      <Speedometer visible={inVehicle} speed={speed} fuel={fuel} gear={gear} rpm={rpm} position={settings.speedoPosition} style={settings.style} />

      {/* Compass - Top Center */}
      {settings.showCompass && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-lg relative">
            {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].map((dir) => (
              <span key={dir} className={`text-[10px] font-medium transition-all ${heading === dir ? dir === 'N' ? 'text-red-500 font-bold scale-110' : 'text-white font-bold scale-110' : 'text-white/30'}`}>{dir}</span>
            ))}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-white" />
          </div>
          <span className="text-[11px] font-medium text-white/60" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{streetName}</span>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && <HudSettingsPanel settings={settings} onUpdateSettings={setSettings} onClose={() => setShowSettings(false)} />}

      {/* Settings Button - Clickable */}
      <button 
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-[rgba(18,18,22,0.9)] hover:bg-[rgba(30,30,38,0.95)] border border-white/[0.08] hover:border-white/[0.15] rounded-full transition-all pointer-events-auto cursor-pointer group"
      >
        <Settings className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:rotate-90 transition-all duration-300" />
        <span className="text-[11px] font-medium text-white/40 group-hover:text-white/70 transition-colors">Configurar HUD</span>
      </button>
    </div>
  )
}
