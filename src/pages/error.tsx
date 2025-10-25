import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import EmojiPixel404 from '../components/common/EmojiPixel404';

import { emojiPool } from '../assets/emojiPool';
import gradientBg from '../assets/img/gradientbackground.png';

/** 이모지 후보 풀: 원하는 표정들로 바꿔도 됩니다 */
const icons = emojiPool;

// 5x7 픽셀 아트 대문자 비트맵
const LETTERS: Record<string, number[][]> = {
  E: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  R: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  O: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
};

function joinCols(a: number[][], b: number[][], gapCols: number) {
  const height = Math.max(a.length, b.length);
  const pad = (m: number[][]) => Array.from({ length: height }, (_, i) => m[i] ?? new Array(m[0].length).fill(0));
  const A = pad(a), B = pad(b);
  const gap = new Array(gapCols).fill(0);
  return A.map((row, i) => [...row, ...gap, ...B[i]]);
}

function useErrorMatrix() {
  return useMemo(() => {
    const gap = 1; // 문자 사이 1열 공백
    const E = LETTERS.E;
    const R = LETTERS.R;
    const O = LETTERS.O;
    let m = joinCols(E, R, gap);
    m = joinCols(m, R, gap);
    m = joinCols(m, O, gap);
    m = joinCols(m, R, gap);
    return m;
  }, []);
}

const ErrorPage: React.FC = () => {
  const matrix = useErrorMatrix();
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

      <div className="relative max-w-[480px] w-full">
        <header className="mb-8">
          <h1 className="text-xl font-bold">문제가 발생했어요</h1>
          <p className="mt-1 text-sm text-muted-foreground">일시적인 오류예요. 잠시 후 다시 시도해 주세요.</p>
        </header>

        <div className="flex justify-center">
          {/* 화면 폭이 좁으므로 작은 타일/간격 */}
          <EmojiPixel404
            images={icons}
            matrix={matrix}
            tile={14}
            gap={2}
            rotate={1}
            ariaLabel="Error message displayed as pixel art with emojis"
          />
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
          <Button variant="secondary" asChild>
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
