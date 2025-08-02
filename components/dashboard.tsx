"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import MainDashboard from "./main-dashboard"
import TransactionsList from "./transactions-list"
import TransactionDetails from "./transaction-details"
import NetworkAnalysis from "./network-analysis"
import AlertsPanel from "./alerts-panel"
import SettingsPanel from "./settings-panel"
import ManualAnalysis from "./manual-analysis"

export type ActiveView = "dashboard" | "transactions" | "details" | "network" | "manual" | "alerts" | "settings"

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <MainDashboard />
      case "transactions":
        return (
          <TransactionsList
            onSelectTransaction={(tx) => {
              setSelectedTransaction(tx)
              setActiveView("details")
            }}
          />
        )
      case "details":
        return <TransactionDetails transaction={selectedTransaction} onBack={() => setActiveView("transactions")} />
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">{renderActiveView()}</main>
    </div>
  )
}
