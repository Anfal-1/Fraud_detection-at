"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, AlertTriangle, Shield, DollarSign, Users, Activity, RefreshCw } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data
const transactionData = [
  { name: "يناير", approved: 4000, flagged: 240, rejected: 100 },
  { name: "فبراير", approved: 3000, flagged: 139, rejected: 80 },
  { name: "مارس", approved: 2000, flagged: 980, rejected: 120 },
  { name: "أبريل", approved: 2780, flagged: 390, rejected: 90 },
  { name: "مايو", approved: 1890, flagged: 480, rejected: 110 },
  { name: "يونيو", approved: 2390, flagged: 380, rejected: 85 },
]

const riskData = [
  { name: "منخفض", value: 65, color: "#10b981" },
  { name: "متوسط", value: 25, color: "#f59e0b" },
  { name: "عالي", value: 10, color: "#ef4444" },
]

export default function MainDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [realTimeData, setRealTimeData] = useState({
    totalTransactions: 125847,
    approvedTransactions: 118234,
    flaggedTransactions: 5892,
    rejectedTransactions: 1721,
    totalAmount: 45678900,
    riskScore: 23,
    activeUsers: 8934,
    systemHealth: 98.5,
  })

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 10),
        approvedTransactions: prev.approvedTransactions + Math.floor(Math.random() * 8),
        flaggedTransactions: prev.flaggedTransactions + Math.floor(Math.random() * 2),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
      }))
      setLastUpdate(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    setLastUpdate(new Date())
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-arabic-display">لوحة التحكم الرئيسية</h1>
          <p className="text-muted-foreground font-arabic-body">آخر تحديث: {lastUpdate.toLocaleTimeString("ar-SA")}</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="font-arabic-body">
          <RefreshCw className={`h-4 w-4 ml-2 ${isRefreshing ? "animate-spin" : ""}`} />
          تحديث البيانات
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="responsive-grid">
        <Card className="gpu-accelerated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-arabic-body">إجمالي المعاملات</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.totalTransactions.toLocaleString("ar-SA")}</div>
            <p className="text-xs text-muted-foreground font-arabic-body">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 ml-1" />
                +12.5%
              </span>
              من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="gpu-accelerated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-arabic-body">المعاملات المعتمدة</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {realTimeData.approvedTransactions.toLocaleString("ar-SA")}
            </div>
            <p className="text-xs text-muted-foreground font-arabic-body">
              {((realTimeData.approvedTransactions / realTimeData.totalTransactions) * 100).toFixed(1)}% من الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card className="gpu-accelerated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-arabic-body">المعاملات المشبوهة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {realTimeData.flaggedTransactions.toLocaleString("ar-SA")}
            </div>
            <p className="text-xs text-muted-foreground font-arabic-body">
              {((realTimeData.flaggedTransactions / realTimeData.totalTransactions) * 100).toFixed(1)}% من الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card className="gpu-accelerated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-arabic-body">إجمالي المبلغ</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(realTimeData.totalAmount / 1000000).toFixed(1)}M ر.س</div>
            <p className="text-xs text-muted-foreground font-arabic-body">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 ml-1" />
                +8.2%
              </span>
              من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Trends */}
        <Card className="gpu-accelerated">
          <CardHeader>
            <CardTitle className="font-arabic-display">اتجاهات المعاملات</CardTitle>
            <CardDescription className="font-arabic-body">تحليل المعاملات خلال الأشهر الستة الماضية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="معتمدة" />
                  <Line type="monotone" dataKey="flagged" stroke="#f59e0b" strokeWidth={2} name="مشبوهة" />
                  <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="مرفوضة" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="gpu-accelerated">
          <CardHeader>
            <CardTitle className="font-arabic-display">توزيع المخاطر</CardTitle>
            <CardDescription className="font-arabic-body">تصنيف المعاملات حسب مستوى المخاطر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 space-x-reverse mt-4">
              {riskData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-arabic-body">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="gpu-accelerated">
          <CardHeader>
            <CardTitle className="text-lg font-arabic-display">صحة النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-arabic-body">الأداء العام</span>
                <Badge variant="default">{realTimeData.systemHealth.toFixed(1)}%</Badge>
              </div>
              <Progress value={realTimeData.systemHealth} className="h-2" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-arabic-body">
                  <span>وقت الاستجابة</span>
                  <span className="text-green-600">23ms</span>
                </div>
                <div className="flex justify-between font-arabic-body">
                  <span>استخدام الذاكرة</span>
                  <span className="text-yellow-600">67%</span>
                </div>
                <div className="flex justify-between font-arabic-body">
                  <span>استخدام المعالج</span>
                  <span className="text-green-600">34%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gpu-accelerated">
          <CardHeader>
            <CardTitle className="text-lg font-arabic-display">المستخدمون النشطون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{realTimeData.activeUsers.toLocaleString("ar-SA")}</div>
                  <div className="text-sm text-muted-foreground font-arabic-body">مستخدم نشط</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-arabic-body">
                  <span>جلسات جديدة</span>
                  <span>+234</span>
                </div>
                <div className="flex justify-between font-arabic-body">
                  <span>متوسط الجلسة</span>
                  <span>12 دقيقة</span>
                </div>
                <div className="flex justify-between font-arabic-body">
                  <span>معدل الارتداد</span>
                  <span>23%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gpu-accelerated">
          <CardHeader>
            <CardTitle className="text-lg font-arabic-display">نقاط المخاطر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{realTimeData.riskScore}</div>
                  <div className="text-sm text-muted-foreground font-arabic-body">نقطة مخاطر</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-arabic-body">
                  <span>تنبيهات عالية</span>
                  <span className="text-red-600">3</span>
                </div>
                <div className="flex justify-between font-arabic-body">
                  <span>تنبيهات متوسطة</span>
                  <span className="text-yellow-600">12</span>
                </div>
                <div className="flex justify-between font-arabic-body">
                  <span>تنبيهات منخفضة</span>
                  <span className="text-green-600">8</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
