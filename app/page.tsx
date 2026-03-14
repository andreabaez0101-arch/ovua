"use client"

import { useState } from "react"
import { OxLibNotifications } from "@/components/ox-lib/notifications"
import { OxLibContextMenu } from "@/components/ox-lib/context-menu"
import { OxLibInputDialog } from "@/components/ox-lib/input-dialog"
import { OxLibProgressBar } from "@/components/ox-lib/progress-bar"

import { OxLibSkillCheck } from "@/components/ox-lib/skill-check"
import { OxLibTextUI } from "@/components/ox-lib/text-ui"
import { OxLibAlertDialog } from "@/components/ox-lib/alert-dialog"
import { OxLibMenu } from "@/components/ox-lib/menu"
import { OxLibRadio } from "@/components/ox-lib/radio"

const iconSvgs = {
  notifications: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  context: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  input: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  progress: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  skillcheck: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
  textui: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  alert: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  menu: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  radio: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V2m0 4a4 4 0 100 8 4 4 0 000-8zM6.34 6.34l-2.83-2.83m17 0l-2.83 2.83M4 12H2m20 0h-2M12 14v8M8 18h8" /></svg>,
}

export default function OxLibPreview() {
  const [showNotification, setShowNotification] = useState(false)
  const [showContext, setShowContext] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  const [showSkillCheck, setShowSkillCheck] = useState(false)
  const [showTextUI, setShowTextUI] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showRadio, setShowRadio] = useState(false)

  const buttons = [
    { id: "notifications", label: "Notifications", icon: iconSvgs.notifications, action: () => setShowNotification(true) },
    { id: "context", label: "Context Menu", icon: iconSvgs.context, action: () => setShowContext(true) },
    { id: "input", label: "Input Dialog", icon: iconSvgs.input, action: () => setShowInput(true) },
    { id: "progress", label: "Progress Bar", icon: iconSvgs.progress, action: () => setShowProgress(true) },
    { id: "skillcheck", label: "Skill Check", icon: iconSvgs.skillcheck, action: () => setShowSkillCheck(true) },
    { id: "textui", label: "Text UI", icon: iconSvgs.textui, action: () => setShowTextUI(true) },
    { id: "alert", label: "Alert Dialog", icon: iconSvgs.alert, action: () => setShowAlert(true) },
    { id: "menu", label: "Menu List", icon: iconSvgs.menu, action: () => setShowMenu(true) },
    { id: "radio", label: "Radio UI", icon: iconSvgs.radio, action: () => setShowRadio(true) },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0c] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/[0.02] to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-white/[0.015] to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-lg">
              <span className="text-white/90 font-bold text-lg">X</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white/90 tracking-tight">ox_lib</h1>
              <p className="text-xs text-white/40">Liquid Glass UI - iOS 26 Style</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="/ox_lib_ui/index.html" 
              target="_blank"
              className="px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.1] text-xs text-white/70 hover:bg-white/[0.12] hover:text-white/90 transition-all"
            >
              Open HTML Version
            </a>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06]">
              <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
              <span className="text-xs text-white/50">Preview Mode</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white/95 mb-4 tracking-tight">
            Complete UI Redesign
          </h2>
          <p className="text-white/40 max-w-xl mx-auto leading-relaxed">
            All ox_lib interfaces redesigned with liquid glass aesthetics, smooth animations, 
            and the silver-black color scheme matching your inventory system.
          </p>
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {buttons.map((btn, index) => (
            <button
              key={btn.id}
              onClick={btn.action}
              className="group relative overflow-hidden rounded-2xl p-6 
                bg-gradient-to-br from-white/[0.06] to-white/[0.02]
                border border-white/[0.08] hover:border-white/[0.15]
                backdrop-blur-xl shadow-lg
                transition-all duration-500 ease-out
                hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/[0.03]
                active:scale-[0.98]"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.04] to-transparent" />
              </div>
              
              {/* Icon */}
              <div className="relative mb-3 w-12 h-12 rounded-xl 
                bg-gradient-to-br from-white/[0.08] to-white/[0.03]
                border border-white/[0.1]
                flex items-center justify-center
                group-hover:scale-110 transition-transform duration-300
                text-white/50 group-hover:text-white/80">
                {btn.icon}
              </div>
              
              {/* Label */}
              <span className="relative text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors duration-300">
                {btn.label}
              </span>
              
              {/* Arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { title: "Liquid Glass", desc: "iOS 26 inspired translucent panels" },
            { title: "Smooth Animations", desc: "60fps fluid transitions" },
            { title: "Silver & Black", desc: "Consistent color scheme" },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <h3 className="text-white/80 font-medium mb-2">{item.title}</h3>
              <p className="text-xs text-white/40">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Demo Overlays */}
      {showNotification && <OxLibNotifications onClose={() => setShowNotification(false)} />}
      {showContext && <OxLibContextMenu onClose={() => setShowContext(false)} />}
      {showInput && <OxLibInputDialog onClose={() => setShowInput(false)} />}
      {showProgress && <OxLibProgressBar onClose={() => setShowProgress(false)} />}
      {showSkillCheck && <OxLibSkillCheck onClose={() => setShowSkillCheck(false)} />}
      {showTextUI && <OxLibTextUI onClose={() => setShowTextUI(false)} />}
      {showAlert && <OxLibAlertDialog onClose={() => setShowAlert(false)} />}
      {showMenu && <OxLibMenu onClose={() => setShowMenu(false)} />}
      {showRadio && <OxLibRadio onClose={() => setShowRadio(false)} />}
    </div>
  )
}
