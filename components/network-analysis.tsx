"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Network, Users, AlertTriangle, Search } from "lucide-react"

interface NetworkNode {
  id: string
  label: string
  type: "primary" | "connected" | "secondary"
  x: number
  y: number
  radius: number
  color: string
}

interface NetworkLink {
  source: string
  target: string
  color: string
}

export default function NetworkAnalysis() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationFrame, setAnimationFrame] = useState<number | null>(null)

  const suspiciousNetworks = [
    {
      id: "NET001",
      accounts: ["USR4521", "USR7832", "USR9341"],
      riskScore: 92,
      pattern: "تحويلات دائرية",
      totalAmount: 250000,
      status: "نشط",
    },
    {
      id: "NET002",
      accounts: ["USR1234", "USR5678"],
      riskScore: 78,
      pattern: "معاملات متزامنة",
      totalAmount: 150000,
      status: "قيد المراجعة",
    },
    {
      id: "NET003",
      accounts: ["USR9999", "USR8888", "USR7777", "USR6666"],
      riskScore: 85,
      pattern: "شبكة توزيع",
      totalAmount: 500000,
      status: "مشبوه",
    },
  ]

  const networkStats = [
    { label: "الشبكات المكتشفة", value: "12", change: "+3" },
    { label: "الحسابات المتورطة", value: "47", change: "+8" },
    { label: "إجمالي المبالغ المشبوهة", value: "2.1M ريال", change: "+15%" },
    { label: "الأنماط المحددة", value: "5", change: "+1" },
  ]

  // بيانات الشبكة
  const networkNodes: NetworkNode[] = [
    { id: "USR4521", label: "USR4521", type: "primary", x: 200, y: 150, radius: 25, color: "#ef4444" },
    { id: "USR7832", label: "USR7832", type: "connected", x: 200, y: 50, radius: 18, color: "#eab308" },
    { id: "USR9341", label: "USR9341", type: "connected", x: 200, y: 250, radius: 18, color: "#eab308" },
    { id: "USR1234", label: "USR1234", type: "secondary", x: 100, y: 150, radius: 15, color: "#f97316" },
    { id: "USR5678", label: "USR5678", type: "secondary", x: 300, y: 150, radius: 15, color: "#f97316" },
  ]

  const networkLinks: NetworkLink[] = [
    { source: "USR4521", target: "USR7832", color: "#ef4444" },
    { source: "USR4521", target: "USR9341", color: "#ef4444" },
    { source: "USR4521", target: "USR1234", color: "#f97316" },
    { source: "USR4521", target: "USR5678", color: "#f97316" },
  ]

  // رسم الشبكة
  const drawNetwork = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // تنظيف الكانفاس
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // رسم الخطوط
    networkLinks.forEach((link) => {
      const sourceNode = networkNodes.find((n) => n.id === link.source)
      const targetNode = networkNodes.find((n) => n.id === link.target)

      if (sourceNode && targetNode) {
        ctx.beginPath()
        ctx.moveTo(sourceNode.x, sourceNode.y)
        ctx.lineTo(targetNode.x, targetNode.y)
        ctx.strokeStyle = link.color
        ctx.lineWidth = 3
        ctx.stroke()
      }
    })

    // رسم العقد
    networkNodes.forEach((node) => {
      // رسم الدائرة
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
      ctx.fillStyle = node.color
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()

      // رسم النص
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.label, node.x, node.y)
    })
  }

  // تحديث الرسم
  useEffect(() => {
    const animate = () => {
      drawNetwork()
      setAnimationFrame(requestAnimationFrame(animate))
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">تحليل العلاقات والشبكات</h1>
        <p className="text-gray-600">كشف الأنماط المخفية والعلاقات المشبوهة بين الحسابات</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {networkStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <span className="text-xs text-green-600">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Network Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            خريطة الشبكة التفاعلية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ height: "400px" }}>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="absolute inset-0 m-auto"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">حساب مشبوه رئيسي</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">حساب مرتبط</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm">حساب ثانوي</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suspicious Networks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            الشبكات المشبوهة المكتشفة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suspiciousNetworks.map((network) => (
              <div key={network.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{network.id}</h3>
                    <p className="text-gray-600">{network.pattern}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 mb-1">{network.riskScore}%</div>
                    <Badge
                      variant={
                        network.status === "نشط" ? "destructive" : network.status === "مشبوه" ? "default" : "secondary"
                      }
                    >
                      {network.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">الحسابات المتورطة</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {network.accounts.map((account, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {account}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">إجمالي المبلغ</label>
                    <p className="font-semibold text-lg">{network.totalAmount.toLocaleString()} ريال</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">نمط النشاط</label>
                    <p className="font-medium">{network.pattern}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                    <Search className="w-4 h-4" />
                    تحليل تفصيلي
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                    <Users className="w-4 h-4" />
                    عرض الحسابات
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    إجراء فوري
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pattern Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>أنماط الاحتيال المكتشفة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span>تحويلات دائرية</span>
                <Badge variant="destructive">5 شبكات</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span>معاملات متزامنة</span>
                <Badge variant="default">3 شبكات</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span>شبكات توزيع</span>
                <Badge variant="default">2 شبكات</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span>حسابات وهمية</span>
                <Badge variant="secondary">1 شبكة</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات الشبكة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">معدل الكشف</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">دقة التحليل</span>
                  <span className="text-sm font-medium">89%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "89%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">سرعة المعالجة</span>
                  <span className="text-sm font-medium">97%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "97%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
