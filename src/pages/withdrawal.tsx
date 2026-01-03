"use client"

import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import Hamburger from "../components/common/Hamburger"
import { userService } from "../services/userService"
import { useToast } from "../hooks/use-toast"

export default function WithdrawalPage() {
  const [, navigate] = useLocation()
  const { toast } = useToast()
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [withdrawalChecks, setWithdrawalChecks] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false,
    check5: false,
    check6: false,
  })

  // 사용자 프로필 로드
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await userService.getProfile()
        setUserEmail(profile.email)
      } catch (error) {
        console.error('Failed to load profile:', error)
        toast({
          title: "프로필 로드 실패",
          description: "사용자 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        })
      }
    }

    loadProfile()
  }, [toast])

  const handleWithdrawalCheck = (checkId: string) => {
    setWithdrawalChecks((prev) => ({
      ...prev,
      [checkId]: !prev[checkId as keyof typeof prev],
    }))
  }

  const handleWithdrawal = async () => {
    const confirmed = window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?\n\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.")
    if (!confirmed) return

    try {
      setLoading(true)
      await userService.deleteAccount()

      toast({
        title: "탈퇴 완료",
        description: "회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.",
      })

      // 로컬 스토리지 정리
      localStorage.removeItem('token')

      // 시작 페이지로 이동
      setTimeout(() => {
        navigate("/")
      }, 1500)
    } catch (error) {
      console.error('Withdrawal failed:', error)
      toast({
        title: "탈퇴 실패",
        description: error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gradient-mypage">

      <div className="p-4 flex items-center justify-between">
        <button onClick={() => navigate("/my-page")}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <Hamburger />
      </div>

      <div className="bg-white/80 backdrop-blur-sm mx-4 mt-4 rounded-lg p-4 ">
        <h2 className="text-lg font-medium mb-4 text-gray-800">회원 탈퇴</h2>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">회원 탈퇴 후, 언제든지 재가입하실 수 있습니다.</p>
          <p className="text-sm text-gray-600 mb-4">
            회원님은 현재 <span className="text-orange-500 font-medium">{userEmail || "로딩 중..."}</span> 계정으로 가입하셨습니다.
          </p>
          <p className="text-sm text-gray-500">* 탈퇴 시 모든 일기와 데이터가 삭제되며 복구할 수 없습니다.</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-800 mb-3">탈퇴하려는 이유가 무엇인가요?</h3>

          <div className="space-y-2">
            {[
              "잘못 가입한 계정",
              "이메일 변경 후 재가입",
              "서비스 사용이 불편함",
              "콘텐츠가 기대에 못 미침",
              "개인정보 우려",
              "기타",
            ].map((reason, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`check${index + 1}`}
                  checked={withdrawalChecks[`check${index + 1}` as keyof typeof withdrawalChecks]}
                  onCheckedChange={() => handleWithdrawalCheck(`check${index + 1}`)}
                />
                <label htmlFor={`check${index + 1}`} className="text-sm text-gray-600 cursor-pointer">
                  {reason}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-6">
          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleWithdrawal}
            disabled={loading}
          >
            {loading ? "탈퇴 처리 중..." : "탈퇴하기"}
          </Button>
        </div>
      </div>
    </div>
  )
}
