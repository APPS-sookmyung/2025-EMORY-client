import { useCallback, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";
import { useSidebar } from "../components/sidebar/SidebarContext";
import { Button } from "../components/ui/button";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import {
  Menu, CircleUserRound,
  Bookmark, BookmarkCheck, Trash2, Plus,
} from "lucide-react";

/* ========= 타입 & 더미 데이터 ========= */
type DiaryItem = {
  id: string;
  dateLabel: string;
  hasContent: boolean; // 내용 유무
  bookmarked?: boolean;
  imageUrl?: string; // 이미지 삽입
};

const MOCK: DiaryItem[] = [
  { id: "d1", dateLabel: "12/25", hasContent: true, imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba', },
  { id: "d2", dateLabel: "12/26", hasContent: true, imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', },
  { id: "d3", dateLabel: "12/27", hasContent: true, imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9', },
  { id: "d4", dateLabel: "12/28", hasContent: false },
  { id: "d5", dateLabel: "12/29", hasContent: true },
  { id: "d6", dateLabel: "12/30", hasContent: true },
];

/* ========= 휠/터치로 인덱스 전환(쓰로틀) ========= */
function useScrollStepper(onStep: (dir: 1 | -1) => void, delay = 160) {
  const locked = useRef(false);

  const step = useCallback((dir: 1 | -1) => {
    if (locked.current) return;
    locked.current = true;
    onStep(dir);
    window.setTimeout(() => (locked.current = false), delay);
  }, [onStep, delay]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(delta) < 5) return;
    step(delta > 0 ? 1 : -1);
  }, [step]);

  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dy = e.changedTouches[0].clientY - touchStart.current;
    if (Math.abs(dy) > 24) step(dy > 0 ? -1 : 1);
    touchStart.current = null;
  };

  return { onWheel, onTouchStart, onTouchEnd };
}

/* ========= 카드(인라인 컴포넌트) ========= */
function DiaryCard({
  item, onOpen, onToggleBookmark, onDelete,
}: {
  item: DiaryItem;
  onOpen: () => void;
  onToggleBookmark: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="relative w-full h-full rounded-2xl bg-blue-300/90 shadow-xl backdrop-blur-sm border border-white/40 overflow-hidden">
      {/* 헤더 */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-white">
        <span className="font-semibold text-2xl drop-shadow">{item.dateLabel}</span>
        {item.hasContent && (
          <div className="flex items-center gap-2">
            <button onClick={onDelete} aria-label="delete" className="p-1 hover:opacity-80">
              <Trash2 size={18} />
            </button>
            <button onClick={onToggleBookmark} aria-label="bookmark" className="p-1 hover:opacity-80">
              {item.bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="w-full h-full flex items-center justify-center">
        {item.hasContent ? (
          <div className="w-[88%] h-[70%] rounded-xl overflow-hidden shadow-inner">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={`${item.dateLabel} diary`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center text-white/70">
                No Image
              </div>
            )}
          </div>
        ) : (
          // 내용이 없는 날: + 버튼 → 일기 작성 라우팅
          <button
            onClick={onOpen}
            className="flex flex-col items-center justify-center w-56 h-56 rounded-full border-2 border-dashed border-white/80 text-white/90 hover:bg-white/10 transition"
          >
            <Plus size={44} />
            <span className="mt-2 text-sm">오늘은 무슨 일이 있었나요?</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ========= 페이지 ========= */
export default function DiaryPreview() {
  const [items, setItems] = useState<DiaryItem[]>(MOCK);
  const [current, setCurrent] = useState(Math.floor(MOCK.length / 2));
  const clamp = (n: number) => Math.max(0, Math.min(items.length - 1, n));
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { open } = useSidebar();

  const step = useCallback((dir: 1 | -1) => setCurrent((c) => clamp(c + dir)), [items.length]);
  const { onWheel, onTouchStart, onTouchEnd } = useScrollStepper(step);

  // 삭제/북마크
  const onDelete = (idx: number) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next.length ? next : prev;
    });
    setCurrent((c) => clamp(Math.min(c, items.length - 2)));
    toast({ title: "삭제됨", description: `${items[idx]?.dateLabel} 카드가 삭제되었습니다.` });
  };
  const onToggleBookmark = (idx: number) => {
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, bookmarked: !it.bookmarked } : it));
  };

  // 열기
  const openItem = (idx: number) => {
    const it = items[idx];
    if (!it) return;
    if (it.hasContent) {
      toast({ title: it.dateLabel, description: "상세 페이지로 이동 준비 중…" });
      // navigate(`/diary-${it.id}`)
    } else {
      navigate("/diary/write"); // 경로 수정
    }
  };

  // 스택 스타일
  const layers = useMemo(() => {
    return items.map((_, i) => {
      const d = i - current;
      const abs = Math.abs(d);
      const scale = 1 - Math.min(abs * 0.06, 0.4);
      const y = d * 28;
      const blur = Math.min(abs * 1.2, 6);
      const opacity = 1 - Math.min(abs * 0.15, 0.6);
      const z = 50 - abs;
      return { scale, y, blur, opacity, z };
    });
  }, [items, current]);

  // 카드 크기/위치 (화면 꽉 차지 않게 + 중앙보다 조금 아래)
  const CARD_MAX_W = 420;
  const CARD_MAX_H = 480;
  const CARD_W_PCT = 0.8;
  const CARD_H_VH = 45;
  const CENTER_OFFSET = 32;

  return (
    <div className="h-full w-full">
      <div className="w-full h-full rounded-3xl bg-gradient-to-b from-[#A1CBFF] to-white shadow-xl flex flex-col min-h-0">
        {/* 상단바 */}
        <header className="w-full h-[112px] px-4 flex items-end pb-3 border-b border-white/50">
          <div className="w-full flex items-center justify-between">
            <Button
              variant="ghost"
              aria-label="메뉴"
              onClick={() => open()}
              className="h-11 w-11 p-0 rounded-full hover:bg-white/40 flex items-center justify-center [&_svg]:size-7"
            >
              <Menu className="text-[#2242b5]" />
            </Button>

            <div className="text-[18px] md:text-[20px] tracking-wide font-semibold text-[#2242b5] select-none">
              EMORY
            </div>

            <Button
              variant="ghost"
              aria-label="마이페이지"
              onClick={() => navigate("/my-page")}
              className="h-11 w-11 p-0 rounded-full hover:bg-white/40 flex items-center justify-center [&_svg]:size-7"
            >
              <CircleUserRound className="text-[#2242b5]/80" />
            </Button>
          </div>
        </header>

        {/* 콘텐츠 */}
        <main className="flex-1 min-h-0 px-3 md:px-4 pb-[calc(env(safe-area-inset-bottom)+32px)]">
          {/* 토글: 상단바 하얀 줄 바로 밑, 우측 */}
          <div className="flex justify-end pt-2 pe-1 mt-2">
            <ToggleSwitch
              checked={false}
              onChange={(v) => v && navigate("/diary-library")}
            />
          </div>

          <section
            className="relative select-none pt-4"
            style={{ height: `60vh` }}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {items.map((item, i) => {
              const sty = layers[i];
              return (
                <div
                  key={item.id}
                  className="absolute will-change-transform transition-[transform,filter,opacity] duration-200"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translateY(${CENTER_OFFSET + sty.y}px) scale(${sty.scale})`,
                    width: `min(${CARD_W_PCT * 100}%, ${CARD_MAX_W}px)`,
                    height: `min(${CARD_H_VH}vh, ${CARD_MAX_H}px)`,
                    filter: `blur(${sty.blur}px)`,
                    opacity: sty.opacity,
                    zIndex: sty.z,
                  }}
                  onClick={() => setCurrent(i)} // 카드 탭하면 중앙으로 스냅
                >
                  <DiaryCard
                    item={item}
                    onOpen={() => openItem(i)}
                    onToggleBookmark={() => onToggleBookmark(i)}
                    onDelete={() => onDelete(i)}
                  />
                </div>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
