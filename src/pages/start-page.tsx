"use client"

import { useLocation } from "wouter"
import { Button } from "../components/ui/button"
import { GoogleIcon, AppleIcon, KakaoIcon } from "../components/ui/socialicons"
import { useToast } from '../hooks/use-toast';


export default function StartPage() {
  const [, navigate] = useLocation()
  const { toast } = useToast();

  const handleGoogleLogin = () => {
    // 로그인 로직을 여기에 추가
    toast({ title: "Google 로그인", description: "로그인 후 마이페이지로 이동" })
  }

  const handleAppleLogin = () => {
    toast({ title: "Apple 로그인", description: "로그인 후 마이페이지로 이동" })
  }
  const handleKakaoLogin = () => {
    toast({ title: "KakaoTalk 로그인", description: "로그인 후 마이페이지로 이동" })
  }

  

  const handleLogin = () => {
    toast({ title: "일반 로그인", description: "로그인 후 마이페이지로 이동" })
  }

  return (
    <div className="gradient-mypage">
      {/* 상단 여백 */}
      {/* 메인 콘텐츠 - 중앙 정렬 */}
      <div className="flex-1 flex flex-col items-center justify-center p-9">
        {/* 타이틀 섹션 */}
        <div className="text-center mb-16 mt-32">
          <h1 className="text-4xl font-light text-gray-600 mb-4 drop-shadow-sm">Welcome to</h1>
          <h2 className="text-5xl font-bold text-gray-700 mb-8 drop-shadow-sm tracking-wide">EMORY</h2>

          <div className="text-center mb-12">
            <p className="text-gray-600 text-base leading-relaxed drop-shadow-sm">당신의 감정을 이해하고 분석하는</p>
            <p className="text-gray-600 text-base leading-relaxed drop-shadow-sm">따뜻한 감정 일기 공간</p>
          </div>
        </div>

        {/* Let's Get Started 섹션 */}
        <div className="w-full max-w-sm">
          <h3 className="text-xl font-medium text-gray-600 text-center mb-8 drop-shadow-sm">Let's Get Started!</h3>

          {/* 로그인 버튼들 */}
          <div className="space-y-4">
            {/* Google 로그인 */}
            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-white/40 hover:bg-white/50 text-gray-700 py-4 rounded-2xl backdrop-blur-sm border border-white/50 shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <GoogleIcon />
              <span className="font-medium">Continue with Google</span>
            </Button>

            {/* Apple 로그인 */}
            <Button
              onClick={handleAppleLogin}
              className="w-full bg-white/40 hover:bg-white/50 text-gray-700 py-4 rounded-2xl backdrop-blur-sm border border-white/50 shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <AppleIcon />
              <span className="font-medium">Continue with Apple</span>
            </Button>

            {/* KakaoTalk 로그인 */}
            <Button
              onClick={handleKakaoLogin}
              className="w-full bg-yellow-400/60 hover:bg-yellow-500/60 text-gray-800 py-4 rounded-2xl backdrop-blur-sm border border-yellow-300/50 shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <KakaoIcon />
              <span className="font-medium">Continue with KakaoTalk</span>
            </Button>

            {/* 일반 로그인 */}
            <Button
              onClick={handleLogin}
              className="w-full bg-gray-600/60 hover:bg-gray-700/60 text-white py-4 rounded-2xl backdrop-blur-sm border border-gray-500/50 shadow-lg transition-all duration-300 mt-6"
            >
              <span className="font-medium">Log in</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 하단 여백 */}
      <div className="pb-8"></div>
    </div>
  )
}
