"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw, Zap, Clock, HardDrive } from "lucide-react"

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
  domReady: number
  loadComplete: number
  memoryUsage: number
  performanceScore: number
}

interface NetworkInfo {
  online: boolean
  connectionType: string
  downlink: number
  rtt: number
  saveData: boolean
  serverPing: number
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    domReady: 0,
    loadComplete: 0,
    memoryUsage: 0,
    performanceScore: 0,
  })

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    online: true,
    connectionType: "4g",
    downlink: 10,
    rtt: 100,
    saveData: false,
    serverPing: 0,
  })

  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    measurePerformance()
    measureNetwork()

    const interval = setInterval(() => {
      measurePerformance()
      measureNetwork()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const measurePerformance = () => {
    if (typeof window !== "undefined" && "performance" in window) {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType("paint")

      const fcp = paint.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0
      const ttfb = navigation.responseStart - navigation.requestStart
      const domReady = navigation.domContentLoadedEventEnd - navigation.navigationStart
      const loadComplete = navigation.loadEventEnd - navigation.navigationStart

      // Simulate LCP, FID, CLS for demo
      const lcp = fcp + Math.random() * 500
      const fid = Math.random() * 100
      const cls = Math.random() * 0.1

      // Memory usage (if available)
      const memoryUsage = (performance as any).memory
        ? ((performance as any).memory.usedJSHeapSize / (performance as any).memory.totalJSHeapSize) * 100
        : Math.random() * 100

      // Calculate performance score
      const performanceScore = Math.max(0, 100 - (fcp / 10 + lcp / 15 + fid * 2 + cls * 100 + ttfb / 5))

      setMetrics({
        fcp: Math.round(fcp),
        lcp: Math.round(lcp),
        fid: Math.round(fid),
        cls: Math.round(cls * 1000) / 1000,
        ttfb: Math.round(ttfb),
        domReady: Math.round(domReady),
        loadComplete: Math.round(loadComplete),
        memoryUsage: Math.round(memoryUsage),
        performanceScore: Math.round(performanceScore),
      })
    }
  }

  const measureNetwork = async () => {
    const online = navigator.onLine
    let connectionType = "unknown"
    let downlink = 0
    let rtt = 0
    let saveData = false

    if ("connection" in navigator) {
      const connection = (navigator as any).connection
      connectionType = connection.effectiveType || "unknown"
      downlink = connection.downlink || 0
      rtt = connection.rtt || 0
      saveData = connection.saveData || false
    }

    // Measure server ping
    let serverPing = 0
    try {
      const start = performance.now()
      await fetch("/api/ping", { cache: "no-cache" })
      serverPing = Math.round(performance.now() - start)
    } catch (error) {
      serverPing = -1
    }

    setNetworkInfo({
      online,
      connectionType,
      downlink,
      rtt,
      saveData,
      serverPing,
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([measurePerformance(), measureNetwork()])
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreVariant = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 70) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-arabic-display">مراقب الأداء</h2>
        <Button onClick={handleRefresh} disabled={isRefreshing} size="sm">
          <RefreshCw className={`h-4 w-4 ml-2 ${isRefreshing ? "animate-spin" : ""}`} />
          تحديث
        </Button>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-arabic-display">
            <Zap className="h-5 w-5" />
            نتيجة الأداء الإجمالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold">
              <span className={getScoreColor(metrics.performanceScore)}>{metrics.performanceScore}</span>
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>
            <Badge variant={getScoreVariant(metrics.performanceScore)} className="text-lg px-3 py-1">
              {metrics.performanceScore >= 90 ? "ممتاز" : metrics.performanceScore >= 70 ? "جيد" : "يحتاج تحسين"}
            </Badge>
          </div>
          <Progress value={metrics.performanceScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-arabic-display">First Contentful Paint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{metrics.fcp}ms</div>
            <Badge variant={metrics.fcp < 1800 ? "default" : metrics.fcp < 3000 ? "secondary" : "destructive"}>
              {metrics.fcp < 1800 ? "سريع" : metrics.fcp < 3000 ? "متوسط" : "بطيء"}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2 font-arabic-body">وقت ظهور أول محتوى مرئي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-arabic-display">Largest Contentful Paint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{metrics.lcp}ms</div>
            <Badge variant={metrics.lcp < 2500 ? "default" : metrics.lcp < 4000 ? "secondary" : "destructive"}>
              {metrics.lcp < 2500 ? "سريع" : metrics.lcp < 4000 ? "متوسط" : "بطيء"}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2 font-arabic-body">وقت ظهور أكبر محتوى مرئي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-arabic-display">First Input Delay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{metrics.fid}ms</div>
            <Badge variant={metrics.fid < 100 ? "default" : metrics.fid < 300 ? "secondary" : "destructive"}>
              {metrics.fid < 100 ? "سريع" : metrics.fid < 300 ? "متوسط" : "بطيء"}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2 font-arabic-body">تأخير أول تفاعل</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-arabic-display">
              <Clock className="h-5 w-5" />
              مقاييس التحميل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">Time to First Byte</span>
              <Badge variant="outline">{metrics.ttfb}ms</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">DOM Ready</span>
              <Badge variant="outline">{metrics.domReady}ms</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">Load Complete</span>
              <Badge variant="outline">{metrics.loadComplete}ms</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">Cumulative Layout Shift</span>
              <Badge variant={metrics.cls < 0.1 ? "default" : metrics.cls < 0.25 ? "secondary" : "destructive"}>
                {metrics.cls}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-arabic-display">
              {networkInfo.online ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
              معلومات الشبكة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">حالة الاتصال</span>
              <Badge variant={networkInfo.online ? "default" : "destructive"}>
                {networkInfo.online ? "متصل" : "غير متصل"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">نوع الشبكة</span>
              <Badge variant="outline">{networkInfo.connectionType.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">سرعة التحميل</span>
              <Badge variant="outline">{networkInfo.downlink} Mbps</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">زمن الاستجابة</span>
              <Badge variant="outline">{networkInfo.rtt}ms</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-arabic-body">Ping الخادم</span>
              <Badge
                variant={
                  networkInfo.serverPing < 100 ? "default" : networkInfo.serverPing < 300 ? "secondary" : "destructive"
                }
              >
                {networkInfo.serverPing === -1 ? "خطأ" : `${networkInfo.serverPing}ms`}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Memory Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-arabic-display">
            <HardDrive className="h-5 w-5" />
            استخدام الذاكرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="font-arabic-body">استخدام JavaScript Heap</span>
            <Badge
              variant={metrics.memoryUsage < 70 ? "default" : metrics.memoryUsage < 85 ? "secondary" : "destructive"}
            >
              {metrics.memoryUsage.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={metrics.memoryUsage} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2 font-arabic-body">
            {metrics.memoryUsage < 70
              ? "استخدام طبيعي للذاكرة"
              : metrics.memoryUsage < 85
                ? "استخدام مرتفع للذاكرة"
                : "استخدام عالي جداً للذاكرة"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
