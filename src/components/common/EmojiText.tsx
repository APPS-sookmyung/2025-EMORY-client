import React, { useEffect, useMemo, useState } from 'react';

type Placed = { x: number; y: number; a: number; src: string };

export interface EmojiTextProps {
  text: string;
  images: string[];
  width?: number;
  height?: number;
  tile?: number; // emoji tile size (px in viewBox units)
  step?: number; // grid sampling step (larger -> sparser)
  outline?: boolean; // sample only the outline instead of fill
  minDistance?: number; // minimal distance between tiles for regularity
}

export default function EmojiText({
  text,
  images,
  width = 420,
  height = 220,
  tile = 24,
  step = 24,
  outline = true,
  minDistance,
}: EmojiTextProps) {
  const [placed, setPlaced] = useState<Placed[]>([]);

  // Generate unique clipPath ID to prevent conflicts
  const clipPathId = useMemo(() => `roundedEmojiTile-${Math.random().toString(36).substr(2, 9)}`, []);

  const distMin = useMemo(() => (minDistance ?? tile * 0.82), [minDistance, tile]);

  useEffect(() => {
    // Early return if no images provided
    if (!images || images.length === 0) {
      setPlaced([]);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fit bold text to width
    let fontSize = height * 0.86;
    const family = "'Inter', 'Noto Sans KR', system-ui, -apple-system, Segoe UI, Roboto, Arial, Helvetica, sans-serif";
    for (let i = 0; i < 4; i++) {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `900 ${fontSize}px ${family}`;
      const mw = ctx.measureText(text).width;
      const target = width * 0.9;
      if (mw > target) fontSize *= target / mw; else break;
    }

    ctx.font = `900 ${fontSize}px ${family}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(text, width / 2, height * 0.58);

    const img = ctx.getImageData(0, 0, width, height);
    const data = img.data;
    const alphaAt = (x: number, y: number) => data[(y * width + x) * 4 + 3] | 0;

    const points: { x: number; y: number }[] = [];

    for (let y = Math.floor(step / 2); y < height; y += step) {
      for (let x = Math.floor(step / 2); x < width; x += step) {
        const a = alphaAt(x, y);
        if (a < 30) continue;
        if (outline) {
          // include only if near edge: has a neighbor outside glyph
          let edge = false;
          for (let oy = -1; oy <= 1 && !edge; oy++) {
            for (let ox = -1; ox <= 1 && !edge; ox++) {
              if (ox === 0 && oy === 0) continue;
              const nx = Math.max(0, Math.min(width - 1, x + ox));
              const ny = Math.max(0, Math.min(height - 1, y + oy));
              if (alphaAt(nx, ny) < 30) edge = true;
            }
          }
          if (!edge) continue;
        }
        points.push({ x, y });
      }
    }

    // Greedy thinning to enforce minimum distance between tiles
    const selected: { x: number; y: number }[] = [];
    const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return dx * dx + dy * dy;
    };
    const minD2 = distMin * distMin;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      let ok = true;
      for (let j = 0; j < selected.length; j++) {
        if (dist2(p, selected[j]) < minD2) {
          ok = false;
          break;
        }
      }
      if (ok) selected.push(p);
    }

    // Place tiles with small jitter/rotation for organic feel
    const tiles: Placed[] = [];
    for (let i = 0; i < selected.length; i++) {
      const p = selected[i];
      const src = images[i % images.length];
      const jx = ((p.x * 17 + p.y * 23) % 5) - 2;
      const jy = ((p.x * 13 + p.y * 19) % 5) - 2;
      const ang = (((p.x * 29 + p.y * 31) % 5) - 2) * 1.2;
      tiles.push({ x: p.x + jx * 0.25, y: p.y + jy * 0.25, a: ang, src });
    }

    setPlaced(tiles);
  }, [text, images, width, height, step, outline, distMin]);

  // Early return if no images provided
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No emoji images available</p>
      </div>
    );
  }

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={text} className="mx-auto">
      <defs>
        <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
          <rect x={-tile / 2} y={-tile / 2} width={tile} height={tile} rx={6} ry={6} />
        </clipPath>
      </defs>
      <g>
        {placed.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(${p.a})`} clipPath={`url(#${clipPathId})`}>
            <image href={p.src} x={-tile / 2} y={-tile / 2} width={tile} height={tile} preserveAspectRatio="xMidYMid slice" />
          </g>
        ))}
      </g>
    </svg>
  );
}

