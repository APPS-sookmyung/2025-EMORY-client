import { useMemo } from 'react';

export interface EmojiPixel404Props {
  images: string[];
  tile?: number; // px within viewBox units
  gap?: number; // px between tiles
  rotate?: number; // max random rotation in degrees
  matrix?: number[][]; // optional custom bitmap: 1 = emoji, 0 = empty
  spaceCols?: number; // digits spacing in columns when matrix not provided
  ariaLabel?: string; // custom aria-label for accessibility
}

/*
 * 픽셀아트 비트맵 (1=이모지, 0=비움)
 */
export const DIGIT_4: number[][] = [
  [1, 0, 1, 0, 0],
  [1, 0, 1, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
];

export const DIGIT_0: number[][] = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0],
];

/* function makeDigit4(height = 11, width = 9): number[][] {
  const rows: number[][] = [];
  for (let r = 0; r < height; r++) {
    const row = new Array(width).fill(0);
    if (r <= Math.floor(height * 0.6)) row[0] = 1; // left vertical up to crossbar
    row[width - 1] = 1; // right vertical
    if (r === Math.floor(height * 0.6)) for (let c = 0; c < width; c++) row[c] = 1; // crossbar
    rows.push(row);
  }
  return rows;
}

function makeDigit0(height = 11, width = 9): number[][] {
  const rows: number[][] = [];
  for (let r = 0; r < height; r++) {
    const row = new Array(width).fill(0);
    if (r === 0 || r === height - 1) {
      for (let c = 0; c < width; c++) row[c] = 1;
    } else {
      row[0] = 1;
      row[width - 1] = 1;
    }
    rows.push(row);
  }
  return rows;
} */

function joinWithSpacing(a: number[][], b: number[][], spacingCols = 3): number[][] {
  const height = Math.max(a.length, b.length);
  const pad = (m: number[][]) =>
    Array.from({ length: height }, (_, r) => (m[r] ? m[r] : new Array(m[0].length).fill(0)));
  const A = pad(a);
  const B = pad(b);
  const space = new Array(spacingCols).fill(0);
  return A.map((row, r) => [...row, ...space, ...B[r]]);
}

export default function EmojiPixel404({ images, tile = 26, gap = 4, rotate = 0, matrix: custom, spaceCols = 2, ariaLabel }: EmojiPixel404Props) {
  const matrix = useMemo(() => {
    if (custom && custom.length && custom[0]?.length) return custom;
    const d4 = DIGIT_4;
    const d0 = DIGIT_0;
    const left = joinWithSpacing(d4, d0, spaceCols); // 숫자 사이 공백
    const all = joinWithSpacing(left, d4, spaceCols);
    return all;
  }, [custom, spaceCols]);

  // Early return if no images provided
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No emoji images available</p>
      </div>
    );
  }

  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const W = cols * tile + (cols - 1) * gap;
  const H = rows * tile + (rows - 1) * gap;

  // Generate dynamic aria-label based on context
  const defaultAriaLabel = custom ? "Pixel art display with emojis" : "404 error displayed as pixel art with emojis";
  const finalAriaLabel = ariaLabel || defaultAriaLabel;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={finalAriaLabel} className="mx-auto">
      {matrix.map((row, r) =>
        row.map((v, c) => {
          if (!v) return null;
          const x = c * (tile + gap);
          const y = r * (tile + gap);
          const src = images[(r * cols + c) % images.length];
          const rot = rotate ? (((r * 13 + c * 29) % (rotate * 2 + 1)) - rotate) : 0;
          return (
            <g key={`${r}-${c}`} transform={`translate(${x}, ${y}) rotate(${rot}, ${tile / 2}, ${tile / 2})`}>
              <image href={src} xlinkHref={src as any} x={0} y={0} width={tile} height={tile} preserveAspectRatio="xMidYMid slice" />
            </g>
          );
        })
      )}
    </svg>
  );
}
