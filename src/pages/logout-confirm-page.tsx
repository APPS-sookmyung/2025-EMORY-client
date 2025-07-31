"use client"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { useToast } from '../hooks/use-toast';
import { useLocation } from "wouter";   

export default function LogoutConfirmPage() {
    const { toast } = useToast();
    const [, navigate] = useLocation();
    const handleLogout = () => {
        // 로그아웃 로직 추후에 추가

        localStorage.removeItem("token"); 
        sessionStorage.clear()
        setTimeout(() => {
            navigate('/my-page')
        }, 2000) // 마이페이지로 2초 후에 리다이렉트

        // 토스트 메시지 표시
        toast({
            title: "로그아웃 성공",
            description: "안전하게 로그아웃되었습니다.",
        });


    };


 return (
    <div className="gradient-mypage">
      
          <div className="p-4">
          <button onClick={() => navigate("/")}>
            <ArrowLeft className="w-6 h-6 text-gray-600" /> {/* ✅ 수정됨: 흰색 아이콘으로 변경 */}
          </button>
        </div>

        <div className="flex items-center justify-center min-h-[75vh]">
          <Card className="bg-white/90 backdrop-blur-sm p-6 mx-4 rounded-lg shadow-lg max-w-sm w-full">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚪</span>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-800 mb-2">로그아웃 하시겠습니까?</h3>

              <p className="text-sm text-gray-600 mb-6">로그아웃하면 다시 로그인해야 합니다.</p>

              <div className="space-y-3">
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>

                <Button variant="outline" className="w-full bg-transparent" onClick={() => window.history.back()}>
                  취소
                </Button>
              </div>
            </div>
          </Card>
        </div>
    </div>
  )
}
