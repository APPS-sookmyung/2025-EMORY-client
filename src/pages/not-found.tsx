import React from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import EmojiPixel404 from '../components/common/EmojiPixel404';

import { emojiPool } from '../assets/emojiPool';
import gradientBg from '../assets/img/gradientbackground.png';

/** 이모지 후보 풀: 원하는 표정들로 바꿔도 됩니다 */
const icons = emojiPool;

function EmojiText404() {
  return <EmojiPixel404 images={icons} tile={26} gap={4} rotate={2} spaceCols={1} />;
}

const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-white overflow-hidden">
      {/* background image (home.png) */}
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

      <div className="relative max-w-[480px] w-full">
        <header className="mb-8">
          <h1 className="text-xl font-bold">Whoops, that page is gone.</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            찾으시는 페이지가 존재하지 않거나 이동되었어요. (404)
          </p>
        </header>

        <div className="flex justify-center">
          <EmojiText404 />
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">홈으로</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            이전으로
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
