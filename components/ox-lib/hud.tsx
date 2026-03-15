"use client"

import { useState, useEffect } from "react"
import { Heart, Shield, Coffee, Droplets, Zap, Wind, Frown, DollarSign, CreditCard, Mic, Fuel } from "lucide-react"

interface StatusBarProps {
  icon: React.ReactNode
  value: number
  color: string
  glowColor: string
  visible?: boolean
  critical?: boolean
}

function StatusBar({ icon, value, color, glowColor, visible = true, critical = false }: StatusBarProps) {
  if (!visible) return null
  
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 bg-[rgba(22,22,26,0.92)] border border-white/[0.08] rounded-xl transition-all duration-300 ${critical ? 'animate-pulse border-red-500/50' : ''}`}>
      <div 
        className="w-6 h-6 flex items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}20` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="flex-1 min-w-[80px]">
        <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.max(0, Math.min(100, value))}%`,
              background: `linear-gradient(90deg, ${color}99 0%, ${color} 100%)`,
              boxShadow: `0 0 10px ${glowColor}`
            }}
          />
        </div>
      </div>
      <span className="text-xs font-semibold text-white/60 min-w-[2rem] text-right tabular-nums">
        {Math.round(value)}
      </span>
    </div>
  )
}

interface MoneyItemProps {
  icon: React.ReactNode
  value: number
  color: string
  label: string
}

function MoneyItem({ icon, value, color, label }: MoneyItemProps) {
  const formatMoney = (amount: number) => {
    return '$' + amount.toLocaleString('en-US')
  }
  
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[rgba(22,22,26,0.92)] border border-white/[0.08] rounded-xl min-w-[140px]">
      <div 
        className="w-6 h-6 flex items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}20` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <span className="text-sm font-semibold tabular-nums" style={{ color }}>
        {formatMoney(value)}
      </span>
    </div>
  )
}

interface VoiceIndicatorProps {
  range: 'whisper' | 'normal' | 'shout'
  talking: boolean
}

function VoiceIndicator({ range, talking }: VoiceIndicatorProps) {
  const levels = range === 'whisper' ? 1 : range === 'normal' ? 2 : 3
  const modeLabels = { whisper: 'Whisper', normal: 'Normal', shout: 'Shout' }
  
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 bg-[rgba(22,22,26,0.92)] border border-white/[0.08] rounded-xl ${talking ? 'border-green-500/30' : ''}`}>
      <div className={`w-6 h-6 flex items-center justify-center ${talking ? 'text-green-500' : 'text-white/40'}`}>
        <Mic className="w-4 h-4" />
      </div>
      <div className="flex items-end gap-[3px] h-4">
        {[1, 2, 3].map((level) => (
          <span 
            key={level}
            className={`w-1 rounded-sm transition-all duration-200 ${level <= levels ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-white/15'}`}
            style={{ height: level === 1 ? '6px' : level === 2 ? '10px' : '14px' }}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
        {modeLabels[range]}
      </span>
    </div>
  )
}

interface SpeedometerProps {
  visible: boolean
  speed: number
  fuel: number
  gear: string
}

