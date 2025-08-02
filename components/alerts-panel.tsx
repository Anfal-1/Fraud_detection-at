"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Eye,
  X,
  User,
  MapPin,
  DollarSign,
} from "lucide-react"

interface Alert {
  id: string
  type: "عالية" | "متوسطة" | "منخفضة"
  title: string
  description: string
  timestamp: string
  status: "جديد" | "قيد المراجعة" | "مكتمل" | "مرفوض"
  transactionId?: string
  userId?: string
  location?: string
  amount?: number
  details?: {
    riskFactors: string[]
    affectedSystems: string[]
    recommendedActions: string[]
  }
}

export default function AlertsPanel() {
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "ALT001",
      type: "عالية",
      title: "معاملة مشبوهة بقيمة عالية",
      description: "تم رصد معاملة تحويل بقيمة 50,000 ريال في وقت غير اعتيادي",
      timestamp: "2024-01-15 10:30:00",
      status: "جديد",
      transactionId: "TXN001",
      userId: "USR4521",
      location: "الرياض",
      amount: 50000,
      details: {
        riskFactors: ["مبلغ عالي غير اعتيادي", "وقت غير طبيعي (02:30 ص)", "موقع جديد"],
        affectedSystems: ["نظام التحويلات", "نظام مراقبة المخاطر"],
        recommendedActions: ["حظر الحساب مؤقتاً", "التواصل مع العميل", "مراجعة يدوية فورية"],
      },
    },
    {
      id: "ALT002",
      type: "متوسطة",
      title: "نشاط غير عادي في الحساب",
      description: "تم رصد 8 معاملات متتالية خلال ساعة واحدة",
      timestamp: "2024-01-15 09:45:00",
      status: "قيد المراجعة",
      transactionId: "TXN003",
      userId: "USR9341",
      location: "جدة",
      amount: 25000,
      details: {
        riskFactors: ["تكرار معاملات عالي", "نمط غير اعتيادي"],
        affectedSystems: ["نظام مراقبة السلوك"],
        recommendedActions: ["مراقبة إضافية", "تحليل النمط"],
      },
    },
    {
      id: "ALT003",
      type: "عالية",
      title: "شبكة احتيال محتملة",
      description: "تم اكتشاف تحويلات دائرية بين 3 حسابات",
      timestamp: "2024-01-15 09:30:00",
      status: "جديد",
      userId: "USR4521",
      location: "الدمام",
      amount: 75000,
      details: {
        riskFactors: ["تحويلات دائرية", "حسابات مترابطة", "مبالغ متطابقة"],
        affectedSystems: ["نظام تحليل الشبكات", "نظام مكافحة غسيل الأموال"],
        recommendedActions: ["تجميد الحسابات", "إبلاغ السلطات", "تحقيق شامل"],
      },
    },
    {
      id: "ALT004",
      type: "منخفضة",
      title: "تسجيل دخول من موقع جديد",
      description: "تم تسجيل الدخول من الدمام بدلاً من الرياض المعتاد",
      timestamp: "2024-01-15 09:15:00",
      status: "مكتمل",
      userId: "USR1234",
      location: "الدمام",
      details: {
        riskFactors: ["موقع جديد"],
        affectedSystems: ["نظام المصادقة"],
        recommendedActions: ["تأكيد الهوية", "إرسال تنبيه للعميل"],
      },
    },
    {
      id: "ALT005",
      type: "متوسطة",
      title: "تغيير في نمط الإنفاق",
      description: "زيادة 300% في متوسط قيمة المعاملات الأسبوعية",
      timestamp: "2024-01-15 08:45:00",
      status: "قيد المراجعة",
      userId: "USR7832",
      location: "مكة",
      amount: 15000,
      details: {
        riskFactors: ["تغيير نمط الإنفاق", "زيادة كبيرة في القيم"],
        affectedSystems: ["نظام تحليل السلوك"],
        recommendedActions: ["مراجعة تفصيلية", "تحليل التاريخ المالي"],
      },
    },
  ])

  const filteredAlerts = alerts.filter((alert) => {
    const matchesType = filterType === "all" || alert.type === filterType
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    return matchesType && matchesStatus
  })

  const updateAlertStatus = (alertId: string, newStatus: Alert["status"]) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => (alert.id === alertId ? { ...alert, status: newStatus } : alert)),
    )

    // عرض إشعار
    const statusText = newStatus === "مكتمل" ? "تم قبول" : newStatus === "مرفوض" ? "تم رفض" : "تم تحديث"
    setNotification(`${statusText} التنبيه ${alertId} بنجاح`)

    // إخفاء الإشعار بعد 3 ثوان
    setTimeout(() => setNotification(null), 3000)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "عالية":
        return "destructive"
      case "متوسطة":
        return "default"
      case "منخفضة":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد":
        return "destructive"
      case "قيد المراجعة":
        return "default"
      case "مكتمل":
        return "secondary"
      case "مرفوض":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "عالية":
        return <AlertTriangle className="w-4 h-4" />
      case "متوسطة":
        return <Clock className="w-4 h-4" />
      case "منخفضة":
        return <Bell className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const alertStats = [
    { label: "تنبيهات جديدة", value: alerts.filter((a) => a.status === "جديد").length, color: "text-red-600" },
    {
      label: "قيد المراجعة",
      value: alerts.filter((a) => a.status === "قيد المراجعة").length,
      color: "text-yellow-600",
    },
    { label: "مكتملة اليوم", value: alerts.filter((a) => a.status === "مكتمل").length, color: "text-green-600" },
    { label: "إجمالي التنبيهات", value: alerts.length, color: "text-blue-600" },
  ]

  const openAlertDetails = (alert: Alert) => {
    setSelectedAlert(alert)
    setIsDetailsOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:bg-green-600 rounded-full p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">مركز التنبيهات</h1>
        <p className="text-gray-600">إدارة ومتابعة جميع التنبيهات الأمنية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alertStats.map((stat, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-4">
              <div className="text-center">
                <p className={`text-2xl font-bold ${stat.color} transition-all duration-300`}>{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">فلترة حسب النوع:</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={filterType === "all" ? "default" : "outline"}
                  onClick={() => setFilterType("all")}
                  className="transition-all duration-200"
                >
                  الكل
                </Button>
                <Button
                  size="sm"
                  variant={filterType === "عالية" ? "destructive" : "outline"}
                  onClick={() => setFilterType("عالية")}
                  className="transition-all duration-200"
                >
                  عالية
                </Button>
                <Button
                  size="sm"
                  variant={filterType === "متوسطة" ? "default" : "outline"}
                  onClick={() => setFilterType("متوسطة")}
                  className="transition-all duration-200"
                >
                  متوسطة
                </Button>
                <Button
                  size="sm"
                  variant={filterType === "منخفضة" ? "secondary" : "outline"}
                  onClick={() => setFilterType("منخفضة")}
                  className="transition-all duration-200"
                >
                  منخفضة
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">الحالة:</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className="transition-all duration-200"
                >
                  الكل
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "جديد" ? "destructive" : "outline"}
                  onClick={() => setFilterStatus("جديد")}
                  className="transition-all duration-200"
                >
                  جديد
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "قيد المراجعة" ? "default" : "outline"}
                  onClick={() => setFilterStatus("قيد المراجعة")}
                  className="transition-all duration-200"
                >
                  قيد المراجعة
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "مكتمل" ? "secondary" : "outline"}
                  onClick={() => setFilterStatus("مكتمل")}
                  className="transition-all duration-200"
                >
                  مكتمل
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            التنبيهات ({filteredAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>لا توجد تنبيهات تطابق المرشحات المحددة</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 transition-all duration-300 hover:shadow-md ${
                    alert.status === "جديد"
                      ? "border-red-200 bg-red-50 animate-pulse"
                      : alert.status === "قيد المراجعة"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          alert.type === "عالية"
                            ? "bg-red-100 text-red-600"
                            : alert.type === "متوسطة"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                        <p className="text-gray-600 mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(alert.timestamp).toLocaleString("ar-SA")}</span>
                          {alert.transactionId && <span>معاملة: {alert.transactionId}</span>}
                          {alert.userId && <span>مستخدم: {alert.userId}</span>}
                          {alert.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {alert.location}
                            </span>
                          )}
                          {alert.amount && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {alert.amount.toLocaleString()} ريال
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={getTypeColor(alert.type)}>{alert.type}</Badge>
                      <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 bg-transparent transition-all duration-200 hover:bg-blue-50"
                      onClick={() => openAlertDetails(alert)}
                    >
                      <Eye className="w-4 h-4" />
                      عرض التفاصيل
                    </Button>
                    {alert.status === "جديد" && (
                      <>
                        <Button
                          size="sm"
                          className="gap-1 bg-green-600 hover:bg-green-700 transition-all duration-200"
                          onClick={() => updateAlertStatus(alert.id, "مكتمل")}
                        >
                          <CheckCircle className="w-4 h-4" />
                          قبول
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1 transition-all duration-200"
                          onClick={() => updateAlertStatus(alert.id, "مرفوض")}
                        >
                          <XCircle className="w-4 h-4" />
                          رفض
                        </Button>
                      </>
                    )}
                    {alert.status === "قيد المراجعة" && (
                      <Button
                        size="sm"
                        className="gap-1 transition-all duration-200"
                        onClick={() => updateAlertStatus(alert.id, "مكتمل")}
                      >
                        <CheckCircle className="w-4 h-4" />
                        إكمال المراجعة
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alert Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              تفاصيل التنبيه: {selectedAlert?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">نوع التنبيه</label>
                  <div className="mt-1">
                    <Badge variant={getTypeColor(selectedAlert.type)}>{selectedAlert.type}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">الحالة</label>
                  <div className="mt-1">
                    <Badge variant={getStatusColor(selectedAlert.status)}>{selectedAlert.status}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">التوقيت</label>
                  <p className="mt-1">{new Date(selectedAlert.timestamp).toLocaleString("ar-SA")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">الموقع</label>
                  <p className="mt-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {selectedAlert.location || "غير محدد"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-600">الوصف</label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedAlert.description}</p>
              </div>

              {/* Transaction Details */}
              {(selectedAlert.transactionId || selectedAlert.userId || selectedAlert.amount) && (
                <div>
                  <label className="text-sm font-medium text-gray-600">تفاصيل المعاملة</label>
                  <div className="mt-1 grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    {selectedAlert.transactionId && (
                      <div>
                        <span className="text-xs text-gray-500">رقم المعاملة</span>
                        <p className="font-mono">{selectedAlert.transactionId}</p>
                      </div>
                    )}
                    {selectedAlert.userId && (
                      <div>
                        <span className="text-xs text-gray-500">المستخدم</span>
                        <p className="flex items-center gap-1">
                          <User className="w-4 h-4 text-gray-400" />
                          {selectedAlert.userId}
                        </p>
                      </div>
                    )}
                    {selectedAlert.amount && (
                      <div className="col-span-2">
                        <span className="text-xs text-gray-500">المبلغ</span>
                        <p className="text-lg font-bold text-green-600">
                          {selectedAlert.amount.toLocaleString()} ريال سعودي
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Risk Factors */}
              {selectedAlert.details?.riskFactors && (
                <div>
                  <label className="text-sm font-medium text-gray-600">عوامل الخطر</label>
                  <div className="mt-1 space-y-2">
                    {selectedAlert.details.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Affected Systems */}
              {selectedAlert.details?.affectedSystems && (
                <div>
                  <label className="text-sm font-medium text-gray-600">الأنظمة المتأثرة</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedAlert.details.affectedSystems.map((system, index) => (
                      <Badge key={index} variant="outline">
                        {system}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {selectedAlert.details?.recommendedActions && (
                <div>
                  <label className="text-sm font-medium text-gray-600">الإجراءات المقترحة</label>
                  <div className="mt-1 space-y-2">
                    {selectedAlert.details.recommendedActions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedAlert.status === "جديد" && (
                  <>
                    <Button
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        updateAlertStatus(selectedAlert.id, "مكتمل")
                        setIsDetailsOpen(false)
                      }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      قبول التنبيه
                    </Button>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      onClick={() => {
                        updateAlertStatus(selectedAlert.id, "مرفوض")
                        setIsDetailsOpen(false)
                      }}
                    >
                      <XCircle className="w-4 h-4" />
                      رفض التنبيه
                    </Button>
                  </>
                )}
                {selectedAlert.status === "قيد المراجعة" && (
                  <Button
                    className="gap-2"
                    onClick={() => {
                      updateAlertStatus(selectedAlert.id, "مكتمل")
                      setIsDetailsOpen(false)
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    إكمال المراجعة
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="bg-transparent">
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
