"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Volume2, Mic, Power, VolumeX, Settings, Crown, User, Palette } from "lucide-react"

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

export function OxLibRadio({ onClose }: OxLibRadioProps) {
  const [currentChannel, setCurrentChannel] = useState(1)
  const [volume, setVolume] = useState(75)
  const [isTalking, setIsTalking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [channelInput, setChannelInput] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [config, setConfig] = useState<RadioConfig>({
    displayName: "Tu Nombre",
    isLeader: false,
    leaderColor: "#FFD700",
    leaderIcon: "crown",
  })
  const [members, setMembers] = useState<RadioMember[]>([
    { id: 1, name: "John Doe", talking: false, isSelf: false, isLeader: true, color: "#FFD700" },
    { id: 2, name: "Maria Johnson", talking: false, isSelf: false, isLeader: false, color: "#00D4FF" },
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
        if (showSettings) {
          setShowSettings(false)
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
  }, [onClose, startTalk, endTalk, changeChannel, showSettings])

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

  return (
    <>
      {/* Users Widget - Bottom Left Corner */}
      <div className="fixed bottom-4 left-4 z-40 w-48">
        <div
          className="bg-[rgba(18,18,22,0.9)] border border-white/[0.08] rounded-xl overflow-hidden"
          style={{
            boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
          }}
        >
          <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-white/50 uppercase tracking-wide">Canal {channelStr}</span>
          </div>
          <div className="p-2 flex flex-col gap-1 max-h-32 overflow-y-auto">
            {members.map((member) => {
              const MemberLeaderIcon = member.isLeader ? leaderIcons.crown : null
              return (
                <div
                  key={member.id}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                    member.talking
                      ? "bg-white/[0.1] ring-1 ring-emerald-500/50"
                      : "bg-white/[0.03]"
                  }`}
                >
                  <div
                    className="w-5 h-5 flex items-center justify-center rounded text-[8px] font-bold"
                    style={{
                      backgroundColor: member.isLeader ? `${member.color}20` : "rgba(255,255,255,0.08)",
                      color: member.isLeader ? member.color : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {member.isLeader && MemberLeaderIcon ? (
                      <MemberLeaderIcon className="w-3 h-3" />
                    ) : (
                      getInitials(member.name)
                    )}
                  </div>
                  <span
                    className="flex-1 text-[10px] truncate"
                    style={{ color: member.isLeader ? member.color : "rgba(255,255,255,0.6)" }}
                  >
                    {member.name}
                  </span>
                  {member.talking && (
                    <div className="flex gap-0.5">
                      <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="w-0.5 h-3 bg-emerald-500 rounded-full animate-pulse delay-75" />
                      <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-pulse delay-150" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Radio Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-end pr-8">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        {/* Radio Panel - Compact */}
        <div
          className="relative w-[260px] bg-[rgba(22,22,26,0.95)] border border-white/[0.08] rounded-2xl overflow-hidden animate-in slide-in-from-right-4 duration-300"
          style={{
            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.6), 0 0 40px -10px rgba(255,255,255,0.05)",
          }}
        >
          {/* Glass reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none rounded-t-2xl" />

          {showSettings ? (
            /* Settings View */
            <>
              <div className="relative flex items-center gap-3 px-4 py-3 border-b border-white/[0.08]">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-semibold text-white/95">Configuracion</h2>
              </div>

              <div className="p-4 space-y-4">
                {/* Display Name */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wide text-white/40 mb-2">
                    <User className="w-3 h-3" />
                    Nombre Visible
                  </label>
                  <input
                    type="text"
                    value={config.displayName}
                    onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
                    className="w-full px-3 py-2 bg-black/30 border border-white/[0.08] rounded-lg text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Leader Toggle */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wide text-white/40 mb-2">
                    <Crown className="w-3 h-3" />
                    Modo Lider
                  </label>
                  <button
                    onClick={() => setConfig({ ...config, isLeader: !config.isLeader })}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                      config.isLeader
                        ? "bg-white/[0.1] border-white/20"
                        : "bg-black/30 border-white/[0.08] hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="text-sm text-white/70">Soy lider del canal</span>
                    <div
                      className={`w-10 h-5 rounded-full transition-all ${
                        config.isLeader ? "bg-emerald-500" : "bg-white/10"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 mt-0.5 rounded-full bg-white shadow transition-all ${
                          config.isLeader ? "ml-5" : "ml-0.5"
                        }`}
                      />
                    </div>
                  </button>
                </div>

                {/* Leader Color */}
                {config.isLeader && (
                  <>
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wide text-white/40 mb-2">
                        <Palette className="w-3 h-3" />
                        Color de Lider
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {leaderColors.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setConfig({ ...config, leaderColor: c.color })}
                            className={`w-8 h-8 rounded-lg transition-all ${
                              config.leaderColor === c.color
                                ? "ring-2 ring-white/50 scale-110"
                                : "hover:scale-105"
                            }`}
                            style={{ backgroundColor: c.color }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Leader Icon */}
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wide text-white/40 mb-2">
                        Icono de Lider
                      </label>
                      <div className="flex gap-2">
                        {(Object.keys(leaderIcons) as Array<keyof typeof leaderIcons>).map((iconKey) => {
                          const Icon = leaderIcons[iconKey]
                          return (
                            <button
                              key={iconKey}
                              onClick={() => setConfig({ ...config, leaderIcon: iconKey })}
                              className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
                                config.leaderIcon === iconKey
                                  ? "bg-white/[0.1] border-white/30"
                                  : "bg-black/30 border-white/[0.08] hover:bg-white/[0.05]"
                              }`}
                            >
                              <Icon className="w-5 h-5" style={{ color: config.leaderColor }} />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            /* Main Radio View */
            <>
              {/* Header */}
              <div className="relative flex items-center gap-2 px-3 py-3 border-b border-white/[0.08]">
                <div className="w-7 h-7 flex items-center justify-center bg-white/[0.08] rounded-lg">
                  <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 6V2m0 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                    <path d="M6.34 6.34l-2.83-2.83m17 0l-2.83 2.83M4 12H2m20 0h-2" />
                    <path d="M12 14v8M8 18h8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-white/95">Radio</h2>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Channel Display - Compact */}
              <div className="relative px-3 py-3 text-center bg-[rgba(30,30,36,0.95)] border-b border-white/[0.08]">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-medium text-emerald-500 uppercase">Conectado</span>
                </div>
                <div className="text-2xl font-bold text-white/95 tracking-wider tabular-nums mt-1">{channelStr}</div>
                <div className="text-[10px] text-white/40">{channelName}</div>
              </div>

              {/* Channel Controls - Compact */}
              <div className="flex items-center justify-center gap-2 px-3 py-2.5 border-b border-white/[0.08]">
                <button
                  onClick={() => changeChannel(-1)}
                  className="w-8 h-8 flex items-center justify-center bg-white/[0.06] border border-white/[0.08] rounded-lg text-white/60 hover:bg-white/[0.1] hover:text-white/90 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  onKeyPress={handleChannelInputKeyPress}
                  placeholder="001"
                  maxLength={3}
                  className="w-16 px-2 py-1.5 bg-black/30 border border-white/[0.08] rounded-lg text-center text-sm font-semibold text-white/90 tracking-widest placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                />

                <button
                  onClick={() => changeChannel(1)}
                  className="w-8 h-8 flex items-center justify-center bg-white/[0.06] border border-white/[0.08] rounded-lg text-white/60 hover:bg-white/[0.1] hover:text-white/90 transition-all active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Control - Compact */}
              <div className="px-3 py-2.5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 mb-2 text-[10px] text-white/60">
                  <Volume2 className="w-3 h-3 text-white/40" />
                  <span>Volumen</span>
                  <span className="ml-auto font-semibold text-white/90 tabular-nums">{volume}%</span>
                </div>
                <div className="relative h-1.5">
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
                      className="h-full bg-gradient-to-r from-white/10 to-white/70 rounded-full"
                      style={{ width: `${volume}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Channels - Compact */}
              <div className="px-3 py-2.5 border-b border-white/[0.08]">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((channel) => (
                    <button
                      key={channel}
                      onClick={() => setCurrentChannel(channel)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                        currentChannel === channel
                          ? "bg-white/[0.1] border border-white/20 text-white/90"
                          : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/80"
                      }`}
                    >
                      {String(channel).padStart(3, "0")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Talk Button - Compact */}
              <div className="px-3 py-2.5 border-b border-white/[0.08]">
                <button
                  onMouseDown={startTalk}
                  onMouseUp={endTalk}
                  onMouseLeave={endTalk}
                  onTouchStart={startTalk}
                  onTouchEnd={endTalk}
                  className={`relative w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl border transition-all overflow-hidden ${
                    isTalking
                      ? "bg-gradient-to-br from-white/25 to-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "bg-gradient-to-br from-white/[0.1] to-white/[0.05] border-white/15 hover:from-white/[0.15] hover:to-white/[0.08] hover:border-white/25"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
                  <div className={`relative ${isTalking ? "animate-pulse" : ""}`}>
                    <Mic className="w-4 h-4 text-white/80" />
                  </div>
                  <span className="relative text-xs font-medium text-white/90">Hablar</span>
                  <span className="relative text-[9px] font-semibold text-white/40 px-1.5 py-0.5 bg-white/[0.06] rounded">
                    N
                  </span>
                </button>
              </div>

              {/* Footer Actions - Compact */}
              <div className="flex gap-2 px-3 py-2.5 bg-black/20">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-[10px] font-medium transition-all ${
                    isMuted
                      ? "bg-red-500/15 border-red-500/30 text-red-400"
                      : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white/90"
                  }`}
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  <span>{isMuted ? "Silenciado" : "Silenciar"}</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[10px] font-medium text-white/60 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 transition-all"
                >
                  <Power className="w-3 h-3" />
                  <span>Desconectar</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
