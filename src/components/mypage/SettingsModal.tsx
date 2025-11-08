"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  // 설정 항목들의 애니메이션 variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Modal - 3/4 height */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            initial={{
              y: "100%",
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              y: dragY,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
              scale: 0.95,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
              duration: isDragging ? 0 : undefined,
            }}
            className="fixed bottom-0  left-2/5 w-[480px] bg-white z-50 h-3/4 rounded-t-3xl shadow-2xl"
            style={{
              transform: `translate(-50%) translateY(${dragY}px)`,
              transition: isDragging ? "none" : undefined,
            }}
          >
            {/* Drag Handle */}
            <motion.div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing bg-white rounded-t-3xl"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <motion.div
                className="w-10 h-1 bg-gray-300 rounded-full"
                whileHover={{ scale: 1.1, backgroundColor: "#9CA3AF" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
            </motion.div>

            {/* Header */}
            <motion.div
              className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </motion.button>
              <h2 className="text-lg font-medium text-gray-800">설정</h2>
              <div className="w-6" />
            </motion.div>

            {/* Settings Content */}
            <motion.div
              className="flex-1 px-6 py-4 bg-white overflow-y-auto custom-scrollbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <motion.div className="space-y-1" variants={containerVariants} initial="hidden" animate="visible">
                {/* Account Info */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between py-4 border-b border-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">로그인된 계정</div>
                      <div className="text-xs text-gray-500">rey@gmail.com</div>
                    </div>
                  </div>
                </motion.div>

                {/* Subscription */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between py-4 border-b border-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">구독 활동</div>
                      <div className="text-xs text-gray-500">Emory Plus</div>
                    </div>
                  </div>
                </motion.div>

                {/* Member Withdrawal */}
                <motion.button
                  variants={itemVariants}
                  onClick={() => {
                    window.location.href = "/withdrawal"
                  }}
                  className="flex items-center justify-between w-full py-4 border-b border-gray-50 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                  whileHover={{ scale: 1.02, backgroundColor: "#F9FAFB" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <UserMinus className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">회원 탈퇴</span>
                  </div>
                </motion.button>

                {/* Member Info Edit */}
                <motion.button
                  variants={itemVariants}
                  onClick={() => {
                    window.location.href = "/member-info"
                  }}
                  className="flex items-center justify-between w-full py-4 border-b border-gray-50 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                  whileHover={{ scale: 1.02, backgroundColor: "#F9FAFB" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Edit className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">회원 정보 수정</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </motion.button>

                {/* Logout */}
                <motion.button
                  variants={itemVariants}
                  onClick={() => {
                    window.location.href = "/logout-confirm-page"
                  }}
                  className="flex items-center justify-between w-full py-4 border-b border-gray-50 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                  whileHover={{ scale: 1.02, backgroundColor: "#F9FAFB" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">로그아웃</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </motion.button>

                {/* Dark Mode */}
                <motion.div variants={itemVariants} className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-3">
                    <Moon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">야간모드</span>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
