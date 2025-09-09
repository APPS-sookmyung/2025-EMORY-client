"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowLeft, ChevronRight, Mail, Clock, UserMinus, Edit, LogOut, Moon } from "lucide-react"
import { Switch } from "../../components/ui/switch"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [startY, setStartY] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const [darkMode, setDarkMode] = useState(false)


  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return 

    const currentY = e.touches[0].clientY
    const deltaY = currentY - startY

    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    if (dragY > 100) {
      onClose()
    } else {
      setDragY(0)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartY(e.clientY)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const currentY = e.clientY
    const deltaY = currentY - startY

    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    if (dragY > 100) {
      onClose()
    } else {
      setDragY(0)
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragY, startY])

  useEffect(() => {
    if (isOpen) {
      setDragY(0)
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal - 3/4 height */}
      <div
        ref={modalRef}
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white z-50 transition-transform duration-300 ease-out h-3/4 rounded-t-3xl ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } `}
        style={{
          transform: isOpen ? `translateX(-50%) translateY(${dragY}px)` : "translateX(-50%) translateY(100%)",
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing bg-white rounded-t-3xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <button onClick={onClose}>
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-lg font-medium text-gray-800">설정</h2>
          <div className="w-6" />
        </div>

        {/* Settings Content */}
        <div className="flex-1 px-6 py-4 bg-white overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {/* Account Info */}
            <div className="flex items-center justify-between py-4 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-800">로그인된 계정</div>
                  <div className="text-xs text-gray-500">rey@gmail.com</div>
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="flex items-center justify-between py-4 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-800">구독 활동</div>
                  <div className="text-xs text-gray-500">Emory Plus</div>
                </div>
              </div>
            </div>

            {/* Member Withdrawal */}
            <button
              onClick={() => {
                window.location.href = "/withdrawal"
              }}
              className="flex items-center justify-between w-full py-4 border-b border-gray-50 hover:bg-gray-50 rounded-lg px-2 -mx-2"
            >
              <div className="flex items-center space-x-3">
                <UserMinus className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-800">회원 탈퇴</span>
              </div>
            </button>

            {/* Member Info Edit */}
            <button
              onClick={() => {
                window.location.href = "/member-info"
              }}
              className="flex items-center justify-between w-full py-4 border-b border-gray-50 hover:bg-gray-50 rounded-lg px-2 -mx-2"
            >
              <div className="flex items-center space-x-3">
                <Edit className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-800">회원 정보 수정</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                window.location.href = "/logout-confirm-page"
              }}
              className="flex items-center justify-between w-full py-4 border-b border-gray-50 hover:bg-gray-50 rounded-lg px-2 -mx-2"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-800">로그아웃</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dark Mode */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-800">야간모드</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
