"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Mail,
  Clock,
  UserMinus,
  Edit,
  LogOut,
  Moon,
} from "lucide-react";
import { Switch } from "../../components/ui/switch";
import type { UserProfileResponse } from "../../services/userService";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileResponse | null;
}

export default function SettingsModal({ isOpen, onClose, profile }: SettingsModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) setDragY(deltaY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragY > 100 ? onClose() : setDragY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      if (deltaY > 0) setDragY(deltaY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragY > 100 ? onClose() : setDragY(0);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startY, dragY, onClose]);

  useEffect(() => {
    if (isOpen) setDragY(0);
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 rounded-t-3xl bg-white"
        style={{
          transform: `translateX(-50%) translateY(${isOpen ? dragY : 100}%)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center py-3 cursor-grab"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button onClick={onClose}>
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h2 className="text-lg font-medium">설정</h2>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto">
          <Item icon={<Mail />} title="로그인된 계정" desc={profile?.email || "로딩 중..."} />
          <Item icon={<Clock />} title="구독 활동" desc="무료" />

          <Action
            icon={<UserMinus />}
            label="회원 탈퇴"
            onClick={() => (window.location.href = "/withdrawal")}
          />
          <Action
            icon={<Edit />}
            label="회원 정보 수정"
            right
            onClick={() => (window.location.href = "/member-info")}
          />
          <Action
            icon={<LogOut />}
            label="로그아웃"
            right
            onClick={() => (window.location.href = "/logout-confirm-page")}
          />

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Moon />
              <span>야간모드</span>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Sub Components ---------- */

function Item({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b pb-4">
      {icon}
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
    </div>
  );
}

function Action({
  icon,
  label,
  right,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  right?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full items-center justify-between border-b py-4"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {right && <ChevronRight className="h-4 w-4 text-gray-400" />}
    </motion.button>
  );
}
