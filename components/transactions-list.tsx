"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, AlertTriangle, X, Download, Clock, Filter } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

interface TransactionsListProps {
  onSelectTransaction?: (transaction: Transaction) => void
}

export default function TransactionsList({ onSelectTransaction }: TransactionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const transactions: Transaction[] = [
    {
      id: "TXN001",
      userId: "USR4521",
      amount: 50000,
      type: "تحويل",
      status: "مشبوهة",
      riskScore: 95,
      timestamp: "2024-01-15 10:30:00",
      location: "الرياض",
    },
    {
      id: "TXN002",
      userId: "USR7832",
      amount: 1200,
      type: "سحب",
      status: "آمنة",
      riskScore: 15,
      timestamp: "2024-01-15 10:25:00",
      location: "جدة",
    },
    {
      id: "TXN003",
      userId: "USR9341",
      amount: 25000,
      type: "إيداع",
      status: "قيد المراجعة",
      riskScore: 65,
      timestamp: "2024-01-15 10:20:00",
      location: "الدمام",
    },
    {
      id: "TXN004",
      userId: "USR1234",
      amount: 800,
      type: "شراء",
      status: "آمنة",
      riskScore: 10,
      timestamp: "2024-01-15 10:15:00",
      location: "الرياض",
    },
    {
      id: "TXN005",
      userId: "USR5678",
      amount: 75000,
      type: "تحويل",
      status: "مشبوهة",
      riskScore: 88,
      timestamp: "2024-01-15 10:10:00",
      location: "مكة",
    },
  ]

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toString().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || tx.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مشبوهة":
        return "destructive"
      case "قيد المراجعة":
        return "default"
      case "آمنة":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600 bg-red-50"
    if (score >= 50) return "text-yellow-600 bg-yellow-50"
    return "text-green-600 bg-green-50"
  }

  const handleTransactionClick = (transaction: Transaction) => {
    if (onSelectTransaction) {
      onSelectTransaction(transaction)
    }
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6 min-h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="text-center sm:text-right">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">قائمة المعاملات</h1>
        <p className="text-sm sm:text-base text-gray-600">مراقبة وتحليل جميع المعاملات المصرفية</p>
      </div>

      {/* Search and Filters */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="🔍 البحث برقم المعاملة، المستخدم، أو المبلغ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-12 border-2 focus:border-blue-500 transition-colors text-sm sm:text-base"
                aria-label="البحث في المعاملات"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <div className="flex items-center justify-between sm:hidden">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                <Filter className="w-4 h-4" />
                فلترة
              </Button>
              <Badge variant="outline" className="text-xs">
                {filteredTransactions.length} من {transactions.length}
              </Badge>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <span className="text-sm font-medium text-gray-600 flex items-center">فلترة:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "الكل", count: transactions.length },
                    { key: "مشبوهة", label: "مشبوهة", count: transactions.filter((t) => t.status === "مشبوهة").length },
                    {
                      key: "قيد المراجعة",
                      label: "قيد المراجعة",
                      count: transactions.filter((t) => t.status === "قيد المراجعة").length,
                    },
                    { key: "آمنة", label: "آمنة", count: transactions.filter((t) => t.status === "آمنة").length },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={filterStatus === filter.key ? "default" : "outline"}
                      onClick={() => setFilterStatus(filter.key)}
                      size="sm"
                      className="gap-1 text-xs sm:text-sm"
                    >
                      {filter.label}
                      <Badge variant="secondary" className="text-xs">
                        {filter.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* No Results Message */}
            {filteredTransactions.length === 0 && searchTerm && (
              <div className="text-center py-4 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">لم يتم العثور على نتائج للبحث "{searchTerm}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table/Cards */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b pb-3">
          <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
            <span>المعاملات المصرفية</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:inline-flex text-xs">
                {filteredTransactions.length} من {transactions.length}
              </Badge>
              <Button variant="outline" size="sm" className="gap-1 bg-transparent text-xs sm:text-sm">
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">تصدير</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right p-4 font-semibold text-gray-700 text-sm">رقم المعاملة</th>
                  <th className="text-right p-4 font-semibold text-gray-700 text-sm">المستخدم</th>
                  <th className="text-right p-4 font-semibold text-gray-700 text-sm">المبلغ</th>
                  <th className="text-right p-4 font-semibold text-gray-700 text-sm">النوع</th>
                  <th className="text-right p-4 font-semibold text-gray-700 text-sm">الحالة</th>
                  <th className="text-right p-4 font-semibold text-gray-700 text-sm">درجة الخطر</th>
                  <th className="text-right p-4 font-semibold text-gray-700 text-sm">التوقيت</th>
                  <th className="text-right p-4 font-semibold text-gray-700 text-sm">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="p-4">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">{transaction.id}</code>
                    </td>
                    <td className="p-4 font-medium text-sm">{transaction.userId}</td>
                    <td className="p-4">
                      <span className="font-bold text-base">{transaction.amount.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 mr-1">ريال</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusColor(transaction.status)} className="font-medium text-xs">
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold cursor-help ${getRiskColor(transaction.riskScore)}`}
                            >
                              {transaction.riskScore >= 80 && <AlertTriangle className="w-3 h-3" />}
                              {transaction.riskScore}%
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              درجة الخطر:{" "}
                              {transaction.riskScore >= 80
                                ? "عالية"
                                : transaction.riskScore >= 50
                                  ? "متوسطة"
                                  : "منخفضة"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(transaction.timestamp).toLocaleString("ar-SA")}
                      </div>
                    </td>
                    <td className="p-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTransactionClick(transaction)}
                              className="gap-1 hover:bg-blue-50 hover:border-blue-300 transition-colors text-xs"
                            >
                              <Eye className="w-3 h-3" />
                              عرض التفاصيل
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>عرض التحليل التفصيلي للمعاملة</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3 p-3 sm:p-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">{transaction.id}</code>
                        <p className="text-sm text-gray-600 mt-1">{transaction.userId}</p>
                      </div>
                      <Badge variant={getStatusColor(transaction.status)} className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>

                    {/* Amount and Type */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold">{transaction.amount.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 mr-1">ريال</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type}
                      </Badge>
                    </div>

                    {/* Risk Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">درجة الخطر:</span>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold ${getRiskColor(transaction.riskScore)}`}
                      >
                        {transaction.riskScore >= 80 && <AlertTriangle className="w-3 h-3" />}
                        {transaction.riskScore}%
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {new Date(transaction.timestamp).toLocaleString("ar-SA")}
                    </div>

                    {/* Action Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTransactionClick(transaction)}
                      className="w-full gap-1 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      عرض التفاصيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
