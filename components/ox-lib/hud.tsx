"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart, Shield, Coffee, Droplets, Zap, Wind, Frown, DollarSign, CreditCard, Mic, Fuel, X, Settings, Check } from "lucide-react"

// HUD Style Types
type HudStyle = 'bars' | 'circles' | 'minimal' | 'modern' | 'compact' | 'neon'

interface HudSettings {
  style: HudStyle
  showMoney: boolean
  showCompass: boolean
  showPlayerInfo: boolean
  statusPosition: 'left' | 'right'
  speedoPosition: 'left' | 'right' | 'center'
  scale: number
  opacity: number
}

// ============ BAR STYLE STATUS ============
function StatusBarStyle({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-lg transition-all duration-300 ${critical ? 'animate-pulse border-red-500/40' : ''}`}>
      <div className="w-5 h-5 flex items-center justify-center rounded" style={{ backgroundColor: `${color}15` }}>
        <div style={{ color }} className="w-3.5 h-3.5">{icon}</div>
      </div>
      <div className="flex-1 min-w-[60px]">
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.max(0, Math.min(100, value))}%`,
              background: `linear-gradient(90deg, ${color}80 0%, ${color} 100%)`,
              boxShadow: `0 0 8px ${color}60`
            }}
          />
        </div>
      </div>
      <span className="text-[10px] font-bold text-white/50 min-w-[24px] text-right tabular-nums">
        {Math.round(value)}%
      </span>
    </div>
  )
}

// ============ CIRCLE STYLE STATUS ============
function StatusCircleStyle({ icon, value, color, label, critical, size = 'normal' }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean, size?: 'small' | 'normal' | 'large' }) {
  const sizeClasses = {
    small: { wrapper: 'w-10 h-10', icon: 'w-3 h-3', stroke: 3 },
    normal: { wrapper: 'w-12 h-12', icon: 'w-4 h-4', stroke: 3 },
    large: { wrapper: 'w-14 h-14', icon: 'w-5 h-5', stroke: 4 }
  }
  const s = sizeClasses[size]
  const radius = size === 'small' ? 16 : size === 'normal' ? 20 : 24
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className={`relative ${s.wrapper} flex items-center justify-center ${critical ? 'animate-pulse' : ''}`}>
      <svg className="absolute inset-0 -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={s.stroke}
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={s.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ 
            transition: 'stroke-dashoffset 0.5s ease',
            filter: `drop-shadow(0 0 6px ${color}80)`
          }}
        />
      </svg>
      <div className={s.icon} style={{ color }}>{icon}</div>
    </div>
  )
}

// ============ MINIMAL STYLE STATUS ============
function StatusMinimalStyle({ icon, value, color, critical }: { icon: React.ReactNode, value: number, color: string, critical?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 ${critical ? 'animate-pulse' : ''}`}>
      <div className="w-4 h-4" style={{ color }}>{icon}</div>
      <span className="text-[11px] font-bold tabular-nums" style={{ color, textShadow: `0 0 8px ${color}60` }}>
        {Math.round(value)}
      </span>
    </div>
  )
}

// ============ MODERN STYLE STATUS ============
function StatusModernStyle({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 px-3 py-2 bg-[rgba(18,18,22,0.85)] border border-white/[0.05] rounded-xl ${critical ? 'animate-pulse border-red-500/30' : ''}`}>
      <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <div style={{ color }} className="w-4 h-4">{icon}</div>
      </div>
      <div className="w-16 h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${value}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`
          }}
        />
      </div>
      <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wide">{label}</span>
    </div>
  )
}

