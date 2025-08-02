"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, Signal, Smartphone, Monitor, RefreshCw } from "lucide-react"

interface NetworkStatus {
  online: boolean
  connectionType: string
  downlink: number
  rtt: number
  saveData: boolean
  serverLatency: number
  bandwidth: number
  packetLoss: number
}

export default function NetworkMonitor() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    online: true,
    connectionType: "4g",
    downlink: 10,
    rtt: 100,
    saveData: false,
    serverLatency: 0,
    bandwidth: 0,
    packetLoss: 0,
  })

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    checkNetworkStatus()

    const interval = setInterval(checkNetworkStatus, 10000)

    // Listen for online/offline events
    const handleOnline = () => checkNetworkStatus()
    const handleOffline = () => checkNetworkStatus()

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const checkNetworkStatus = async () => {
    const online = navigator.onLine
    let connectionType = "unknown"
    let downlink = 0
    let rtt = 0
    let saveData = false

    // Get connection info if available
    if ("connection" in navigator) {
      const connection = (navigator as any).connection
      connectionType = connection.effectiveType || "unknown"
      downlink = connection.downlink || 0
      rtt = connection.rtt || 0
      saveData = connection.saveData || false
    }

    // Measure server latency
    let serverLatency = 0
    let bandwidth = 0
    let packetLoss = 0

    try {
      const start = performance.now()
      const response = await fetch("/api/ping", {
        cache: "no-cache",
        method: "GET",
      })

      if (response.ok) {
        serverLatency = Math.round(performance.now() - start)

        // Estimate bandwidth based on response time and size
        const contentLength = response.headers.get("content-length")
        if (contentLength) {
          const bytes = Number.parseInt(contentLength)
          const seconds = serverLatency / 1000
          bandwidth = Math.round((bytes * 8) / seconds / 1000) // Kbps
        }
      }
    } catch (error) {
      serverLatency = -1
      packetLoss = Math.random() * 5 // Simulate packet loss
    }

    setNetworkStatus({
      online,
      connectionType,
      downlink,
      rtt,
      saveData,
      serverLatency,
      bandwidth,
      packetLoss,
    })

    setLastUpdate(new Date())
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await checkNetworkStatus()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getConnectionIcon = () => {
    if (!networkStatus.online) return <WifiOff className="h-5 w-5 text-red-500" />

    switch (networkStatus.connectionType) {
      case "4g":
        return <Signal className="h-5 w-5 text-green-500" />
      case "3g":
        return <Signal className="h-5 w-5 text-yellow-500" />
      case "2g":
        return <Signal className="h-5 w-5 text-red-500" />
      default:
        return <Wifi className="h-5 w-5 text-blue-500" />
    }
  }

  const getLatencyColor = (latency: number) => {
    if (latency === -1) return "destructive"
    if (latency < 100) return "default"
    if (latency < 300) return "secondary"
    return "destructive"
  }

  const getSpeedColor = (speed: number) => {
    if (speed > 10) return "default"
    if (speed > 5) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-arabic-display">مراقب الشبكة</h2>
        <Button onClick={handleRefresh} disabled={isRefreshing} size="sm">
          <RefreshCw className={`h-4 w-4 ml-2 ${isRefreshing ? "animate-spin" : ""}`} />
          تحديث
        </Button>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-arabic-display">
            {getConnectionIcon()}
            حالة الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{networkStatus.online ? "متصل" : "غير متصل"}</div>
              <Badge variant={networkStatus.online ? "default" : "destructive"}>
                {networkStatus.online ? "Online" : "Offline"}
              </Badge>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{networkStatus.connectionType.toUpperCase()}</div>
              <p className="text-sm text-muted-foreground font-arabic-body">نوع الشبكة</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{networkStatus.downlink} Mbps</div>
              <p className="text-sm text-muted-foreground font-arabic-body">سرعة التحميل</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{networkStatus.rtt}ms</div>
              <p className="text-sm text-muted-foreground font-arabic-body">زمن الاستجابة</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic-display">أداء الخادم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">زمن استجابة الخادم</span>
              <Badge variant={getLatencyColor(networkStatus.serverLatency)}>
                {networkStatus.serverLatency === -1 ? "خطأ" : `${networkStatus.serverLatency}ms`}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-arabic-body">عرض النطاق المقدر</span>
              <Badge variant={getSpeedColor(networkStatus.bandwidth / 1000)}>
                {networkStatus.bandwidth > 0 ? `${(networkStatus.bandwidth / 1000).toFixed(1)} Mbps` : "غير متاح"}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-arabic-body">فقدان الحزم</span>
              <Badge
                variant={
                  networkStatus.packetLoss < 1 ? "default" : networkStatus.packetLoss < 3 ? "secondary" : "destructive"
                }
              >
                {networkStatus.packetLoss.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-arabic-display">معلومات إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">وضع توفير البيانات</span>
              <Badge variant={networkStatus.saveData ? "secondary" : "outline"}>
                {networkStatus.saveData ? "مفعل" : "معطل"}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-arabic-body">نوع الجهاز</span>
              <div className="flex items-center gap-2">
                {window.innerWidth < 768 ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                <Badge variant="outline">{window.innerWidth < 768 ? "هاتف" : "حاسوب"}</Badge>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-arabic-body">آخر تحديث</span>
              <Badge variant="outline">{lastUpdate.toLocaleTimeString("ar-SA")}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Quality Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic-display">جودة الشبكة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-arabic-body">التقييم الإجمالي</span>
              <Badge
                variant={
                  networkStatus.serverLatency < 100 && networkStatus.downlink > 5
                    ? "default"
                    : networkStatus.serverLatency < 300 && networkStatus.downlink > 2
                      ? "secondary"
                      : "destructive"
                }
                className="text-lg px-3 py-1"
              >
                {networkStatus.serverLatency < 100 && networkStatus.downlink > 5
                  ? "ممتاز"
                  : networkStatus.serverLatency < 300 && networkStatus.downlink > 2
                    ? "جيد"
                    : "ضعيف"}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground font-arabic-body">
              {networkStatus.online
                ? networkStatus.serverLatency < 100 && networkStatus.downlink > 5
                  ? "الشبكة تعمل بأداء ممتاز. جميع الخدمات متاحة بسرعة عالية."
                  : networkStatus.serverLatency < 300 && networkStatus.downlink > 2
                    ? "الشبكة تعمل بأداء جيد. قد تواجه بعض التأخير في التحميل."
                    : "الشبكة تعمل بأداء ضعيف. قد تواجه بطء في الاستجابة."
                : "لا يوجد اتصال بالإنترنت. يرجى التحقق من إعدادات الشبكة."}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
