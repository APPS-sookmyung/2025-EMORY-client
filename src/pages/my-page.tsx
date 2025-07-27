"use client"

import { useState } from "react"
import { useLocation } from "wouter"
import { ArrowLeft, ChevronRight, User } from "lucide-react"
import { Button } from "../components/ui/button"
import SettingsModal from "../components/mypage/SettingsModal"

export default function MyPage() {
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [, navigate] = useLocation()

  const openSettingsModal = () => {
    setShowSettingsModal(true)
  }

  const closeSettingsModal = () => {
    setShowSettingsModal(false)
  }

  // // 음성 채팅으로 이동
  // const goToVoiceChat = () => {
  //   navigate("/voice-chat")
  // }

  const handleLogout = () => {
    navigate("/logout")
  }

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen relative">
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-rose-200 via-orange-200 via-yellow-200 via-green-200 via-cyan-200 via-blue-200 via-indigo-200 via-purple-200 to-pink-200">
        <div className="p-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col items-center px-6 pt-16">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-gray-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <User className="w-12 h-12 text-gray-600" />
            </div>
            <h1 className="text-2xl font-medium text-gray-700 mb-1">Jeewon</h1>
            <p className="text-gray-500 text-sm mb-6">emory@gmail.com</p>

            <Button
              variant="secondary"
              className="bg-gray-400/80 hover:bg-gray-500/80 text-white px-8 py-2 rounded-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          {/* Menu Items */}
          <div className="w-full space-y-3 mt-8">
            <button
              className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-white/90 transition-colors"
            >
              <span className="text-gray-700 font-medium">감정 일기 히스토리</span>
              <ChevronRight className="w-5 h-5 text-orange-400" />
            </button>

            <button className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-white/90 transition-colors">
              <span className="text-gray-700 font-medium">emory plus 요금제</span>
              <ChevronRight className="w-5 h-5 text-orange-400" />
            </button>

            <button className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-white/90 transition-colors">
              <span className="text-gray-700 font-medium">타임캡슐</span>
              <ChevronRight className="w-5 h-5 text-orange-400" />
            </button>

            <button
              onClick={openSettingsModal}
              className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-white/90 transition-colors"
            >
              <span className="text-gray-700 font-medium">설정</span>
              <ChevronRight className="w-5 h-5 text-orange-400" />
            </button>
          </div>
        </div>
      </div>

      <SettingsModal isOpen={showSettingsModal} onClose={closeSettingsModal} />
    </div>
  )
}
