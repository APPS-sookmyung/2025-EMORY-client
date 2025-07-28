
"use client"

import { useState } from "react"
import { useLocation } from "wouter"
import { ArrowLeft, ChevronRight, User } from "lucide-react"
import { Button } from "../components/ui/button"
import SettingsModal from "../components/mypage/SettingsModal"
import GradientBackground from "../styles/components/background"

export default function MyPage() {
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [, navigate] = useLocation()

  const openSettingsModal = () => {
    setShowSettingsModal(true)
  }

  const closeSettingsModal = () => {
    setShowSettingsModal(false)
  }

  const handleLogout = () => {
    navigate("/logout")
  }

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <GradientBackground variant="default">
        <div className="p-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-200" />
          </button>
        </div>

        <div className="flex flex-col items-center px-6 pt-16">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg border border-white/30">
              <User className="w-12 h-12 text-gray-700" />
            </div>
            <h1 className="text-2xl font-medium text-white mb-1 drop-shadow-sm">Jeewon</h1>
            <p className="text-white/80 text-sm mb-6 drop-shadow-sm">emory@gmail.com</p>

            <Button
              variant="secondary"
              className="bg-white/30 hover:bg-white/40 text-gray-800 px-8 py-2 rounded-full backdrop-blur-sm border border-white/40 shadow-lg"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          {/* Menu Items */}
          <div className="w-full px-6 space-y-3 mt-8 pb-10">
            <button className="w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40">
              <span className="text-white font-medium">감정 일기 히스토리</span>
              <ChevronRight className="w-5 h-5 text-orange-500" />
            </button>

            <button className="w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40">
              <span className="text-white font-medium">요금제</span>
              <ChevronRight className="w-5 h-5 text-orange-500" />
            </button>

            <button className="w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40">
              <span className="text-white font-medium">타임캡슐</span>
              <ChevronRight className="w-5 h-5 text-orange-500" />
            </button>

            <button
              onClick={openSettingsModal}
              className="w-full bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-white/40 transition-all duration-300 border border-white/40"
            >
              <span className="text-white font-medium">설정</span>
              <ChevronRight className="w-5 h-5 text-orange-500" />
            </button>
          </div>
        </div>
      </GradientBackground>

      {showSettingsModal && <SettingsModal isOpen={showSettingsModal} onClose={closeSettingsModal} />}
    </div>
  )
}
