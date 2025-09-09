import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { emojiPool } from '../assets/emojiPool';
import gradientBg from '../assets/img/gradientbackground.png';

const icons = emojiPool;

const LoadingPage: React.FC = () => {
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentEmoji((prev) => (prev + 1) % icons.length);
        setIsVisible(true);
      }, 200);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // 로딩 완료 후 리다이렉트 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPage = urlParams.get('redirect');
    
    const loadingTimer = setTimeout(() => {
      if (redirectPage) {
        navigate(`/${redirectPage}`);
      } else {
        // 기본적으로 홈으로 이동
        navigate('/');
      }
    }, 3000); // 3초 로딩

    return () => clearTimeout(loadingTimer);
  }, [navigate]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-white overflow-hidden">
      {/* background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${gradientBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          filter: 'saturate(110%)',
        }}
      />

      <div className="relative max-w-[440px] w-full">
        <header className="mb-8">
          <h1 className="text-xl font-bold">잠시만 기다려주세요</h1>
          <p className="mt-2 text-sm text-muted-foreground">감정을 불러오고 있어요</p>
        </header>

        {/* Large animated emoji */}
        <div className="mb-12 flex items-center justify-center">
          <div
            className={`transition-all duration-300 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{
              transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0.9) rotate(-5deg)',
            }}
          >
            <img
              src={icons[currentEmoji]}
              alt="Loading emoji"
              className="w-32 h-32 rounded-2xl"
              style={{
                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))',
                animation: isVisible ? 'gentlePulse 2s ease-in-out infinite alternate' : 'none',
                imageRendering: 'crisp-edges',
                WebkitImageRendering: 'crisp-edges',
              }}
            />
          </div>
        </div>

        {/* Simple loading text */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wider">LOADING</h2>
        </div>

        {/* Loading dots */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.4s',
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gentlePulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;