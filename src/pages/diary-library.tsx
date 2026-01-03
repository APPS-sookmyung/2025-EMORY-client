import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSidebar } from "../components/sidebar/SidebarContext";
import { Button } from "../components/ui/button";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import { Menu, CircleUserRound } from "lucide-react";
import { diaryService, type DiaryItem } from "../services/diaryService";
import { useToast } from "../hooks/use-toast";

/* ========= 타입 정의 ========= */
type LibraryMonth = {
    yearMonth: string; // "2025-11" 형식
    displayYear: string; // "2025.11" 표시용
    images: DiaryItem[];
};

export default function DiaryLibrary() {
    const [, navigate] = useLocation();
    const { open } = useSidebar();
    const { toast } = useToast();
    const [library, setLibrary] = useState<LibraryMonth[]>([]);
    const [loading, setLoading] = useState(true);

    // 이미지 데이터 로드
    useEffect(() => {
        const loadImages = async () => {
            try {
                setLoading(true);
                const images = await diaryService.getDiaryImages();

                // 연도-월별로 그룹화
                const grouped = images.reduce((acc, item) => {
                    // dateLabel에서 연도-월 추출 (MM/DD 형식이므로 현재 연도 가정)
                    const currentYear = new Date().getFullYear();
                    const [month] = item.dateLabel.split('/');
                    const yearMonth = `${currentYear}-${month.padStart(2, '0')}`;
                    const displayYear = `${currentYear}.${month.padStart(2, '0')}`;

                    if (!acc[yearMonth]) {
                        acc[yearMonth] = {
                            yearMonth,
                            displayYear,
                            images: [],
                        };
                    }
                    acc[yearMonth].images.push(item);
                    return acc;
                }, {} as Record<string, LibraryMonth>);

                // 배열로 변환하고 최신순 정렬
                const libraryArray = Object.values(grouped).sort((a, b) =>
                    b.yearMonth.localeCompare(a.yearMonth)
                );

                setLibrary(libraryArray);
            } catch (error) {
                console.error('Failed to load diary images:', error);
                toast({
                    title: "이미지 로드 실패",
                    description: error instanceof Error ? error.message : "이미지를 불러오는데 실패했습니다.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, [toast]);

    return (
        <div className="h-full w-full">
            {/* 스크롤바 숨기기 스타일을 페이지 안에 선언 */}
            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
                <main
                    className="
            flex-1 min-h-0 px-3 md:px-4
            pb-[calc(env(safe-area-inset-bottom)+32px)]

            overflow-y-auto no-scrollbar scroll-smooth
          "
                >
                    {/* 토글 */}
                    <div className="flex justify-end pt-2 pe-1 mt-2">
                        <ToggleSwitch
                            checked={true}
                            onChange={(v) => !v && navigate("/diary-preview")}
                        />
                    </div>

                    {/* 로딩 상태 */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-gray-500">이미지를 불러오는 중...</div>
                        </div>
                    )}

                    {/* 연도별 라이브러리 */}
                    {!loading && library.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="text-gray-400 text-center">
                                <p className="mb-4">아직 사진이 있는 일기가 없습니다.</p>
                                <Button
                                    onClick={() => navigate("/diary-write")}
                                    className="bg-[#2242b5] hover:bg-[#1a3490]"
                                >
                                    일기 쓰러 가기
                                </Button>
                            </div>
                        </div>
                    )}

                    {!loading && library.length > 0 && (
                        <div className="mt-6 space-y-10">
                            {library.map(({ yearMonth, displayYear, images }) => (
                                <section key={yearMonth}>
                                    <h2 className="text-lg font-semibold text-gray-500 mb-3 px-4">
                                        {displayYear}
                                    </h2>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 px-4">
                                        {images.map((item) => (
                                            <div
                                                key={item.id}
                                                className="
                                                    aspect-square rounded-xl overflow-hidden
                                                    border border-white/50
                                                    shadow-[0_8px_18px_rgba(30,64,175,0.15)]
                                                    hover:shadow-[0_10px_22px_rgba(30,64,175,0.22)]
                                                    transition-shadow
                                                    cursor-pointer
                                                    bg-blue-300/60
                                                "
                                                onClick={() => navigate(`/diary/${item.id}`)}
                                            >
                                                {item.imageUrl && (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={`${item.dateLabel} diary`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                </section>
                            ))}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
