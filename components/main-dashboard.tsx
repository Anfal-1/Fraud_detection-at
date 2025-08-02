"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Users, Activity, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export default function MainDashboard() {
  const stats = [
    {
      title: "إجمالي المعاملات اليوم",
      value: "12,847",
      change: "+12%",
      trend: "up",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "المعاملات المشبوهة",
      value: "23",
      change: "-8%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "المبلغ المحمي",
      value: "2.4M ريال",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "المستخدمين النشطين",
      value: "8,432",
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  const recentAlerts = [
    {
      id: 1,
      type: "عالية",
      message: "معاملة مشبوهة بقيمة 50,000 ريال",
      time: "10:30 ص",
      status: "جديد",
    },
    {
      id: 2,
      type: "متوسطة",
      message: "نشاط غير عادي في الحساب #4521",
      time: "09:45 ص",
      status: "قيد المراجعة",
    },
    {
      id: 3,
      type: "منخفضة",
      message: "تسجيل دخول من موقع جديد",
      time: "09:15 ص",
      status: "مكتمل",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم الرئيسية</h1>
        <p className="text-gray-600 text-lg">نظرة شاملة على حالة النظام ونشاط كشف الاحتيال اليوم</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TooltipProvider>
          {stats.map((stat, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                        <div className="flex items-center gap-1">
                          {stat.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                          >
                            {stat.change}
                          </span>
                          <span className="text-xs text-gray-500">مقارنة بالأمس</span>
                        </div>
                      </div>
                      <div className={`p-4 rounded-full bg-gray-50 ${stat.color}`}>
                        <stat.icon className="w-7 h-7" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {stat.title} - {stat.change} مقارنة بالأمس
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>النشاط المباشر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">رسم بياني للمعاملات المباشرة</p>
                <div className="mt-4 flex justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">معاملات آمنة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">معاملات مشبوهة</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>التنبيهات الأخيرة</span>
              <Badge variant="destructive" className="animate-pulse">
                {recentAlerts.filter((a) => a.status === "جديد").length} جديد
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors hover:bg-gray-50 ${
                    alert.status === "جديد" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-full ${
                      alert.type === "عالية" ? "bg-red-100" : alert.type === "متوسطة" ? "bg-yellow-100" : "bg-green-100"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        alert.type === "عالية"
                          ? "text-red-600"
                          : alert.type === "متوسطة"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">{alert.message}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </span>
                      <Badge
                        variant={
                          alert.status === "جديد"
                            ? "destructive"
                            : alert.status === "قيد المراجعة"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              عرض جميع التنبيهات
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>حالة النظام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">نموذج التحليل</p>
                <p className="text-sm text-gray-600">يعمل بشكل طبيعي</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">قاعدة البيانات</p>
                <p className="text-sm text-gray-600">متصلة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">نظام التنبيهات</p>
                <p className="text-sm text-gray-600">نشط</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
