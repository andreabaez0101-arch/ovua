"use client"

import { useState, useEffect } from "react"
import { Crown } from "lucide-react"

interface RadioMember {
  id: number
  name: string
  talking: boolean
  isSelf: boolean
  isLeader: boolean
  color: string
}

const leaderIcons = {
  crown: Crown,
  star: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
}

interface RadioUsersListProps {
  members?: RadioMember[]
  isVisible?: boolean
}

export function RadioUsersList({ members: externalMembers, isVisible = true }: RadioUsersListProps) {
  const [members, setMembers] = useState<RadioMember[]>(
    externalMembers || [
      { id: 1, name: "John Doe", talking: false, isSelf: false, isLeader: true, color: "#FFD700" },
      { id: 2, name: "Maria Johnson", talking: false, isSelf: false, isLeader: false, color: "#FFFFFF" },
      { id: 3, name: "Carlos Martinez", talking: false, isSelf: false, isLeader: false, color: "#FFFFFF" },
      { id: 4, name: "Ana Rodriguez", talking: false, isSelf: false, isLeader: false, color: "#FFFFFF" },
      { id: 5, name: "Pedro Sanchez", talking: false, isSelf: false, isLeader: true, color: "#FF4444" },
      { id: 6, name: "Luis Garcia", talking: false, isSelf: false, isLeader: false, color: "#FFFFFF" },
      { id: 7, name: "Sofia Lopez", talking: false, isSelf: false, isLeader: false, color: "#FFFFFF" },
      { id: 8, name: "Tu Nombre", talking: false, isSelf: true, isLeader: false, color: "#FFFFFF" },
    ]
  )

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

  // Update members if external members change
  useEffect(() => {
    if (externalMembers) {
      setMembers(externalMembers)
    }
  }, [externalMembers])

  if (!isVisible) return null

  return (
    <div 
      className="fixed right-4 z-40 pointer-events-none"
      style={{ 
        top: "35%",
      }}
    >
      <div className="flex flex-col gap-0.5 items-end">
        {members.map((member) => {
          const MemberLeaderIcon = member.isLeader ? leaderIcons.crown : null
          return (
            <div
              key={member.id}
              className="flex items-center gap-1.5 transition-all duration-200"
            >
              {/* Leader icon */}
              {member.isLeader && MemberLeaderIcon && (
                <MemberLeaderIcon 
                  className="w-3 h-3"
                  style={{ 
                    color: member.color,
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.9))"
                  }}
                />
              )}
              {/* Name with text shadow for readability */}
              <span
                className="text-[12px] font-medium transition-colors duration-200"
                style={{ 
                  color: member.isLeader ? member.color : "rgba(255,255,255,0.85)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6), 1px 1px 2px rgba(0,0,0,0.8)"
                }}
              >
                {member.name}
              </span>
              {/* Audio indicator */}
              {member.talking && (
                <div className="flex gap-[2px] items-end h-3 ml-1">
                  <span 
                    className="w-[3px] h-1.5 bg-emerald-400 rounded-sm animate-[pulse_0.4s_ease-in-out_infinite]"
                    style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.8))" }}
                  />
                  <span 
                    className="w-[3px] h-3 bg-emerald-400 rounded-sm animate-[pulse_0.4s_ease-in-out_infinite_0.1s]"
                    style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.8))" }}
                  />
                  <span 
                    className="w-[3px] h-2 bg-emerald-400 rounded-sm animate-[pulse_0.4s_ease-in-out_infinite_0.2s]"
                    style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.8))" }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
