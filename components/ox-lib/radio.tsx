"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Volume2, Mic, Users, Power, VolumeX } from "lucide-react"

interface RadioMember {
  id: number
  name: string
  talking: boolean
  isSelf: boolean
}

interface OxLibRadioProps {
  onClose: () => void
}

const channelNames: Record<number, string> = {
  1: "Canal Principal",
  2: "Policia",
  3: "EMS",
  4: "Mecanicos",
  5: "Taxi",
  6: "Privado",
}

export function OxLibRadio({ onClose }: OxLibRadioProps) {
  const [currentChannel, setCurrentChannel] = useState(1)
  const [volume, setVolume] = useState(75)
  const [isTalking, setIsTalking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [channelInput, setChannelInput] = useState("")
  const [members, setMembers] = useState<RadioMember[]>([
    { id: 1, name: "John Doe", talking: false, isSelf: false },
    { id: 2, name: "Maria Johnson", talking: false, isSelf: false },
    { id: 15, name: "Tu", talking: false, isSelf: true },
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
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
  }, [onClose, startTalk, endTalk, changeChannel])

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end pr-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Radio Panel */}
      <div
        className="relative w-[280px] bg-[rgba(22,22,26,0.95)] border border-white/[0.08] rounded-2xl overflow-hidden animate-in slide-in-from-right-4 duration-300"
        style={{
          boxShadow: "0 25px 60px -12px rgba(0,0,0,0.6), 0 0 40px -10px rgba(255,255,255,0.05)",
        }}
      >
        {/* Glass reflection */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none rounded-t-2xl" />

        {/* Header */}
        <div className="relative flex items-center gap-3 px-4 py-4 border-b border-white/[0.08]">
          <div className="w-8 h-8 flex items-center justify-center bg-white/[0.08] rounded-lg">
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6V2m0 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              <path d="M6.34 6.34l-2.83-2.83m17 0l-2.83 2.83M4 12H2m20 0h-2" />
              <path d="M12 14v8" />
              <path d="M8 18h8" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-white/40 mb-0.5">
              COMUNICACIONES
            </span>
            <h2 className="text-base font-semibold text-white/95">Radio</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channel Display */}
        <div className="relative px-4 py-4 text-center bg-[rgba(30,30,36,0.95)] border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 rounded-full mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wide">Conectado</span>
          </div>
          <div className="text-[2rem] font-bold text-white/95 tracking-wider tabular-nums">{channelStr}</div>
          <div className="text-xs text-white/40 mt-1">{channelName}</div>
        </div>

        {/* Channel Controls */}
        <div className="flex items-center justify-center gap-3 px-4 py-3 border-b border-white/[0.08]">
          <button
            onClick={() => changeChannel(-1)}
            className="w-9 h-9 flex items-center justify-center bg-white/[0.06] border border-white/[0.08] rounded-xl text-white/60 hover:bg-white/[0.1] hover:text-white/90 transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative">
            <input
              type="text"
              value={channelInput}
              onChange={(e) => setChannelInput(e.target.value.replace(/\D/g, "").slice(0, 3))}
              onKeyPress={handleChannelInputKeyPress}
              placeholder="001"
              maxLength={3}
              className="w-20 px-3 py-2 bg-black/30 border border-white/[0.08] rounded-lg text-center text-base font-semibold text-white/90 tracking-widest placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
            />
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-white/20 whitespace-nowrap">
              Ingresa canal
            </span>
          </div>

          <button
            onClick={() => changeChannel(1)}
            className="w-9 h-9 flex items-center justify-center bg-white/[0.06] border border-white/[0.08] rounded-xl text-white/60 hover:bg-white/[0.1] hover:text-white/90 transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="px-4 py-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 mb-2.5 text-xs text-white/60">
            <Volume2 className="w-3.5 h-3.5 text-white/40" />
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

        {/* Quick Channels */}
        <div className="px-4 py-3 border-b border-white/[0.08]">
          <span className="block text-[10px] font-medium uppercase tracking-wide text-white/40 mb-2">
            Canales Rapidos
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((channel) => (
              <button
                key={channel}
                onClick={() => setCurrentChannel(channel)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
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

        {/* Talk Button */}
        <div className="px-4 py-3.5 border-b border-white/[0.08]">
          <button
            onMouseDown={startTalk}
            onMouseUp={endTalk}
            onMouseLeave={endTalk}
            onTouchStart={startTalk}
            onTouchEnd={endTalk}
            className={`relative w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border transition-all overflow-hidden ${
              isTalking
                ? "bg-gradient-to-br from-white/25 to-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-gradient-to-br from-white/[0.1] to-white/[0.05] border-white/15 hover:from-white/[0.15] hover:to-white/[0.08] hover:border-white/25"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
            <div className={`relative ${isTalking ? "animate-pulse" : ""}`}>
              <Mic className="w-5 h-5 text-white/80" />
            </div>
            <span className="relative text-sm font-medium text-white/90">Mantener para Hablar</span>
            <span className="relative text-[10px] font-semibold text-white/40 px-1.5 py-0.5 bg-white/[0.06] rounded">
              [N]
            </span>
          </button>
        </div>

        {/* Members Section */}
        <div className="px-4 py-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 mb-2.5 text-xs text-white/60">
            <Users className="w-3.5 h-3.5 text-white/40" />
            <span>En este canal</span>
            <span className="ml-auto px-2 py-0.5 bg-white/[0.08] rounded-full text-[10px] font-semibold text-white/70">
              {members.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            {members.map((member) => (
              <div
                key={member.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${
                  member.isSelf ? "bg-white/[0.08]" : "bg-white/[0.02] hover:bg-white/[0.04]"
                } transition-colors`}
              >
                <div className="w-6 h-6 flex items-center justify-center bg-white/[0.08] rounded text-[9px] font-semibold text-white/40">
                  {getInitials(member.name)}
                </div>
                <span className="flex-1 text-[11px] text-white/60 truncate">
                  {member.name}
                  {member.isSelf && ` (ID: ${member.id})`}
                </span>
                <span className={`text-[9px] ${member.talking ? "text-emerald-500 font-medium" : "text-white/25"}`}>
                  {member.talking ? "Hablando" : "En linea"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 px-4 py-3 bg-black/20">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-[11px] font-medium transition-all ${
              isMuted
                ? "bg-red-500/15 border-red-500/30 text-red-400"
                : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white/90"
            }`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMuted ? "Silenciado" : "Silenciar"}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[11px] font-medium text-white/60 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 transition-all"
          >
            <Power className="w-3.5 h-3.5" />
            <span>Desconectar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
