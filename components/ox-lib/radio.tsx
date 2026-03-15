"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Volume2, Mic, Power, VolumeX, Settings, Crown, User, Palette, Users } from "lucide-react"

interface RadioMember {
  id: number
  name: string
  talking: boolean
  isSelf: boolean
  isLeader: boolean
  color: string
}

interface RadioConfig {
  displayName: string
  isLeader: boolean
  leaderColor: string
  leaderIcon: "crown" | "star" | "shield" | "diamond"
}

interface OxLibRadioProps {
  onClose: () => void
}

const channelNames: Record<number, string> = {
  1: "Canal Principal",
  2: "Policia",
  3: "EMS",
  4: "Mecanicos",
}

const leaderIcons = {
  crown: Crown,
  star: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  shield: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  diamond: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 12l10 10 10-10L12 2z" />
    </svg>
  ),
}

const leaderColors = [
  { id: "gold", color: "#FFD700", name: "Oro" },
  { id: "cyan", color: "#00D4FF", name: "Cyan" },
  { id: "red", color: "#FF4444", name: "Rojo" },
  { id: "green", color: "#44FF44", name: "Verde" },
  { id: "purple", color: "#AA44FF", name: "Morado" },
  { id: "orange", color: "#FF8844", name: "Naranja" },
]

// Custom scrollbar styles
const customScrollbarClass = `
  [&::-webkit-scrollbar]:w-1.5
  [&::-webkit-scrollbar-track]:bg-white/[0.02]
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-white/[0.15]
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:hover:bg-white/[0.25]
  [&::-webkit-scrollbar-thumb]:transition-colors
`

