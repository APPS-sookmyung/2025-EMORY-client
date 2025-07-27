"use client"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { useToast } from '../hooks/use-toast';
import { useLocation } from "wouter";   

export default function LogoutPage() {
    const { toast } = useToast();
    const [, navigate] = useLocation();
    const handleLogout = () => {
        // 로그아웃 로직 추후에 추가
        toast({
            title: "로그아웃 성공",
            description: "안전하게 로그아웃되었습니다.",
        });


        // setTimeout(() => {
        //     navigate('/my-page')
        // }, 2000) // 마이페이지로 2초 후에 리다이렉트
    };
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      <div className="min-h-screen bg-gradient-to-b from-yellow-200 via-orange-200 via-red-200 to-pink-200">
        <div className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 p-4">
          <div className="flex items-center mb-4">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <h1 className="text-xl font-medium text-gray-800 mb-6">로그아웃</h1>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
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
    </div>
  )
}
