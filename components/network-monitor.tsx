"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, Globe, RefreshCw, Signal, Download, Upload } from "lucide-react"

interface NetworkInfo {
  isOnline: boolean
  connectionType: string
  effectiveType: string
  downlink: number
  rtt: number
  saveData: boolean
  serverLatency: number
  downloadSpeed: number
  uploadSpeed: number
  quality: string
}

export default function NetworkMonitor() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: navigator.onLine,
    connectionType: "unknown",
    effectiveType: "4g",
    downlink: 0,
    rtt: 0,
    saveData: false,
    serverLatency: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    quality: "جيد",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const measureNetwork = async () => {
    setIsLoading(true)

    try {
      // Get connection info
      const connection =
        (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      // Measure server latency
      const startTime = performance.now()
      const response = await fetch("/api/ping", {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      const endTime = performance.now()
      const serverLatency = endTime - startTime

      // Simulate speed test (in real app, you'd use actual speed test)
      const downloadSpeed = connection?.downlink || Math.random() * 50 + 10
      const uploadSpeed = downloadSpeed * 0.8 // Upload usually slower

      let quality = "ممتاز"
      if (serverLatency > 200 || downloadSpeed < 5) quality = "ضعيف"
      else if (serverLatency > 100 || downloadSpeed < 15) quality = "مقبول"
      else if (serverLatency > 50 || downloadSpeed < 25) quality = "جيد"

      setNetworkInfo({
        isOnline: navigator.onLine,
        connectionType: connection?.type || "unknown",
        effectiveType: connection?.effectiveType || "4g",
        downlink: connection?.downlink || downloadSpeed,
        rtt: connection?.rtt || Math.random() * 100 + 20,
        saveData: connection?.saveData || false,
        serverLatency,
        downloadSpeed,
        uploadSpeed,
        quality,
      })

      setLastUpdate(new Date())
    } catch (error) {
      console.error("Network measurement failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    measureNetwork()
    const interval = setInterval(measureNetwork, 10000) // Update every 10 seconds

    const handleOnline = () => measureNetwork()
    const handleOffline = () => measureNetwork()

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "ممتاز":
        return "text-green-600 bg-green-50"
      case "جيد":
        return "text-blue-600 bg-blue-50"
      case "مقبول":
        return "text-yellow-600 bg-yellow-50"
      case "ضعيف":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getConnectionIcon = () => {
    if (!networkInfo.isOnline) return <WifiOff className="w-5 h-5 text-red-600" />

    switch (networkInfo.effectiveType) {
      case "4g":
        return <Signal className="w-5 h-5 text-green-600" />
      case "3g":
        return <Signal className="w-5 h-5 text-yellow-600" />
      case "2g":
        return <Signal className="w-5 h-5 text-red-600" />
      default:
        return <Wifi className="w-5 h-5 text-blue-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            مراقب الشبكة
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              آخر تحديث: {lastUpdate.toLocaleTimeString("ar-SA")}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={measureNetwork}
              disabled={isLoading}
              className="gap-1 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              تحديث
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {getConnectionIcon()}
            <span className="font-medium">{networkInfo.isOnline ? "متصل" : "غير متصل"}</span>
          </div>
          <Badge
            variant={networkInfo.isOnline ? "default" : "destructive"}
            className={getQualityColor(networkInfo.quality)}
          >
            {networkInfo.quality}
          </Badge>
        </div>

        {/* Network Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{networkInfo.effectiveType.toUpperCase()}</div>
            <p className="text-xs text-gray-600">نوع الشبكة</p>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{Math.round(networkInfo.downlink)} Mbps</div>
            <p className="text-xs text-gray-600">سرعة التحميل</p>
          </div>

          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">{Math.round(networkInfo.rtt)}ms</div>
            <p className="text-xs text-gray-600">زمن الاستجابة</p>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{Math.round(networkInfo.serverLatency)}ms</div>
            <p className="text-xs text-gray-600">استجابة الخادم</p>
          </div>
        </div>

        {/* Speed Test */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">سرعة التحميل</span>
            </div>
            <span className="text-sm font-bold">{networkInfo.downloadSpeed.toFixed(1)} Mbps</span>
          </div>
          <Progress value={(networkInfo.downloadSpeed / 100) * 100} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">سرعة الرفع</span>
            </div>
            <span className="text-sm font-bold">{networkInfo.uploadSpeed.toFixed(1)} Mbps</span>
          </div>
          <Progress value={(networkInfo.uploadSpeed / 100) * 100} className="h-2" />
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>وضع توفير البيانات:</span>
          <Badge variant={networkInfo.saveData ? "destructive" : "secondary"}>
            {networkInfo.saveData ? "مفعل" : "معطل"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
