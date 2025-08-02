"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle, MapPin, Clock, DollarSign, User, CheckCircle, XCircle, Flag } from "lucide-react"

interface Transaction {
  id: string
  userId: string
  amount: number
  type: string
  status: "آمنة" | "مشبوهة" | "قيد المراجعة"
  riskScore: number
  timestamp: string
  location: string
}

interface TransactionDetailsProps {
  transaction: Transaction | null
  onBack: () => void
}

export default function TransactionDetails({ transaction, onBack }: TransactionDetailsProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  const riskFactors = [
    { factor: "مبلغ غير عادي", severity: "عالي", score: 35 },
    { factor: "وقت غير اعتيادي", severity: "متوسط", score: 25 },
    { factor: "موقع جديد", severity: "متوسط", score: 20 },
    { factor: "تكرار المعاملات", severity: "منخفض", score: 15 },
  ]

  const userBehavior = [
    { metric: "متوسط المعاملات الشهرية", current: "50,000 ريال", normal: "15,000 ريال", status: "غير طبيعي" },
    { metric: "عدد المعاملات اليومية", current: "8", normal: "2-3", status: "غير طبيعي" },
    { metric: "أوقات النشاط", current: "02:30 ص", normal: "09:00-17:00", status: "غير طبيعي" },
    { metric: "المواقع المعتادة", current: "الرياض", normal: "جدة", status: "جديد" },
  ]

  // بيانات الرسم البياني
  const chartData = {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
    normalBehavior: [15000, 16000, 14500, 15500, 16200, 15800],
    currentBehavior: [15200, 16500, 25000, 35000, 45000, 50000],
  }

  // رسم المخطط البياني
  const drawChart = () => {
    const canvas = chartRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // تنظيف الكانفاس
    ctx.clearRect(0, 0, width, height)

    // إعداد المقاييس
    const maxValue = Math.max(...chartData.normalBehavior, ...chartData.currentBehavior)
    const xStep = (width - 2 * padding) / (chartData.labels.length - 1)
    const yScale = (height - 2 * padding) / maxValue

    // رسم الخطوط الشبكية
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 5
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // رسم خط السلوك الطبيعي
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.beginPath()
    chartData.normalBehavior.forEach((value, index) => {
      const x = padding + index * xStep
      const y = height - padding - value * yScale
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // رسم خط السلوك الحالي
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 3
    ctx.beginPath()
    chartData.currentBehavior.forEach((value, index) => {
      const x = padding + index * xStep
      const y = height - padding - value * yScale
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // رسم النقاط
    chartData.normalBehavior.forEach((value, index) => {
      const x = padding + index * xStep
      const y = height - padding - value * yScale
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    chartData.currentBehavior.forEach((value, index) => {
      const x = padding + index * xStep
      const y = height - padding - value * yScale
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // رسم التسميات
    ctx.fillStyle = "#374151"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    chartData.labels.forEach((label, index) => {
      const x = padding + index * xStep
      ctx.fillText(label, x, height - 10)
    })
  }

  useEffect(() => {
    drawChart()
  }, [])

  if (!transaction) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">لم يتم اختيار معاملة</p>
          <Button onClick={onBack} className="mt-4">
            العودة للقائمة
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          العودة
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تفاصيل المعاملة</h1>
          <p className="text-gray-600">تحليل شامل للمعاملة المشبوهة</p>
        </div>
      </div>

      {/* Transaction Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              معلومات المعاملة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">رقم المعاملة</label>
                <p className="font-mono text-lg">{transaction.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">المستخدم</label>
                <p className="text-lg">{transaction.userId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">المبلغ</label>
                <p className="text-2xl font-bold text-green-600">{transaction.amount.toLocaleString()} ريال</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">نوع المعاملة</label>
                <p className="text-lg">{transaction.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">الموقع</label>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p>{transaction.location}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">التوقيت</label>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p>{new Date(transaction.timestamp).toLocaleString("ar-SA")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              تقييم المخاطر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-red-600 mb-2">{transaction.riskScore}%</div>
              <Badge variant="destructive" className="text-sm">
                خطر عالي
              </Badge>
            </div>
            <div className="space-y-3">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{factor.factor}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">{factor.score}%</span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        factor.severity === "عالي"
                          ? "bg-red-500"
                          : factor.severity === "متوسط"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Behavior Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            تحليل سلوك المستخدم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-medium">المؤشر</th>
                  <th className="text-right p-3 font-medium">القيمة الحالية</th>
                  <th className="text-right p-3 font-medium">القيمة الطبيعية</th>
                  <th className="text-right p-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {userBehavior.map((behavior, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium">{behavior.metric}</td>
                    <td className="p-3">{behavior.current}</td>
                    <td className="p-3 text-gray-600">{behavior.normal}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          behavior.status === "غير طبيعي"
                            ? "destructive"
                            : behavior.status === "جديد"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {behavior.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Behavior Chart */}
      <Card>
        <CardHeader>
          <CardTitle>رسم بياني لسلوك المستخدم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg p-4">
            <canvas ref={chartRef} width={600} height={300} className="w-full max-w-full" />
            <div className="mt-4 flex justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">السلوك الطبيعي</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">السلوك الحالي</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات المعاملة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2 bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4" />
              تأكيد آمنة
            </Button>
            <Button variant="destructive" className="gap-2">
              <XCircle className="w-4 h-4" />
              تأكيد مشبوهة
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Flag className="w-4 h-4" />
              تصعيد للإدارة
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <User className="w-4 h-4" />
              حظر المستخدم مؤقتاً
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
