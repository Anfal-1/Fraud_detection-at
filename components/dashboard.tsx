"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import MainDashboard from "./main-dashboard"
import TransactionsList from "./transactions-list"
import NetworkAnalysis from "./network-analysis"
import ManualAnalysis from "./manual-analysis"
import AlertsPanel from "./alerts-panel"
import SettingsPanel from "./settings-panel"

export type ActiveView = "dashboard" | "transactions" | "network" | "manual" | "alerts" | "settings"

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view)
  }

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <MainDashboard />
      case "transactions":
        return <TransactionsList />
      case "network":
        return <NetworkAnalysis />
      case "manual":
        return <ManualAnalysis />
      case "alerts":
        return <AlertsPanel />
      case "settings":
        return <SettingsPanel />
      default:
        return <MainDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-auto">{renderActiveView()}</main>
    </div>
  )
}