// ============ COMPACT STYLE STATUS ============
function StatusCompactStyle({ icon, value, color, critical }: { icon: React.ReactNode, value: number, color: string, critical?: boolean }) {
  return (
    <div className={`flex items-center gap-1 px-1.5 py-1 ${critical ? 'animate-pulse' : ''}`}>
      <div className="w-3.5 h-3.5" style={{ color }}>{icon}</div>
      <div className="w-8 h-1 bg-white/[0.08] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ============ NEON STYLE STATUS ============
function StatusNeonStyle({ icon, value, color, label, critical }: { icon: React.ReactNode, value: number, color: string, label: string, critical?: boolean }) {
  return (
    <div className={`relative flex items-center gap-2.5 px-3 py-2 bg-black/60 border rounded-lg ${critical ? 'animate-pulse' : ''}`}
      style={{ borderColor: `${color}40`, boxShadow: `0 0 15px ${color}30, inset 0 0 20px ${color}10` }}
    >
      <div className="w-5 h-5 flex items-center justify-center" style={{ color, filter: `drop-shadow(0 0 6px ${color})` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-[50px]">
        <div className="h-2 bg-black/40 rounded-full overflow-hidden border" style={{ borderColor: `${color}30` }}>
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${value}%`,
              background: `linear-gradient(90deg, ${color}60 0%, ${color} 100%)`,
              boxShadow: `0 0 10px ${color}, inset 0 0 5px rgba(255,255,255,0.3)`
            }}
          />
        </div>
      </div>
      <span className="text-[10px] font-bold tabular-nums" style={{ color, textShadow: `0 0 8px ${color}` }}>
        {Math.round(value)}%
      </span>
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
            <span 
              key={level}
              className="w-[3px] rounded-sm transition-all duration-200"
              style={{ 
                height: level === 1 ? '5px' : level === 2 ? '8px' : '11px',
                backgroundColor: level <= levels ? '#22c55e' : 'rgba(255,255,255,0.15)',
                boxShadow: level <= levels && talking ? '0 0 6px #22c55e' : 'none'
              }}
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
          <span 
            key={level}
            className="w-1 rounded-sm transition-all duration-200"
            style={{ 
              height: level === 1 ? '6px' : level === 2 ? '10px' : '14px',
              backgroundColor: level <= levels ? '#22c55e' : 'rgba(255,255,255,0.15)',
              boxShadow: level <= levels && talking ? '0 0 8px rgba(34,197,94,0.6)' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ============ SPEEDOMETER ============
function Speedometer({ visible, speed, fuel, gear, position, style }: { visible: boolean, speed: number, fuel: number, gear: string, position: 'left' | 'right' | 'center', style: HudStyle }) {
  if (!visible) return null
  
  const positionClasses = {
    left: 'left-8',
    right: 'right-8',
    center: 'left-1/2 -translate-x-1/2'
  }
  
  if (style === 'circles') {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const maxSpeed = 200
    const speedPercent = Math.min(speed / maxSpeed, 1)
    const strokeDashoffset = circumference - speedPercent * circumference
    
    return (
      <div className={`fixed bottom-6 ${positionClasses[position]}`}>
        <div className="relative w-28 h-28 flex items-center justify-center bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-full">
          <svg className="absolute inset-0 -rotate-90 w-full h-full">
            <circle cx="50%" cy="50%" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle 
              cx="50%" cy="50%" r={radius} fill="none" 
              stroke="#3b82f6" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.3s ease', filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.6))' }}
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white tabular-nums">{Math.round(speed)}</span>
            <span className="text-[8px] font-semibold text-white/40 uppercase">KM/H</span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[rgba(18,18,22,0.95)] border border-white/[0.08] rounded text-xs font-bold text-white/80">
            {gear}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-lg">
          <Fuel className="w-3.5 h-3.5 text-orange-500" />
          <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${fuel}%` }} />
          </div>
          <span className="text-[10px] font-semibold text-white/50 tabular-nums">{Math.round(fuel)}%</span>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`fixed bottom-6 ${positionClasses[position]}`}>
      <div className="flex flex-col items-center gap-2 px-5 py-3.5 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-xl min-w-[160px]">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white tabular-nums">{Math.round(speed)}</span>
          <span className="text-[10px] font-semibold text-white/40 uppercase">KM/H</span>
        </div>
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-orange-500" />
            <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${fuel}%` }} />
            </div>
            <span className="text-[10px] font-semibold text-white/40 tabular-nums">{Math.round(fuel)}%</span>
          </div>
          <div className="flex flex-col items-center px-2 py-1 bg-white/[0.05] rounded">
            <span className="text-[7px] font-semibold text-white/30 uppercase">GEAR</span>
            <span className="text-sm font-bold text-white">{gear}</span>
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
        <span className="text-sm font-bold text-green-500 tabular-nums" style={{ textShadow: '0 0 8px rgba(34,197,94,0.4)' }}>
          {formatMoney(cash)}
        </span>
        <span className="text-sm font-bold text-purple-400 tabular-nums" style={{ textShadow: '0 0 8px rgba(168,85,247,0.4)' }}>
          {formatMoney(bank)}
        </span>
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
        <div className="w-5 h-5 flex items-center justify-center rounded bg-purple-500/20">
          <CreditCard className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <span className="text-sm font-bold text-purple-400 tabular-nums">{formatMoney(bank)}</span>
      </div>
    </div>
  )
}

// ============ HUD SETTINGS PANEL ============
function HudSettingsPanel({ settings, onUpdateSettings, onClose }: { settings: HudSettings, onUpdateSettings: (settings: HudSettings) => void, onClose: () => void }) {
  const styles: { id: HudStyle, name: string, desc: string }[] = [
    { id: 'bars', name: 'Barras', desc: 'Estilo clasico con barras horizontales' },
    { id: 'circles', name: 'Circulos', desc: 'Indicadores circulares modernos' },
    { id: 'minimal', name: 'Minimal', desc: 'Solo iconos y numeros, sin fondo' },
    { id: 'modern', name: 'Moderno', desc: 'Tarjetas verticales con labels' },
    { id: 'compact', name: 'Compacto', desc: 'Version ultra compacta' },
    { id: 'neon', name: 'Neon', desc: 'Efecto de luz neon brillante' }
  ]
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-[600px] max-h-[80vh] bg-[rgba(18,18,22,0.98)] border border-white/[0.08] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20">
              <Settings className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Configuracion HUD</h2>
              <p className="text-xs text-white/40">Personaliza tu interfaz</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Style Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white/80 mb-3">Estilo del HUD</h3>
            <div className="grid grid-cols-3 gap-2">
              {styles.map(s => (
                <button
                  key={s.id}
                  onClick={() => onUpdateSettings({ ...settings, style: s.id })}
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl border transition-all ${settings.style === s.id ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'}`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-sm font-medium text-white">{s.name}</span>
                    {settings.style === s.id && <Check className="w-3.5 h-3.5 text-blue-400 ml-auto" />}
                  </div>
                  <span className="text-[10px] text-white/40">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Position Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white/80 mb-3">Posiciones</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-2 block">Status (Vida, etc.)</label>
                <div className="flex gap-2">
                  {(['left', 'right'] as const).map(pos => (
                    <button
                      key={pos}
                      onClick={() => onUpdateSettings({ ...settings, statusPosition: pos })}
                      className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${settings.statusPosition === pos ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06]'}`}
                    >
                      {pos === 'left' ? 'Izquierda' : 'Derecha'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-2 block">Velocimetro</label>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map(pos => (
                    <button
                      key={pos}
                      onClick={() => onUpdateSettings({ ...settings, speedoPosition: pos })}
                      className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${settings.speedoPosition === pos ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06]'}`}
                    >
                      {pos === 'left' ? 'Izq' : pos === 'center' ? 'Centro' : 'Der'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Toggle Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white/80 mb-3">Elementos</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'showMoney', label: 'Dinero' },
                { key: 'showCompass', label: 'Brujula' },
                { key: 'showPlayerInfo', label: 'Info Jugador' }
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => onUpdateSettings({ ...settings, [item.key]: !settings[item.key as keyof HudSettings] })}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${settings[item.key as keyof HudSettings] ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/[0.03] border-white/[0.06] text-white/40'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Scale & Opacity */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3">Ajustes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-2 block">Escala: {settings.scale}x</label>
                <input 
                  type="range" min="0.7" max="1.3" step="0.1" value={settings.scale}
                  onChange={(e) => onUpdateSettings({ ...settings, scale: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-2 block">Opacidad: {Math.round(settings.opacity * 100)}%</label>
                <input 
                  type="range" min="0.5" max="1" step="0.05" value={settings.opacity}
                  onChange={(e) => onUpdateSettings({ ...settings, opacity: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-sm font-medium text-white/70 transition-colors">
            Cerrar
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-sm font-medium text-blue-400 transition-colors">
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ MAIN HUD COMPONENT ============
export function OxLibHUD() {
  // Settings state
  const [settings, setSettings] = useState<HudSettings>({
    style: 'bars',
    showMoney: true,
    showCompass: true,
    showPlayerInfo: true,
    statusPosition: 'left',
    speedoPosition: 'right',
    scale: 1,
    opacity: 1
  })
  const [showSettings, setShowSettings] = useState(false)
  
  // HUD state
  const [health, setHealth] = useState(100)
  const [armor, setArmor] = useState(75)
  const [hunger, setHunger] = useState(85)
  const [thirst, setThirst] = useState(60)
  const [stamina, setStamina] = useState(100)
  const [oxygen, setOxygen] = useState(100)
  const [stress, setStress] = useState(15)
  const [cash, setCash] = useState(56000)
  const [bank, setBank] = useState(56000)
  const [voiceRange, setVoiceRange] = useState<'whisper' | 'normal' | 'shout'>('normal')
  const [isTalking, setIsTalking] = useState(false)
  const [inVehicle, setInVehicle] = useState(true)
  const [speed, setSpeed] = useState(85)
  const [fuel, setFuel] = useState(65)
  const [gear, setGear] = useState('D')
  const [heading, setHeading] = useState('N')
  const [streetName, setStreetName] = useState('Vinewood Blvd')
  const [playerId] = useState(252)
  const [serverName] = useState('dopa server')
  const [playerCount] = useState('128/256')

  // Keyboard listener for /hud command simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' && e.ctrlKey) {
        e.preventDefault()
        setShowSettings(true)
      }
      if (e.key === 'Escape' && showSettings) {
        setShowSettings(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSettings])

  // Render status based on style
  const renderStatus = useCallback((icon: React.ReactNode, value: number, color: string, label: string, visible = true, critical = false) => {
    if (!visible) return null
    
    switch (settings.style) {
      case 'circles':
        return <StatusCircleStyle key={label} icon={icon} value={value} color={color} label={label} critical={critical} />
      case 'minimal':
        return <StatusMinimalStyle key={label} icon={icon} value={value} color={color} critical={critical} />
      case 'modern':
        return <StatusModernStyle key={label} icon={icon} value={value} color={color} label={label} critical={critical} />
      case 'compact':
        return <StatusCompactStyle key={label} icon={icon} value={value} color={color} critical={critical} />
      case 'neon':
        return <StatusNeonStyle key={label} icon={icon} value={value} color={color} label={label} critical={critical} />
      default:
        return <StatusBarStyle key={label} icon={icon} value={value} color={color} label={label} critical={critical} />
    }
  }, [settings.style])

  const statusItems = [
    { icon: <Heart className="w-full h-full" />, value: health, color: '#ef4444', label: 'Health', visible: true, critical: health <= 20 },
    { icon: <Shield className="w-full h-full" />, value: armor, color: '#3b82f6', label: 'Armor', visible: armor > 0, critical: false },
    { icon: <Coffee className="w-full h-full" />, value: hunger, color: '#f97316', label: 'Food', visible: true, critical: hunger <= 20 },
    { icon: <Droplets className="w-full h-full" />, value: thirst, color: '#06b6d4', label: 'Water', visible: true, critical: thirst <= 20 },
    { icon: <Zap className="w-full h-full" />, value: stamina, color: '#eab308', label: 'Stamina', visible: true, critical: false },
    { icon: <Wind className="w-full h-full" />, value: oxygen, color: '#8b5cf6', label: 'Oxygen', visible: oxygen < 100, critical: oxygen <= 20 },
    { icon: <Frown className="w-full h-full" />, value: stress, color: '#ec4899', label: 'Stress', visible: stress > 0, critical: stress >= 80 }
  ]

  const statusPositionClass = settings.statusPosition === 'left' ? 'left-6' : 'right-6'
  const statusFlexDirection = settings.style === 'circles' || settings.style === 'modern' ? 'flex-row flex-wrap gap-2 max-w-[280px]' : 'flex-col gap-1.5'

  return (
    <div className="fixed inset-0 pointer-events-none z-50" style={{ opacity: settings.opacity, transform: `scale(${settings.scale})`, transformOrigin: 'bottom left' }}>
      {/* Status Bars - Bottom Left/Right */}
      <div className={`fixed bottom-6 ${statusPositionClass} flex ${statusFlexDirection}`}>
        {statusItems.map(item => renderStatus(item.icon, item.value, item.color, item.label, item.visible, item.critical))}
      </div>

      {/* Voice Indicator - Bottom Left (always) */}
      <div className={`fixed bottom-6 ${settings.statusPosition === 'left' ? 'left-6' : 'left-6'}`} style={{ bottom: settings.style === 'circles' ? '180px' : settings.style === 'modern' ? '200px' : '220px' }}>
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

      {/* Speedometer */}
      <Speedometer visible={inVehicle} speed={speed} fuel={fuel} gear={gear} position={settings.speedoPosition} style={settings.style} />

      {/* Compass - Top Center */}
      {settings.showCompass && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[rgba(18,18,22,0.9)] border border-white/[0.06] rounded-lg relative">
            {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].map((dir) => (
              <span 
                key={dir}
                className={`text-[10px] font-medium transition-all ${heading === dir ? dir === 'N' ? 'text-red-500 font-bold scale-110' : 'text-white font-bold scale-110' : 'text-white/30'}`}
              >
                {dir}
              </span>
            ))}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-white" />
          </div>
          <span className="text-[11px] font-medium text-white/60" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{streetName}</span>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <HudSettingsPanel settings={settings} onUpdateSettings={setSettings} onClose={() => setShowSettings(false)} />
      )}

      {/* Settings hint */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/20">
        Ctrl+H para configurar HUD
      </div>
    </div>
  )
}
