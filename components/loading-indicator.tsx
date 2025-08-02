"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface LoadingIndicatorProps {
  isLoading: boolean
  message?: string
  progress?: number
}

const loadingMessages = [
  "جاري تحميل البيانات...",
  "معالجة المعاملات...",
  "تحليل المخاطر...",
  "تحديث الإحصائيات...",
  "تحضير التقارير...",
]

export default function LoadingIndicator({ isLoading, message, progress }: LoadingIndicatorProps) {
  const [currentMessage, setCurrentMessage] = useState(message || loadingMessages[0])
  const [currentProgress, setCurrentProgress] = useState(progress || 0)

  useEffect(() => {
    if (!isLoading) return

    let messageIndex = 0
    let progressValue = 0

    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length
      setCurrentMessage(loadingMessages[messageIndex])
    }, 2000)

    const progressInterval = setInterval(() => {
      if (progress === undefined) {
        progressValue += Math.random() * 15
        if (progressValue > 90) progressValue = 90
        setCurrentProgress(progressValue)
      }
    }, 200)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [isLoading, progress])

  useEffect(() => {
    if (progress !== undefined) {
      setCurrentProgress(progress)
    }
  }, [progress])

  useEffect(() => {
    if (message) {
      setCurrentMessage(message)
    }
  }, [message])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center space-y-6">
          {/* Loading Spinner */}
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>

          {/* Loading Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold font-arabic-display">{currentMessage}</h3>
            <p className="text-sm text-muted-foreground font-arabic-body">يرجى الانتظار قليلاً...</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={currentProgress} className="h-2" />
            <p className="text-xs text-muted-foreground font-arabic-body">{Math.round(currentProgress)}% مكتمل</p>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center space-x-1 space-x-reverse">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.6s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
