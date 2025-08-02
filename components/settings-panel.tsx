"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Bell, Users, Database, Brain, Save, RefreshCw } from "lucide-react"

export default function SettingsPanel() {
  const [riskThreshold, setRiskThreshold] = useState(75)
  const [autoBlock, setAutoBlock] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  const systemSettings = [
    {
      category: "نموذج الذكاء الاصطناعي",
      icon: Brain,
      settings: [
        { name: "حد الخطر للتنبيه", value: riskThreshold, type: "slider", min: 0, max: 100 },
        { name: "إعادة تدريب النموذج", value: "أسبوعياً", type: "select" },
        { name: "دقة النموذج الحالية", value: "94.2%", type: "display" },
      ],
    },
    {
      category: "التنبيهات والإشعارات",
      icon: Bell,
      settings: [
        { name: "إشعارات البريد الإلكتروني", value: emailNotifications, type: "toggle" },
        { name: "إشعارات الرسائل النصية", value: smsNotifications, type: "toggle" },
        { name: "تنبيهات فورية للمخاطر العالية", value: true, type: "toggle" },
      ],
    },
    {
      category: "الأمان والحماية",
      icon: Shield,
      settings: [
        { name: "الحظر التلقائي للحسابات المشبوهة", value: autoBlock, type: "toggle" },
        { name: "مدة انتظار قبل الحظر", value: "5 دقائق", type: "select" },
        { name: "مستوى التشفير", value: "AES-256", type: "display" },
      ],
    },
  ]

  const userRoles = [
    { name: "أحمد محمد", role: "محلل أمني", permissions: ["عرض", "تحليل", "تنبيه"], status: "نشط" },
    { name: "فاطمة علي", role: "مدير أمني", permissions: ["عرض", "تحليل", "تنبيه", "إدارة"], status: "نشط" },
    { name: "محمد سالم", role: "مراجع", permissions: ["عرض", "تحليل"], status: "غير نشط" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">إعدادات النظام</h1>
        <p className="text-gray-600">تخصيص وإدارة إعدادات منصة تحصين</p>
      </div>

      {/* System Settings */}
      <div className="space-y-6">
        {systemSettings.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="w-5 h-5" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.settings.map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <label className="font-medium">{setting.name}</label>
                    <div className="flex items-center gap-2">
                      {setting.type === "toggle" && (
                        <Switch
                          checked={setting.value as boolean}
                          onCheckedChange={(checked) => {
                            if (setting.name.includes("البريد الإلكتروني")) {
                              setEmailNotifications(checked)
                            } else if (setting.name.includes("الرسائل النصية")) {
                              setSmsNotifications(checked)
                            } else if (setting.name.includes("الحظر التلقائي")) {
                              setAutoBlock(checked)
                            }
                          }}
                        />
                      )}
                      {setting.type === "slider" && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="range"
                            min={setting.min}
                            max={setting.max}
                            value={setting.value as number}
                            onChange={(e) => setRiskThreshold(Number(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-sm font-medium w-12">{setting.value}%</span>
                        </div>
                      )}
                      {setting.type === "select" && (
                        <select className="border rounded px-3 py-1 text-sm">
                          <option>{setting.value as string}</option>
                        </select>
                      )}
                      {setting.type === "display" && <Badge variant="secondary">{setting.value as string}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            إدارة المستخدمين والصلاحيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-medium">الاسم</th>
                  <th className="text-right p-3 font-medium">الدور</th>
                  <th className="text-right p-3 font-medium">الصلاحيات</th>
                  <th className="text-right p-3 font-medium">الحالة</th>
                  <th className="text-right p-3 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {userRoles.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((permission, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={user.status === "نشط" ? "secondary" : "outline"}>{user.status}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          تعديل
                        </Button>
                        <Button size="sm" variant="outline">
                          حذف
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Button className="gap-2">
              <Users className="w-4 h-4" />
              إضافة مستخدم جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            حالة النظام والأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
              <div className="text-sm text-gray-600">وقت التشغيل</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">1.2ms</div>
              <div className="text-sm text-gray-600">زمن الاستجابة</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">94.2%</div>
              <div className="text-sm text-gray-600">دقة النموذج</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">2.1GB</div>
              <div className="text-sm text-gray-600">استخدام الذاكرة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          حفظ الإعدادات
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className="w-4 h-4" />
          إعادة تحميل النظام
        </Button>
      </div>
    </div>
  )
}
