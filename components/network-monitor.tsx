"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, Smartphone, RefreshCw } from "lucide-react"

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
  quality: "excellent" | "good" | "fair" | "poor"
}

export default function NetworkMonitor() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: true,
    connectionType: "unknown",
    effectiveType: "4g",
    downlink: 0,
    rtt: 0,
    saveData: false,
    serverLatency: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    quality: "good",
  })

  const [isTestingSpeed, setIsTestingSpeed] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const updateNetworkInfo = async () => {
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    const info: NetworkInfo = {
      isOnline: navigator.onLine,
      connectionType: connection?.type || "unknown",
      effectiveType: connection?.effectiveType || "4g",
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
      serverLatency: 0,
      downloadSpeed: 0,
      uploadSpeed: 0,
      quality: "good",
    }

    // Test server latency
    try {
      const start = performance.now()
      await fetch("/api/ping", { cache: "no-cache" })
      const end = performance.now()
      info.serverLatency = Math.round(end - start)
    } catch (error) {
      info.serverLatency = 999
    }

    // Determine quality based on metrics
    if (info.rtt < 50 && info.downlink > 10) {
      info.quality = "excellent"
    } else if (info.rtt < 100 && info.downlink > 5) {
      info.quality = "good"
    } else if (info.rtt < 200 && info.downlink > 1) {
      info.quality = "fair"
    } else {
      info.quality = "poor"
    }

    setNetworkInfo(info)
    setLastUpdate(new Date())
  }

  const testSpeed = async () => {
    setIsTestingSpeed(true)

    try {
      // Simulate speed test
      const testData = new ArrayBuffer(1024 * 100) // 100KB test

      // Download speed test
      const downloadStart = performance.now()
      await fetch("/api/ping", { cache: "no-cache" })
      const downloadEnd = performance.now()
      const downloadTime = downloadEnd - downloadStart
      const downloadSpeed = (100 * 8) / (downloadTime / 1000) // Kbps

      // Upload speed test (simulated)
      const uploadSpeed = downloadSpeed * 0.8 // Usually lower than download

      setNetworkInfo((prev) => ({
        ...prev,
        downloadSpeed: Math.round(downloadSpeed),
        uploadSpeed: Math.round(uploadSpeed),
      }))
    } catch (error) {
      console.error("Speed test failed:", error)
    } finally {
      setIsTestingSpeed(false)
    }
  }

  useEffect(() => {
    updateNetworkInfo()

    const handleOnline = () => updateNetworkInfo()
    const handleOffline = () => updateNetworkInfo()

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Update every 10 seconds
    const interval = setInterval(updateNetworkInfo, 10000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [])

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "fair":
        return "text-yellow-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "default"
      case "good":
        return "secondary"
      case "fair":
        return "outline"
      case "poor":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getConnectionIcon = () => {
    if (!networkInfo.isOnline) return <WifiOff className="h-5 w-5 text-red-600" />
    return <Wifi className="h-5 w-5 text-green-600" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-arabic-display">
          <div className="flex items-center gap-2">
            {getConnectionIcon()}
            مراقب الشبكة
          </div>
          <Badge variant={getQualityBadge(networkInfo.quality)}>
            {networkInfo.quality === "excellent" && "ممتاز"}
            {networkInfo.quality === "good" && "جيد"}
            {networkInfo.quality === "fair" && "مقبول"}
            {networkInfo.quality === "poor" && "ضعيف"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-arabic-body">حالة الاتصال</span>
          <Badge variant={networkInfo.isOnline ? "default" : "destructive"}>
            {networkInfo.isOnline ? "متصل" : "غير متصل"}
          </Badge>
        </div>

        {networkInfo.isOnline && (
          <>
            {/* Network Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-arabic-body">
                <span>نوع الشبكة</span>
                <span className="uppercase">{networkInfo.effectiveType}</span>
              </div>

              <div className="flex justify-between font-arabic-body">
                <span>سرعة التحميل</span>
                <span>{networkInfo.downlink} Mbps</span>
              </div>

              <div className="flex justify-between font-arabic-body">
                <span>زمن الاستجابة</span>
                <span className={networkInfo.rtt < 100 ? "text-green-600" : "text-yellow-600"}>
                  {networkInfo.rtt}ms
                </span>
              </div>

              <div className="flex justify-between font-arabic-body">
                <span>استجابة الخادم</span>
                <span className={networkInfo.serverLatency < 100 ? "text-green-600" : "text-yellow-600"}>
                  {networkInfo.serverLatency}ms
                </span>
              </div>
            </div>

            {/* Speed Test Results */}
            {(networkInfo.downloadSpeed > 0 || networkInfo.uploadSpeed > 0) && (
              <div className="space-y-2 text-sm border-t pt-3">
                <h4 className="font-semibold font-arabic-body">نتائج اختبار السرعة</h4>
                <div className="flex justify-between font-arabic-body">
                  <span>سرعة التحميل</span>
                  <span>{networkInfo.downloadSpeed} Kbps</span>
                </div>
                <div className="flex justify-between font-arabic-body">
                  <span>سرعة الرفع</span>
                  <span>{networkInfo.uploadSpeed} Kbps</span>
                </div>
              </div>
            )}

            {/* Data Saver */}
            {networkInfo.saveData && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <Smartphone className="h-4 w-4" />
                <span className="font-arabic-body">وضع توفير البيانات مفعل</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testSpeed}
                disabled={isTestingSpeed}
                className="flex-1 font-arabic-body bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ml-2 ${isTestingSpeed ? "animate-spin" : ""}`} />
                اختبار السرعة
              </Button>
            </div>

            {/* Last Update */}
            <div className="text-xs text-muted-foreground text-center font-arabic-body">
              آخر تحديث: {lastUpdate.toLocaleTimeString("ar-SA")}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