export function OxLibRadio({ onClose }: OxLibRadioProps) {
  const [currentChannel, setCurrentChannel] = useState(1)
  const [volume, setVolume] = useState(75)
  const [isTalking, setIsTalking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [channelInput, setChannelInput] = useState("")
  const [activePanel, setActivePanel] = useState<'main' | 'settings' | 'members'>('main')
  const [config, setConfig] = useState<RadioConfig>({
    displayName: "Tu Nombre",
    isLeader: false,
    leaderColor: "#FFD700",
    leaderIcon: "crown",
  })
  const [members, setMembers] = useState<RadioMember[]>([
    { id: 1, name: "John Doe", talking: false, isSelf: false, isLeader: true, color: "#FFD700" },
    { id: 2, name: "Maria Johnson", talking: false, isSelf: false, isLeader: false, color: "#00D4FF" },
    { id: 3, name: "Carlos Martinez", talking: false, isSelf: false, isLeader: false, color: "#FFFFFF" },
    { id: 4, name: "Ana Rodriguez", talking: false, isSelf: false, isLeader: false, color: "#FFFFFF" },
    { id: 5, name: "Pedro Sanchez", talking: false, isSelf: false, isLeader: true, color: "#FF4444" },
    { id: 6, name: "Luis Garcia", talking: false, isSelf: false, isLeader: false, color: "#FFFFFF" },
    { id: 7, name: "Sofia Lopez", talking: false, isSelf: false, isLeader: false, color: "#FFFFFF" },
    { id: 15, name: "Tu Nombre", talking: false, isSelf: true, isLeader: false, color: "#FFFFFF" },
  ])

  const changeChannel = useCallback((direction: number) => {
    setCurrentChannel((prev) => {
      let newChannel = prev + direction
      if (newChannel < 1) newChannel = 999
      if (newChannel > 999) newChannel = 1
      return newChannel
    })
  }, [])

  const handleChannelInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = parseInt(channelInput)
      if (value >= 1 && value <= 999) {
        setCurrentChannel(value)
        setChannelInput("")
      }
    }
  }

  const startTalk = useCallback(() => {
    if (!isMuted) {
      setIsTalking(true)
    }
  }, [isMuted])

  const endTalk = useCallback(() => {
    setIsTalking(false)
  }, [])

  // Update self member when config changes
  useEffect(() => {
    setMembers((prev) =>
      prev.map((m) =>
        m.isSelf
          ? { ...m, name: config.displayName, isLeader: config.isLeader, color: config.leaderColor }
          : m
      )
    )
  }, [config])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activePanel !== 'main') {
          setActivePanel('main')
        } else {
          onClose()
        }
      }
      if (e.key === "n" || e.key === "N") {
        startTalk()
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        changeChannel(1)
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        changeChannel(-1)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "n" || e.key === "N") {
        endTalk()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [onClose, startTalk, endTalk, changeChannel, activePanel])

  // Simulate random member talking
  useEffect(() => {
    const interval = setInterval(() => {
      setMembers((prev) =>
        prev.map((m) => ({
          ...m,
          talking: !m.isSelf && Math.random() > 0.85,
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const channelStr = String(currentChannel).padStart(3, "0")
  const channelName = channelNames[currentChannel] || `Canal ${currentChannel}`

  const LeaderIcon = leaderIcons[config.leaderIcon]

  const getPanelTransform = () => {
    switch (activePanel) {
      case 'main': return 'translateX(0)'
      case 'settings': return 'translateX(-300px)'
      case 'members': return 'translateX(-600px)'
    }
  }

  return (
    <>
      {/* Main Radio Panel */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-end pr-8 pointer-events-none"
        onDragStart={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Invisible click area to close */}
        <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />

        {/* Radio Panel - Fixed Size */}
        <div
          className="relative w-[300px] h-[500px] bg-[rgba(22,22,26,0.98)] border border-white/[0.08] rounded-2xl overflow-hidden animate-in slide-in-from-right-4 duration-300 pointer-events-auto select-none"
          style={{
            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.6), 0 0 40px -10px rgba(255,255,255,0.05)",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        >
          {/* Glass reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none rounded-t-2xl z-20" />

          {/* Content Container with Slide Animation */}
          <div 
            className="relative w-[900px] h-full flex transition-transform duration-300 ease-out will-change-transform" 
            style={{ transform: getPanelTransform() }}
          >
            
            {/* Main Radio View - First Panel */}
            <div className="w-[300px] h-[500px] flex-shrink-0 flex flex-col">
              {/* Header */}
              <div className="relative z-10 flex items-center gap-2 px-4 py-3.5 border-b border-white/[0.08]">
                <div className="w-8 h-8 flex items-center justify-center bg-white/[0.08] rounded-lg">
                  <svg className="w-4.5 h-4.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 6V2m0 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                    <path d="M6.34 6.34l-2.83-2.83m17 0l-2.83 2.83M4 12H2m20 0h-2" />
                    <path d="M12 14v8M8 18h8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-white/95">dopa - radio script</h2>
                </div>
                <button
                  onClick={() => setActivePanel('members')}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all active:scale-95"
                >
                  <Users className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePanel('settings')}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all active:scale-95"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Channel Display */}
              <div className="relative px-4 py-4 text-center bg-[rgba(30,30,36,0.95)] border-b border-white/[0.08]">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-medium text-emerald-500 uppercase tracking-wider">Conectado</span>
                </div>
                <div className="text-3xl font-bold text-white/95 tracking-wider tabular-nums mt-1.5">{channelStr}</div>
                <div className="text-xs text-white/40 mt-0.5">{channelName}</div>
              </div>

              {/* Channel Controls */}
              <div className="flex items-center justify-center gap-3 px-4 py-3 border-b border-white/[0.08]">
                <button
                  onClick={() => changeChannel(-1)}
                  className="w-10 h-10 flex items-center justify-center bg-white/[0.06] border border-white/[0.08] rounded-xl text-white/60 hover:bg-white/[0.1] hover:text-white/90 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  onKeyPress={handleChannelInputKeyPress}
                  placeholder="001"
                  maxLength={3}
                  className="w-20 px-3 py-2 bg-black/30 border border-white/[0.08] rounded-xl text-center text-sm font-semibold text-white/90 tracking-widest placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                />

                <button
                  onClick={() => changeChannel(1)}
                  className="w-10 h-10 flex items-center justify-center bg-white/[0.06] border border-white/[0.08] rounded-xl text-white/60 hover:bg-white/[0.1] hover:text-white/90 transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="px-4 py-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 mb-2.5 text-xs text-white/60">
                  <Volume2 className="w-3.5 h-3.5 text-white/40" />
                  <span>Volumen</span>
                  <span className="ml-auto font-semibold text-white/90 tabular-nums">{volume}%</span>
                </div>
                <div className="relative h-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    onInput={(e) => setVolume(Number((e.target as HTMLInputElement).value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute inset-0 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-white/20 to-white/70 rounded-full"
                      style={{ width: `${volume}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Channels */}
              <div className="px-4 py-3 border-b border-white/[0.08]">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((channel) => (
                    <button
                      key={channel}
                      onClick={() => setCurrentChannel(channel)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                        currentChannel === channel
                          ? "bg-white/[0.12] border border-white/25 text-white/95 shadow-lg"
                          : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/80"
                      }`}
                    >
                      {String(channel).padStart(3, "0")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Talk Button */}
              <div className="px-4 py-3 border-b border-white/[0.08]">
                <button
                  onMouseDown={startTalk}
                  onMouseUp={endTalk}
                  onMouseLeave={endTalk}
                  onTouchStart={startTalk}
                  onTouchEnd={endTalk}
                  className={`relative w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl border transition-all duration-200 overflow-hidden ${
                    isTalking
                      ? "bg-gradient-to-br from-white/30 to-white/15 border-white/60 shadow-[0_0_25px_rgba(255,255,255,0.25)]"
                      : "bg-gradient-to-br from-white/[0.1] to-white/[0.05] border-white/15 hover:from-white/[0.15] hover:to-white/[0.08] hover:border-white/25"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
                  <div className={`relative ${isTalking ? "animate-pulse" : ""}`}>
                    <Mic className="w-5 h-5 text-white/90" />
                  </div>
                  <span className="relative text-sm font-medium text-white/95">Hablar</span>
                  <span className="relative text-[10px] font-semibold text-white/40 px-2 py-1 bg-white/[0.06] rounded-lg">
                    N
                  </span>
                </button>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-2 px-4 py-3 bg-black/20 mt-auto">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                    isMuted
                      ? "bg-red-500/15 border-red-500/30 text-red-400"
                      : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white/90"
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isMuted ? "Silenciado" : "Silenciar"}</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs font-medium text-white/60 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 transition-all duration-200"
                >
                  <Power className="w-4 h-4" />
                  <span>Desconectar</span>
                </button>
              </div>
            </div>

            {/* Settings View - Second Panel */}
            <div className="w-[300px] h-[500px] flex-shrink-0 flex flex-col">
              <div className="relative z-10 flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
                <button
                  onClick={() => setActivePanel('main')}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-sm font-semibold text-white/95">Configuracion</h2>
              </div>

              <div className={`flex-1 overflow-y-auto p-4 space-y-5 ${customScrollbarClass}`}>
                {/* Display Name */}
                <div className="animate-in fade-in slide-in-from-right-3 duration-300" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
                  <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/40 mb-2.5">
                    <User className="w-3.5 h-3.5" />
                    Nombre Visible
                  </label>
                  <input
                    type="text"
                    value={config.displayName}
                    onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black/30 border border-white/[0.08] rounded-xl text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Leader Toggle */}
                <div className="animate-in fade-in slide-in-from-right-3 duration-300" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                  <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/40 mb-2.5">
                    <Crown className="w-3.5 h-3.5" />
                    Modo Lider
                  </label>
                  <button
                    onClick={() => setConfig({ ...config, isLeader: !config.isLeader })}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                      config.isLeader
                        ? "bg-white/[0.1] border-white/20"
                        : "bg-black/30 border-white/[0.08] hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="text-sm text-white/70">Soy lider del canal</span>
                    <div
                      className={`w-11 h-6 rounded-full transition-all duration-200 ${
                        config.isLeader ? "bg-emerald-500" : "bg-white/10"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 mt-0.5 rounded-full bg-white shadow-lg transition-all duration-200 ${
                          config.isLeader ? "ml-5.5 translate-x-0.5" : "ml-0.5"
                        }`}
                      />
                    </div>
                  </button>
                </div>

                {/* Leader Options */}
                <div 
                  className={`space-y-5 transition-all duration-300 overflow-hidden ${
                    config.isLeader ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {/* Leader Color */}
                  <div className="animate-in fade-in slide-in-from-right-3 duration-300" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
                    <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/40 mb-2.5">
                      <Palette className="w-3.5 h-3.5" />
                      Color de Lider
                    </label>
                    <div className="flex gap-2.5 flex-wrap">
                      {leaderColors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setConfig({ ...config, leaderColor: c.color })}
                          className={`w-10 h-10 rounded-xl transition-all duration-200 ${
                            config.leaderColor === c.color
                              ? "ring-2 ring-white/50 scale-110 shadow-lg"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.color }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Leader Icon */}
                  <div className="animate-in fade-in slide-in-from-right-3 duration-300" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                    <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/40 mb-2.5">
                      Icono de Lider
                    </label>
                    <div className="flex gap-2.5">
                      {(Object.keys(leaderIcons) as Array<keyof typeof leaderIcons>).map((iconKey) => {
                        const Icon = leaderIcons[iconKey]
                        return (
                          <button
                            key={iconKey}
                            onClick={() => setConfig({ ...config, leaderIcon: iconKey })}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                              config.leaderIcon === iconKey
                                ? "bg-white/[0.12] border-white/30 scale-105 shadow-lg"
                                : "bg-black/30 border-white/[0.08] hover:bg-white/[0.05] hover:scale-105"
                            }`}
                          >
                            <Icon className="w-6 h-6 transition-colors duration-200" style={{ color: config.leaderColor }} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="animate-in fade-in slide-in-from-right-3 duration-300 pt-2" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
                  <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/40 mb-2.5">
                    Vista Previa
                  </label>
                  <div className="p-4 bg-black/30 border border-white/[0.08] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200"
                        style={{
                          backgroundColor: config.isLeader ? `${config.leaderColor}20` : "rgba(255,255,255,0.08)",
                          color: config.isLeader ? config.leaderColor : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {config.isLeader ? (
                          <LeaderIcon className="w-5 h-5" />
                        ) : (
                          getInitials(config.displayName)
                        )}
                      </div>
                      <span
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: config.isLeader ? config.leaderColor : "rgba(255,255,255,0.7)" }}
                      >
                        {config.displayName || "Tu Nombre"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Members View - Third Panel */}
            <div className="w-[300px] h-[500px] flex-shrink-0 flex flex-col">
              <div className="relative z-10 flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
                <button
                  onClick={() => setActivePanel('main')}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-sm font-semibold text-white/95">Usuarios en Canal</h2>
                <span className="ml-auto text-xs text-white/40 bg-white/[0.06] px-2 py-1 rounded-lg">{members.length}</span>
              </div>

              <div className={`flex-1 overflow-y-auto p-3 space-y-2 ${customScrollbarClass}`}>
                {members.map((member, index) => {
                  const MemberLeaderIcon = member.isLeader ? leaderIcons.crown : null
                  return (
                    <div
                      key={member.id}
                      className="animate-in fade-in slide-in-from-right-3 duration-300"
                      style={{ animationDelay: `${50 + index * 30}ms`, animationFillMode: 'both' }}
                    >
                      <div
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          member.talking
                            ? "bg-white/[0.12] ring-1 ring-emerald-500/50 shadow-lg"
                            : "bg-white/[0.04] hover:bg-white/[0.06]"
                        }`}
                      >
                        <div
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200"
                          style={{
                            backgroundColor: member.isLeader ? `${member.color}20` : "rgba(255,255,255,0.08)",
                            color: member.isLeader ? member.color : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {member.isLeader && MemberLeaderIcon ? (
                            <MemberLeaderIcon className="w-4 h-4" />
                          ) : (
                            getInitials(member.name)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className="block text-sm truncate transition-colors duration-200"
                            style={{ color: member.isLeader ? member.color : "rgba(255,255,255,0.8)" }}
                          >
                            {member.name}
                          </span>
                          {member.isSelf && (
                            <span className="text-[10px] text-white/30">Tu</span>
                          )}
                          {member.isLeader && !member.isSelf && (
                            <span className="text-[10px]" style={{ color: `${member.color}80` }}>Lider</span>
                          )}
                        </div>
                        {member.talking && (
                          <div className="flex gap-0.5 items-end h-4">
                            <span className="w-1 h-2 bg-emerald-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" />
                            <span className="w-1 h-4 bg-emerald-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s]" />
                            <span className="w-1 h-3 bg-emerald-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.2s]" />
                            <span className="w-1 h-2 bg-emerald-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.3s]" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
