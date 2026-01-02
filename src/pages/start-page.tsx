"use client"

import { useEffect, useState } from "react"
import { useGoogleLogin } from '@react-oauth/google'
import { Button } from "../components/ui/button"
import { GoogleIcon, AppleIcon, KakaoIcon } from "../components/ui/socialicons"
import Hamburger from "../components/common/Hamburger"
import { useToast } from '../hooks/use-toast';
import { useLocation } from 'wouter';
import { authService } from '../services/authService';

// Kakao SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

export default function StartPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Kakao SDK 초기화
  useEffect(() => {
    const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY;
    if (kakaoAppKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoAppKey);
      console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
    }
  }, []);

  // Google 로그인
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const { accessToken, isNewUser } = await authService.login('google', tokenResponse.access_token);

        toast({
          title: "로그인 성공",
          description: isNewUser ? "환영합니다! 새로운 계정이 생성되었습니다." : "로그인되었습니다.",
        });

        // 로그인 성공 후 voice-chat 페이지로 이동
        navigate('/voice-chat');
      } catch (error) {
        console.error('Google login failed:', error);
        toast({
          title: "로그인 실패",
          description: error instanceof Error ? error.message : "Google 로그인에 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({
        title: "로그인 실패",
        description: "Google 로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Kakao 로그인
  const handleKakaoLogin = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      toast({
        title: "Kakao SDK 오류",
        description: "Kakao SDK가 초기화되지 않았습니다.",
        variant: "destructive",
      });
      return;
    }

    window.Kakao.Auth.login({
      success: async (authObj: any) => {
        try {
          setIsLoading(true);
          const { accessToken, isNewUser } = await authService.login('kakao', authObj.access_token);

          toast({
            title: "로그인 성공",
            description: isNewUser ? "환영합니다! 새로운 계정이 생성되었습니다." : "로그인되었습니다.",
          });

          // 로그인 성공 후 voice-chat 페이지로 이동
          navigate('/voice-chat');
        } catch (error) {
          console.error('Kakao login failed:', error);
          toast({
            title: "로그인 실패",
            description: error instanceof Error ? error.message : "Kakao 로그인에 실패했습니다.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      },
      fail: (err: any) => {
        console.error('Kakao login error:', err);
        toast({
          title: "로그인 실패",
          description: "Kakao 로그인 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      },
    });
  };

  // Apple 로그인 (백엔드에서 아직 지원하지 않음)
  const handleAppleLogin = () => {
    toast({
      title: "준비 중",
      description: "Apple 로그인은 현재 준비 중입니다.",
      variant: "destructive",
    })
  }

  // 일반 로그인 (현재 OAuth만 지원)
  const handleLogin = () => {
    toast({
      title: "안내",
      description: "소셜 로그인을 이용해 주세요.",
    })
  }

  return (
    <div className="gradient-mypage">
      <div className="absolute top-2 right-2">
        <Hamburger />
      </div>
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
        <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
          <h3 className="text-xl font-medium text-gray-600 text-center mb-8 drop-shadow-sm">Let's Get Started!</h3>

          {/* 로그인 버튼들 */}
          <div className="space-y-4">
            {/* Google 로그인 */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white/40 hover:bg-white/50 text-gray-700 py-4 rounded-2xl backdrop-blur-sm border border-white/50 shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              <span className="font-medium">
                {isLoading ? "로그인 중..." : "Continue with Google"}
              </span>
            </Button>

            {/* Apple 로그인 */}
            <Button
              onClick={handleAppleLogin}
              disabled={isLoading}
              className="w-full bg-white/40 hover:bg-white/50 text-gray-700 py-4 rounded-2xl backdrop-blur-sm border border-white/50 shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AppleIcon />
              <span className="font-medium">Continue with Apple</span>
            </Button>

            {/* KakaoTalk 로그인 */}
            <Button
              onClick={handleKakaoLogin}
              disabled={isLoading}
              className="w-full bg-yellow-400/60 hover:bg-yellow-500/60 text-gray-800 py-4 rounded-2xl backdrop-blur-sm border border-yellow-300/50 shadow-lg transition-all duration-300 flex items-center justify-content-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <KakaoIcon />
              <span className="font-medium">
                {isLoading ? "로그인 중..." : "Continue with KakaoTalk"}
              </span>
            </Button>

            {/* 일반 로그인 */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gray-600/60 hover:bg-gray-700/60 text-white py-4 rounded-2xl backdrop-blur-sm border border-gray-500/50 shadow-lg transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
