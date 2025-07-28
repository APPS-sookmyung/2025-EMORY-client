import type React from "react"
import { cn } from "../../lib/utils"

interface GradientBackgroundProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "voice-chat" | "settings" | "withdrawal" | "member-info" | "logout"
}

export default function GradientBackground({ children, className, variant = "default" }: GradientBackgroundProps) {
  const getGradientClass = () => {
    switch (variant) {
      case "voice-chat":
        return "gradient-voice-chat"
      case "settings":
        return "gradient-settings"
      case "withdrawal":
        return "gradient-withdrawal"
      case "member-info":
        return "gradient-member-info"
      case "logout":
        return "gradient-logout"
      default:
        return "gradient-default"
    }
  }

  return <div className={cn("min-h-screen relative", getGradientClass(), className)}>{children}</div>
}
