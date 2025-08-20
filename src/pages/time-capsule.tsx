"use client"

import { Tag } from "lucide-react"
import { Card } from "../components/ui/card"
import Hamburger from "../components/common/Hamburger"

export default function TimeCapsulePage() {
  return (
    <div className="gradient-time-capsule">
      {/* Header */}
      <header className="grid grid-cols-3 items-center p-4">
        <div className="justify-self-start">
          <Hamburger />
        </div>
        <div className="justify-self-center">
          <Tag className="w-8 h-8 text-pink-800" />
        </div>
        <div className="justify-self-end"></div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-8">
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-8 bg-pink-500 rounded-full"></div>
            <h1 className="text-2xl font-bold text-pink-900">그해 오늘</h1>
          </div>
          <p className="text-pink-800 text-sm ml-3">작년 이 시간에 가장 키워드 한 주를 보내셨습니다!</p>
        </div>

        {/* 왼쪽 대표사진 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Left Card - Image */}
          <Card className="aspect-square overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
            <img
              src="../src/assets/img/coverimage.png"
              alt="AI가 작성해주는 대표사진"
              className="w-full h-full object-cover"
            />
          </Card>

          {/* 오른쪽 AI 요약문구 */}
          <Card className="aspect-square bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
            <div className="h-full p-4 flex items-center justify-center bg-gradient-to-br from-white to-pink-50 rounded-xl">
              <div className="text-center">
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  AI 가 한 주 요약하는 문구 AI 가 한 주 요약하는 문구 AI 가 한 주 요약하는 문구 AI 가 한 주 요약하 는
                  문구 AI 가 한 주 요약하는 문 구 AI 가 한 주 요약하는 문구
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="aspect-square bg-white/60 backdrop-blur-sm border-0 shadow-md rounded-xl">
              <div className="h-full flex flex-col items-center justify-center p-4 space-y-3">
                {/* Triangle Icon */}
                <div className="w-8 h-8 bg-gray-300 rounded-sm flex items-center justify-center">
                  <div className="w-0 h-0 border-l-3 border-r-3 border-b-4 border-l-transparent border-r-transparent border-b-gray-500"></div>
                </div>

                {/* Bottom Icons */}
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
