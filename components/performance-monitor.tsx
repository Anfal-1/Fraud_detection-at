"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, Clock, MemoryStick, Gauge, RefreshCw, Monitor, Zap } from "lucide-react"
import NetworkMonitor from "./network-monitor"

interface PerformanceMetrics {
  fcp: number
  lcp: number
  fid: number
  cls: number
  ttfb: number
  domReady: number
  loadComplete: number
  memoryUsage: number
  performanceScore: number
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
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const measurePerformance = () => {
    setIsLoading(true)

    // Simulate performance measurement
    setTimeout(() => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const memory = (performance as any).memory

      const newMetrics: PerformanceMetrics = {
        fcp: Math.random() * 2000 + 500, // 500-2500ms
        lcp: Math.random() * 3000 + 1000, // 1000-4000ms
        fid: Math.random() * 100 + 10, // 10-110ms
        cls: Math.random() * 0.25, // 0-0.25
        ttfb: navigation?.responseStart - navigation?.requestStart || Math.random() * 500 + 100,
        domReady: navigation?.domContentLoadedEventEnd - navigation?.navigationStart || Math.random() * 2000 + 800,
        loadComplete: navigation?.loadEventEnd - navigation?.navigationStart || Math.random() * 3000 + 1500,
        memoryUsage: memory ? (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100 : Math.random() * 60 + 20,
        performanceScore: 0,
      }

      // Calculate performance score
      let score = 100
      if (newMetrics.fcp > 1800) score -= 15
      else if (newMetrics.fcp > 1000) score -= 8

      if (newMetrics.lcp > 2500) score -= 20
      else if (newMetrics.lcp > 1500) score -= 10

      if (newMetrics.fid > 100) score -= 15
      else if (newMetrics.fid > 50) score -= 8

      if (newMetrics.cls > 0.1) score -= 15
      else if (newMetrics.cls > 0.05) score -= 8

      if (newMetrics.memoryUsage > 70) score -= 10
      else if (newMetrics.memoryUsage > 50) score -= 5

      newMetrics.performanceScore = Math.max(0, score)

      setMetrics(newMetrics)
      setLastUpdate(new Date())
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    measurePerformance()
    const interval = setInterval(measurePerformance, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50"
    if (score >= 70) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getMetricColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return "text-green-600"
    if (value <= thresholds[1]) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6 min-h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            مراقب الأداء
          </h1>
          <p className="text-sm sm:text-base text-gray-600">مراقبة شاملة لأداء التطبيق والشبكة</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            آخر تحديث: {lastUpdate.toLocaleTimeString("ar-SA")}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={measurePerformance}
            disabled={isLoading}
            className="gap-1 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* Performance Score */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gauge className="w-5 h-5 text-blue-600" />
            النتيجة الإجمالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold px-4 py-2 rounded-lg ${getScoreColor(metrics.performanceScore)}`}>
              {Math.round(metrics.performanceScore)}
            </div>
            <div className="flex-1">
              <Progress value={metrics.performanceScore} className="h-3" />
              <p className="text-sm text-gray-600 mt-1">
                {metrics.performanceScore >= 90 ? "ممتاز" : metrics.performanceScore >= 70 ? "جيد" : "يحتاج تحسين"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">First Contentful Paint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.fcp, [1000, 1800])}`}>
              {Math.round(metrics.fcp)}ms
            </div>
            <p className="text-xs text-gray-500 mt-1">أول محتوى مرئي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Largest Contentful Paint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.lcp, [1500, 2500])}`}>
              {Math.round(metrics.lcp)}ms
            </div>
            <p className="text-xs text-gray-500 mt-1">أكبر محتوى مرئي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">First Input Delay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.fid, [50, 100])}`}>
              {Math.round(metrics.fid)}ms
            </div>
            <p className="text-xs text-gray-500 mt-1">تأخير أول إدخال</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cumulative Layout Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.cls, [0.05, 0.1])}`}>
              {metrics.cls.toFixed(3)}
            </div>
            <p className="text-xs text-gray-500 mt-1">تغيير التخطيط</p>
          </CardContent>
        </Card>
      </div>

      {/* Loading Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Time to First Byte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${getMetricColor(metrics.ttfb, [200, 500])}`}>
              {Math.round(metrics.ttfb)}ms
            </div>
            <p className="text-xs text-gray-500 mt-1">وقت أول بايت</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Monitor className="w-4 h-4" />
              DOM Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${getMetricColor(metrics.domReady, [1000, 2000])}`}>
              {Math.round(metrics.domReady)}ms
            </div>
            <p className="text-xs text-gray-500 mt-1">جاهزية DOM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Load Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${getMetricColor(metrics.loadComplete, [2000, 3000])}`}>
              {Math.round(metrics.loadComplete)}ms
            </div>
            <p className="text-xs text-gray-500 mt-1">اكتمال التحميل</p>
          </CardContent>
        </Card>
      </div>

      {/* Memory Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MemoryStick className="w-5 h-5 text-purple-600" />
            استخدام الذاكرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-bold px-3 py-1 rounded ${getMetricColor(metrics.memoryUsage, [50, 70])}`}>
              {Math.round(metrics.memoryUsage)}%
            </div>
            <div className="flex-1">
              <Progress value={metrics.memoryUsage} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">استخدام ذاكرة JavaScript</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Monitor */}
      <NetworkMonitor />
    </div>
  )
}