function Speedometer({ visible, speed, fuel, gear }: SpeedometerProps) {
  if (!visible) return null
  
  return (
    <div className="flex flex-col items-center gap-2.5 px-6 py-4 bg-[rgba(22,22,26,0.92)] border border-white/[0.08] rounded-2xl min-w-[200px]">
      <div className="flex items-baseline gap-1.5">
        <span className="text-4xl font-bold text-white/95 tabular-nums leading-none">
          {Math.round(speed)}
        </span>
        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wide">
          KM/H
        </span>
      </div>
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center text-orange-500">
            <Fuel className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${fuel}%`,
                background: 'linear-gradient(90deg, #ea580c 0%, #f97316 100%)'
              }}
            />
          </div>
          <span className="text-[11px] font-semibold text-white/40 min-w-[2rem] text-right">
            {Math.round(fuel)}%
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 bg-white/[0.06] rounded-lg">
          <span className="text-[8px] font-semibold text-white/40 uppercase tracking-wider">GEAR</span>
          <span className="text-base font-bold text-white/95">{gear}</span>
        </div>
      </div>
    </div>
  )
}

interface CompassProps {
  heading: string
  streetName: string
}

function Compass({ heading, streetName }: CompassProps) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-3 px-5 py-2 bg-[rgba(22,22,26,0.92)] border border-white/[0.08] rounded-xl relative">
        {directions.map((dir) => (
          <span 
            key={dir}
            className={`text-[11px] font-medium transition-all duration-200 ${
              heading === dir 
                ? dir === 'N' 
                  ? 'text-red-500 font-bold scale-125' 
                  : 'text-white/95 font-bold scale-125'
                : 'text-white/40'
            }`}
          >
            {dir}
          </span>
        ))}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-white/95" />
      </div>
      <span className="text-xs font-medium text-white/70" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
        {streetName}
      </span>
    </div>
  )
}

interface PlayerInfoProps {
  playerId: number
  serverName: string
  playerCount: string
}

function PlayerInfo({ playerId, serverName, playerCount }: PlayerInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-3.5 py-2 bg-[rgba(22,22,26,0.92)] border border-white/[0.08] rounded-xl">
        <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">ID</span>
        <span className="text-sm font-bold text-white/95 tabular-nums">{playerId}</span>
      </div>
      <div className="flex items-center gap-3 px-3.5 py-2 bg-[rgba(22,22,26,0.92)] border border-white/[0.08] rounded-xl">
        <span className="text-xs font-medium text-white/70">{serverName}</span>
        <span className="text-[11px] font-semibold text-white/40 px-2 py-0.5 bg-white/[0.06] rounded">
          {playerCount}
        </span>
      </div>
    </div>
  )
}

export function OxLibHUD() {
  // State
  const [health, setHealth] = useState(100)
  const [armor, setArmor] = useState(75)
  const [hunger, setHunger] = useState(85)
  const [thirst, setThirst] = useState(60)
  const [stamina, setStamina] = useState(100)
  const [oxygen, setOxygen] = useState(100)
  const [stress, setStress] = useState(0)
  const [cash, setCash] = useState(12500)
  const [bank, setBank] = useState(85420)
  const [voiceRange, setVoiceRange] = useState<'whisper' | 'normal' | 'shout'>('normal')
  const [isTalking, setIsTalking] = useState(false)
  const [inVehicle, setInVehicle] = useState(false)
  const [speed, setSpeed] = useState(0)
  const [fuel, setFuel] = useState(75)
  const [gear, setGear] = useState('P')
  const [heading, setHeading] = useState('N')
  const [streetName, setStreetName] = useState('Vinewood Blvd')
  const [playerId] = useState(156)
  const [serverName] = useState('dopa server')
  const [playerCount] = useState('128/256')

  // Demo effects
  useEffect(() => {
    // Simulate hunger/thirst decrease
    const statusInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setHunger(prev => Math.max(0, prev - Math.random() * 2))
      }
      if (Math.random() > 0.8) {
        setThirst(prev => Math.max(0, prev - Math.random() * 3))
      }
    }, 5000)

    // Simulate compass changes
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    let dirIndex = 0
    const compassInterval = setInterval(() => {
      dirIndex = (dirIndex + 1) % directions.length
      setHeading(directions[dirIndex])
    }, 2000)

    // Simulate entering vehicle after 3 seconds
    const vehicleTimeout = setTimeout(() => {
      setInVehicle(true)
      setGear('P')
      
      // Simulate driving
      let currentSpeed = 0
      const driveInterval = setInterval(() => {
        currentSpeed = Math.min(120, currentSpeed + Math.random() * 10)
        setSpeed(currentSpeed)
        setGear(currentSpeed > 60 ? 'D' : currentSpeed > 30 ? '2' : '1')
        setFuel(prev => Math.max(0, prev - 0.1))
        
        if (currentSpeed >= 120) {
          clearInterval(driveInterval)
          // Slow down
          const slowInterval = setInterval(() => {
            currentSpeed = Math.max(0, currentSpeed - Math.random() * 15)
            setSpeed(currentSpeed)
            setGear(currentSpeed > 0 ? 'D' : 'P')
            if (currentSpeed <= 0) {
              clearInterval(slowInterval)
              setTimeout(() => setInVehicle(false), 2000)
            }
          }, 500)
        }
      }, 500)
    }, 3000)

    return () => {
      clearInterval(statusInterval)
      clearInterval(compassInterval)
      clearTimeout(vehicleTimeout)
    }
  }, [])

  // Voice range cycle on key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'v' || e.key === 'V') {
        setVoiceRange(prev => {
          const ranges: Array<'whisper' | 'normal' | 'shout'> = ['whisper', 'normal', 'shout']
          const currentIndex = ranges.indexOf(prev)
          return ranges[(currentIndex + 1) % ranges.length]
        })
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Status Bars - Bottom Right */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-2 min-w-[180px]">
        <StatusBar 
          icon={<Heart className="w-3.5 h-3.5" />} 
          value={health} 
          color="#ef4444" 
          glowColor="rgba(239,68,68,0.4)"
          critical={health <= 20}
        />
        <StatusBar 
          icon={<Shield className="w-3.5 h-3.5" />} 
          value={armor} 
          color="#3b82f6" 
          glowColor="rgba(59,130,246,0.4)"
          visible={armor > 0}
        />
        <StatusBar 
          icon={<Coffee className="w-3.5 h-3.5" />} 
          value={hunger} 
          color="#f97316" 
          glowColor="rgba(249,115,22,0.4)"
          critical={hunger <= 20}
        />
        <StatusBar 
          icon={<Droplets className="w-3.5 h-3.5" />} 
          value={thirst} 
          color="#06b6d4" 
          glowColor="rgba(6,182,212,0.4)"
          critical={thirst <= 20}
        />
        <StatusBar 
          icon={<Zap className="w-3.5 h-3.5" />} 
          value={stamina} 
          color="#eab308" 
          glowColor="rgba(234,179,8,0.4)"
        />
        <StatusBar 
          icon={<Wind className="w-3.5 h-3.5" />} 
          value={oxygen} 
          color="#8b5cf6" 
          glowColor="rgba(139,92,246,0.4)"
          visible={oxygen < 100}
        />
        <StatusBar 
          icon={<Frown className="w-3.5 h-3.5" />} 
          value={stress} 
          color="#ec4899" 
          glowColor="rgba(236,72,153,0.4)"
          visible={stress > 0}
        />
      </div>

      {/* Money Display - Top Right */}
      <div className="fixed top-8 right-8 flex flex-col gap-2">
        <MoneyItem 
          icon={<DollarSign className="w-4 h-4" />} 
          value={cash} 
          color="#22c55e"
          label="Cash"
        />
        <MoneyItem 
          icon={<CreditCard className="w-4 h-4" />} 
          value={bank} 
          color="#a855f7"
          label="Bank"
        />
      </div>

      {/* Player Info - Top Left */}
      <div className="fixed top-8 left-8">
        <PlayerInfo 
          playerId={playerId}
          serverName={serverName}
          playerCount={playerCount}
        />
      </div>

      {/* Voice Indicator - Bottom Left */}
      <div className="fixed bottom-8 left-8">
        <VoiceIndicator range={voiceRange} talking={isTalking} />
      </div>

      {/* Speedometer - Bottom Center */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <Speedometer 
          visible={inVehicle}
          speed={speed}
          fuel={fuel}
          gear={gear}
        />
      </div>

      {/* Compass - Top Center */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2">
        <Compass heading={heading} streetName={streetName} />
      </div>
    </div>
  )
}
