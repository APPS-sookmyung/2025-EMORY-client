import { useMemo, useState, useRef, useEffect } from "react";
import { Menu, CircleUserRound, CircleCheckBig, CircleDashed } from "lucide-react";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "wouter";
import { useSidebar } from "../components/sidebar/SidebarContext";
import { CloudSun, CloudRain, Snowflake, Cloud, Sun } from "lucide-react";

// 이모지 경로
import angryEmoji from "../assets/img/emotion/angry-emoji.png";
import anxiousEmoji from "../assets/img/emotion/anxiety-emoji.png";
import calmEmoji from "../assets/img/emotion/expressionless-emoji.png";
import happyEmoji from "../assets/img/emotion/happiness-emoji.png";
import joyEmoji from "../assets/img/emotion/joy-emoji.png";
import sadEmoji from "../assets/img/emotion/sadness-emoji.png";

export default function DiaryWriting() {
  const [body, setBody] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // 상태 추가
  const [showWeatherPicker, setShowWeatherPicker] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState("");

  const WEATHER_OPTIONS = [
    { icon: <Sun className="text-yellow-400" />, label: "맑음" },
    { icon: <CloudSun className="text-orange-400" />, label: "구름" },
    { icon: <CloudRain className="text-blue-400" />, label: "비" },
    { icon: <Snowflake className="text-sky-300" />, label: "눈" },
    { icon: <Cloud className="text-gray-400" />, label: "흐림" },
  ];

  // 모달 상태 & 선택 옵션
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  const openFeedbackModal = () => setFeedbackOpen(true);
  const closeFeedbackModal = () => setFeedbackOpen(false);

  // 모달 열릴 때 바디 스크롤 잠금
  useEffect(() => {
    if (!isFeedbackOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isFeedbackOpen]);

  // 작성 완료 처리
  const completeDiary = () => {
    setIsCompleted(true);
    toast({
      title: "작성 완료",
      description: selectedFeedback
        ? `피드백 : "${selectedFeedback}"로 저장했어요.`
        : "일기 작성을 완료했습니다.",
    });
  };

  // 모달 Confirm
  const confirmFeedback = () => {
    // (필요하면 서버 전송 코드 추가)
    completeDiary();
    closeFeedbackModal();
  };

  // 사진 업로드
  const [images, setImages] = useState<File[]>([]);

  const onAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };


  // 이모지 선택 상태
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiBtnRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const EMOJI_OPTIONS: { src: string; label: string }[] = [
    { src: joyEmoji, label: "기쁨" },
    { src: happyEmoji, label: "행복" },
    { src: calmEmoji, label: "평온" },
    { src: angryEmoji, label: "분노" },
    { src: sadEmoji, label: "슬픔" },
    { src: anxiousEmoji, label: "불안" },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!emojiOpen) return;
      const t = e.target as Node;
      if (
        popoverRef.current && !popoverRef.current.contains(t) &&
        emojiBtnRef.current && !emojiBtnRef.current.contains(t)
      ) {
        setEmojiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emojiOpen]);

  const openEmojiPicker = () => setEmojiOpen(v => !v);
  const chooseEmoji = (src: string) => { setSelectedEmoji(src); setEmojiOpen(false); };

  const cardBgClass = "bg-gradient-to-b from-[#A1CBFF] to-white";

  // 본문 라인
  const linesBg = useMemo(() => ({
    backgroundImage:
      "repeating-linear-gradient(to bottom, transparent, transparent 34px, rgba(255,255,255,0.9) 35px)",
    backgroundColor: "transparent",
    backgroundSize: "calc(100% - 40px) 35px",
    backgroundPosition: "center top",
    backgroundRepeat: "repeat-y",
  }), []);

  const { open } = useSidebar();
  const openSideMenu = () => open();
  const goMyPage = () => navigate("/my-page");

  const onCheckClick = () => {
    if (!isCompleted) {
      // 작성 완료 전: 내용 없으면 막기
      if (!body.trim()) {
        toast({ title: "내용이 없어요", description: "일기를 작성한 후 완료해 주세요." });
        return;
      }
      // 피드백 미선택 → 모달 열기
      if (!selectedFeedback) {
        openFeedbackModal();
        return;
      }
      // 피드백 이미 선택되어 있으면 바로 완료 처리
      completeDiary();
    } else {
      // 이미 완료된 상태 → 다시 수정 모드로
      setIsCompleted(false);
      toast({ title: "다시 수정", description: "일기를 다시 수정합니다." });
    }
  };

  return (
    // App.tsx의 480x844 프레임 안을 꽉 채움
    <div className="h-full w-full">
      <div className={`w-full h-full rounded-3xl ${cardBgClass}
                       shadow-xl overflow-hidden flex flex-col min-h-0`}>


        {/* 상단바 (고정) */}
        {/* === 상단바 480 x 112 === */}
        <header className="w-full h-[112px] px-4 flex items-end pb-3 border-b border-white/50">

          <div className="w-full flex items-center justify-between">
            {/* 왼쪽: 햄버거 */}
            <Button
              variant="ghost"
              aria-label="메뉴"
              onClick={openSideMenu}
              className="h-11 w-11 p-0 rounded-full hover:bg-white/40 flex items-center justify-center [&_svg]:size-7"
            >
              <Menu className="text-[#2242b5]" />
            </Button>

            {/* 가운데: 타이틀 */}
            <div className="text-[18px] md:text-[20px] tracking-wide font-semibold text-[#2242b5] select-none">
              EMORY
            </div>

            {/* 오른쪽: 마이페이지 */}
            <Button
              variant="ghost"
              aria-label="마이페이지"
              onClick={goMyPage}
              className="h-11 w-11 p-0 rounded-full hover:bg-white/40 flex items-center justify-center [&_svg]:size-7"
            >
              <CircleUserRound className="text-[#2242b5]/80" />
            </Button>
          </div>
        </header>

        {/* 체크 + 유틸(별/음악/이모지) — 양쪽 정렬 */}
        <div className="px-4 mt-5 flex items-center justify-between">
          {/* 왼쪽 그룹: 별/음악/이모지 */}
          <div className="flex items-center gap-2">
            {/* 별 */}
            <button
              type="button"
              aria-label="별"
              className="h-11 w-11 p-0 rounded-full hover:bg-white/30 flex items-center justify-center [&_svg]:size-7"
            >
              <CircleDashed className="stroke-white" />
            </button>

            {/* 날씨 이모지 선택 */}
            <div className="relative">
              <button
                type="button"
                aria-label="날씨 선택"
                onClick={() => setShowWeatherPicker(v => !v)}
                className="h-11 w-11 p-0 rounded-full hover:bg-white/30 flex items-center justify-center [&_svg]:size-7"
              >
                {selectedWeather
                  ? WEATHER_OPTIONS.find(w => w.label === selectedWeather)?.icon
                  : <Sun className="stroke-white" />}
              </button>

              {showWeatherPicker && (
                <div className="absolute top-12 left-[180%] -translate-x-1/2
             z-30 bg-white rounded-xl shadow-lg p-3
             w-[250px] text-center"
                >
                  <p className="text-slate-600 text-sm mb-2 text-center">오늘의 날씨를 선택하세요 ☁️</p>
                  <div className="flex items-center justify-center gap-3">
                    {WEATHER_OPTIONS.map(({ icon, label }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setSelectedWeather(label);
                          setShowWeatherPicker(false);
                        }}
                        title={label}
                        className={`h-10 w-10 rounded-full flex items-center justify-center 
              border transition ${selectedWeather === label
                            ? "border-blue-400 bg-blue-50"
                            : "border-transparent hover:bg-slate-100"}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>



            {/* 이모지 */}
            <div className="relative">
              <button
                ref={emojiBtnRef}
                type="button"
                aria-label="감정 이모지 선택"
                onClick={openEmojiPicker}
                title="감정 선택"
                className={`h-11 w-11 p-0 rounded-full hover:bg-white/30 flex items-center justify-center relative
    ${emojiOpen ? "after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[3px] after:w-8 after:rounded-full after:bg-white/70" : ""}`}
              >
                <img
                  src={selectedEmoji ?? EMOJI_OPTIONS[0].src}
                  alt="선택된 감정"
                  className="h-7 w-7 object-contain"
                />
              </button>

              {emojiOpen && (
                <div
                  ref={popoverRef}
                  className="
      fixed inset-0 z-30
      flex items-start justify-center
      mt-[285px]
    "
                >
                  <div
                    className="
        bg-white rounded-[18px] px-5 py-4
        shadow-xl ring-1 ring-black/5
        w-[340px] max-w-[90%]
      "
                    role="dialog"
                    aria-modal="true"
                  >
                    <p className="text-gray-600 text-base font-medium mb-3 text-center">
                      감정을 선택해 주세요.
                    </p>

                    <div className="flex items-center justify-center gap-3">
                      {EMOJI_OPTIONS.map(({ src, label }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => chooseEmoji(src)}
                          title={label}
                          aria-label={label}
                          className="p-0"
                        >
                          <img
                            src={src}
                            alt={label}
                            className={`h-10 w-10 object-contain rounded-full shadow-sm transition
                hover:scale-105 ${selectedEmoji === src ? "ring-2 ring-blue-400" : ""}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* 오른쪽 그룹: 체크 버튼 */}
          <button
            type="button"
            onClick={onCheckClick}
            aria-pressed={isCompleted}
            aria-label="작성 완료"
            title="작성 완료"
            className="h-11 w-11 p-0 rounded-full hover:bg-white/40 flex items-center justify-center transition"
          >
            <CircleCheckBig
              className={`w-7 h-7 ${isCompleted ? "text-blue-500" : "text-white/70 hover:text-white"}`}
            />
          </button>
        </div>


        {/* 컨텐츠 스크롤 영역 (이모지/텍스트/AI 이미지 전부) */}
        <div className="px-4 flex-1 min-h-0 overflow-y-auto pb-6 custom-scrollbar">

          {/* 본문 입력 (흰 라인 배경) */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            readOnly={isCompleted}
            placeholder="Please write your diary here"
            className="mt-1 w-full h-[400px] resize-y bg-transparent focus:outline-none 
               text-[15px] leading-[36px] tracking-wide text-white 
               placeholder:text-white/80 px-5"
            style={linesBg}
          />

          {/* 사진 추가 영역 */}
          <div className="mt-6 px-5">
            {/* 숨겨진 파일 인풋 */}
            <input
              type="file"
              accept="image/*"
              multiple
              id="image-upload"
              className="hidden"
              onChange={onAddImages}
              disabled={isCompleted}
            />

            {/* 버튼 */}
            <label
              htmlFor="image-upload"
              className={`
    mt-6 ml-5 inline-flex items-center gap-2
    text-slate-700/70 text-sm
    cursor-pointer
    hover:text-white
    transition
    ${isCompleted ? "opacity-40 pointer-events-none" : ""}
  `}
            >
              <span>사진 추가</span>
            </label>




            {/* 미리보기 */}
            {images.length > 0 && (
              <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
                {images.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-xl overflow-hidden shadow"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full
                bg-black/50 text-white text-xs
                flex items-center justify-center"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>
      </div>

      {/* === [ADD] Feedback Modal === */}
      {isFeedbackOpen && (
        <>
          <div
            className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-[1px]"
            aria-hidden="true"
            onClick={closeFeedbackModal}
          />
          <div
            className="fixed inset-0 z-[210] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-feedback-title"
          >
            <div className="w-full max-w-[420px] md:max-w-lg lg:max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
              <div className="px-6 pt-6 pb-3 text-center">
                <h2 id="ai-feedback-title" className="text-xl font-semibold text-slate-900">
                  Feedback of AI Diary
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Please give us some feedback to develop functions
                </p>
              </div>

              <div className="px-6 space-y-3">
                {["매우 일치해요", "조금 일치해요", "조금 맞지 않아요", "매우 맞지 않아요"].map((label) => {
                  const active = selectedFeedback === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedFeedback(label)}
                      className={`w-full h-11 rounded-xl border text-[15px] transition
                  ${active
                          ? "bg-[#a9c8ff] text-white border-[#a9c8ff]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="px-6 pt-5 pb-6">
                <button
                  type="button"
                  onClick={confirmFeedback}
                  disabled={!selectedFeedback}
                  className="w-full h-11 rounded-xl bg-[#8cb5ff] hover:bg-[#7aa6ff] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={closeFeedbackModal}
                  className="mt-3 w-full h-10 text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}