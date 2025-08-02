"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface LoadingIndicatorProps {
  message?: string
  progress?: number
}

const loadingMessages = [
  "جاري تحميل البيانات...",
  "معالجة المعلومات...",
  "تحليل المعاملات...",
  "تحديث النتائج...",
  "تجهيز العرض...",
]

export default function LoadingIndicator({ message, progress }: LoadingIndicatorProps) {
  const [currentMessage, setCurrentMessage] = useState(message || loadingMessages[0])
  const [currentProgress, setCurrentProgress] = useState(progress || 0)

  useEffect(() => {
    if (!message) {
      const messageInterval = setInterval(() => {
        setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
      }, 2000)

      return () => clearInterval(messageInterval)
    }
  }, [message])

  useEffect(() => {
    if (progress === undefined) {
      const progressInterval = setInterval(() => {
        setCurrentProgress((prev) => {
          const increment = Math.random() * 15 + 5
          return Math.min(prev + increment, 95)
        })
      }, 300)

      return () => clearInterval(progressInterval)
    } else {
      setCurrentProgress(progress)
    }
  }, [progress])

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">{currentMessage}</p>
            <Progress value={currentProgress} className="w-full h-2" />
            <p className="text-sm text-gray-500 mt-2">{Math.round(currentProgress)}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [progress, setProgress] = useState(0)

  const startLoading = (loadingMessage?: string) => {
    setMessage(loadingMessage || "")
    setProgress(0)
    setIsLoading(true)
  }

  const updateProgress = (newProgress: number, newMessage?: string) => {
    setProgress(newProgress)
    if (newMessage) setMessage(newMessage)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setProgress(0)
    setMessage("")
  }

  return {
    isLoading,
    message,
    progress,
    startLoading,
    updateProgress,
    stopLoading,
  }
}
