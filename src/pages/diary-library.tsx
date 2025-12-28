import { useLocation } from "wouter";
import { useSidebar } from "../components/sidebar/SidebarContext";
import { Button } from "../components/ui/button";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import { Menu, CircleUserRound } from "lucide-react";

/* ========= 더미 데이터 ========= */
type LibraryMonth = {
    year: string;
    images: (string | null)[];
};

const LIBRARY: LibraryMonth[] = [
    {
        year: "2025.11",
        images: [
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            null,
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
            "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
            null,
            null,
            null,
            null,
            null,
            "https://images.unsplash.com/photo-1494526585095-c41746248156",
            null,
            null,

        ],
    },
    {
        year: "2025.12",
        images: [
            "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb",
            "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
            null,
            null,
            null,
            null,
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
            "https://images.unsplash.com/photo-1519681393784-d120267933ba",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            "https://images.unsplash.com/photo-1502082553048-f009c37129b9",

        ],
    },
];


export default function DiaryLibrary() {
    const [, navigate] = useLocation();
    const { open } = useSidebar();

    return (
        <div className="h-full w-full">
            {/* 스크롤바 숨기기 스타일을 페이지 안에 선언 */}
            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            <div className="w-full h-full rounded-3xl bg-gradient-to-b from-[#A1CBFF] to-white shadow-xl flex flex-col min-h-0">
                {/* 헤더 */}
                <header className="flex items-center justify-between p-4 flex-shrink-0">
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
            overflow-y-auto custom-scrollbar scroll-smooth
          "
                >
                    {/* 토글 */}
                    <div className="flex justify-end pt-2 pe-1 mt-2">
                        <ToggleSwitch
                            checked={true}
                            onChange={(v) => !v && navigate("/diary-preview")}
                        />
                    </div>

                    {/* 연도별 라이브러리 */}
                    <div className="mt-6 space-y-10">
                        {LIBRARY.map(({ year, images }) => (
                            <section key={year}>
                                <h2 className="text-lg font-semibold text-gray-500 mb-3 px-4">
                                    {year}
                                </h2>

                                <div className="grid grid-cols-4 gap-2 px-4">
                                    {images.map((src, idx) => (
                                        <div
                                            key={idx}
                                            className="
        aspect-square rounded-xl overflow-hidden
        border border-white/50
        shadow-[0_8px_18px_rgba(30,64,175,0.15)]
        hover:shadow-[0_10px_22px_rgba(30,64,175,0.22)]
        transition-shadow
        bg-blue-300/60
      "
                                        >
                                            {src && (
                                                <img
                                                    src={src}
                                                    alt={`${year} diary ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                            </section>
                        ))}
                    </div>

                </main>
            </div>
        </div>
    );
}
