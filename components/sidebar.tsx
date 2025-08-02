"use client"

import { Shield, BarChart3, List, Network, Brain, Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ActiveView } from "./dashboard"

export interface SidebarProps {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard" as ActiveView,
      label: "لوحة التحكم",
      icon: BarChart3,
      color: "text-blue-600",
    },
    {
      id: "transactions" as ActiveView,
      label: "قائمة المعاملات",
      icon: List,
      color: "text-green-600",
    },
    {
      id: "network" as ActiveView,
      label: "تحليل العلاقات",
      icon: Network,
      color: "text-purple-600",
    },
    {
      id: "manual" as ActiveView,
      label: "تحليل يدوي",
      icon: Brain,
      color: "text-orange-600",
    },
    {
      id: "alerts" as ActiveView,
      label: "التنبيهات",
      icon: Bell,
      color: "text-red-600",
    },
    {
      id: "settings" as ActiveView,
      label: "الإعدادات",
      icon: Settings,
      color: "text-gray-600",
    },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">تحصين</h2>
            <p className="text-sm text-gray-600">نظام كشف الاحتيال</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <TooltipProvider>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeView === item.id ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                      activeView === item.id
                        ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                    onClick={() => onViewChange(item.id)}
                    aria-label={`انتقل إلى ${item.label}`}
                  >
                    <item.icon className={`w-5 h-5 ${activeView === item.id ? "text-blue-600" : item.color}`} />
                    <span className="text-right flex-1 font-medium">{item.label}</span>
                    {activeView === item.id && <div className="w-1 h-6 bg-blue-600 rounded-full ml-auto" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-900 text-white">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                onClick={() => {
                  if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
                    // تسجيل الخروج
                  }
                }}
                aria-label="تسجيل الخروج من النظام"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
                <span className="text-right flex-1 font-medium">تسجيل الخروج</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-gray-900 text-white">
              <p>تسجيل الخروج من النظام</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>منصة تحصين v2.1</p>
          <p>© 2024 البنك المركزي</p>
        </div>
      </div>
    </div>
  )
}
