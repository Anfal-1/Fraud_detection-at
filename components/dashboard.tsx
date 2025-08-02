"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import MainDashboard from "./main-dashboard"
import TransactionsList from "./transactions-list"
import TransactionDetails from "./transaction-details"
import NetworkAnalysis from "./network-analysis"
import ManualAnalysis from "./manual-analysis"
import AlertsPanel from "./alerts-panel"
import SettingsPanel from "./settings-panel"
import PerformanceMonitor from "./performance-monitor"
import LoadingIndicator from "./loading-indicator"

type ActiveView =
  | "dashboard"
  | "transactions"
  | "transaction-details"
  | "network"
  | "manual"
  | "alerts"
  | "settings"
  | "performance"

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

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleViewChange = (viewId: ActiveView) => {
    setIsLoading(true)
    setTimeout(() => {
      setActiveView(viewId)
      setIsLoading(false)
    }, 300)
  }

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setActiveView("transaction-details")
  }

  const handleBackToTransactions = () => {
    setSelectedTransaction(null)
    setActiveView("transactions")
  }

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <MainDashboard />
      case "transactions":
        return <TransactionsList onSelectTransaction={handleSelectTransaction} />
      case "transaction-details":
        return <TransactionDetails transaction={selectedTransaction} onBack={handleBackToTransactions} />
      case "network":
        return <NetworkAnalysis />
      case "manual":
        return <ManualAnalysis />
      case "alerts":
        return <AlertsPanel />
      case "settings":
        return <SettingsPanel />
      case "performance":
        return <PerformanceMonitor />
      default:
        return <MainDashboard />
    }
  }

  return (
    <div className="flex h-auto min-h-screen bg-background overflow-visible">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-y-auto h-auto min-h-screen">
        {isLoading && <LoadingIndicator />}
        <div className="h-auto min-h-full">{renderActiveView()}</div>
      </main>
    </div>
  )
}
