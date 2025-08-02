"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

interface LoadingIndicatorProps {
  isLoading: boolean
  progress?: number
  message?: string
}

const loadingMessages = [
  "جاري تحميل لوحة التحكم...",
  "تحميل البيانات...",
  "إعداد الواجهة...",
  "تحضير المحتوى...",
  "تحميل المكونات...",
  "تهيئة النظام...",
]

export default function LoadingIndicator({ isLoading, progress = 0, message }: LoadingIndicatorProps) {
  const [currentMessage, setCurrentMessage] = useState(message || loadingMessages[0])
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const next = (prev + 1) % loadingMessages.length
        setCurrentMessage(loadingMessages[next])
        return next
      })
    }, 800)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 space-y-4">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-lg font-semibold font-arabic-display">تحميل النظام</h3>
          <p className="text-sm text-muted-foreground font-arabic-body animate-pulse">{currentMessage}</p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground font-arabic-body">
            <span>التقدم</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const startLoading = () => {
    setIsLoading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsLoading(false)
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setProgress(100)
  }

  return { isLoading, progress, startLoading, stopLoading }
}
