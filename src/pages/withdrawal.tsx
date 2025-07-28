"use client"

import { useState } from "react"
import { useLocation } from "wouter"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"

export default function WithdrawalPage() {
  const [, navigate] = useLocation()
  const [withdrawalChecks, setWithdrawalChecks] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false,
    check5: false,
    check6: false,
  })

  const handleWithdrawalCheck = (checkId: string) => {
    setWithdrawalChecks((prev) => ({
      ...prev,
      [checkId]: !prev[checkId as keyof typeof prev],
    }))
  }

  const handleWithdrawal = () => {
    const confirmed = window.confirm("정말로 회원탈퇴를 진행하시겠습니까?")
    if (confirmed) {
      console.log("회원탈퇴 진행...")
      // 실제 탈퇴 API 호출 로직
      alert("회원탈퇴가 완료되었습니다.")
      navigate("/")
    }
  }

  return (
    <div className="gradient-mypage">
      
          <div className="p-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
          </div>

        <div className="bg-white/80 backdrop-blur-sm mx-4 mt-4 rounded-lg p-4 ">
          <h2 className="text-lg font-medium mb-4 text-gray-800">회원 탈퇴</h2>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">회원탈퇴 후, 언제든지 재가입하실 수 있습니다.</p>
            <p className="text-sm text-gray-600 mb-4">
              회원님은 현재 <span className="text-orange-500 font-medium">1234@naver.com</span> 계정으로 가입하셨습니다.
            </p>
            <p className="text-sm text-gray-500">* 본 계정으로 발행된 인증서가 있습니다.</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-800 mb-3">탈퇴하려는 이유가 무엇인가요?</h3>

            <div className="space-y-2">
              {[
                "잘못 가입 신청함",
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
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium"
              onClick={handleWithdrawal}
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      </div>
  )
}
