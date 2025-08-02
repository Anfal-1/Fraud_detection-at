"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, AlertTriangle, X, Download, Clock } from "lucide-react"
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
  onSelectTransaction: (transaction: Transaction) => void
}

export default function TransactionsList({ onSelectTransaction }: TransactionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">قائمة المعاملات</h1>
        <p className="text-gray-600">مراقبة وتحليل جميع المعاملات المصرفية</p>
      </div>

      {/* Filters */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="🔍 البحث برقم المعاملة، المستخدم، أو المبلغ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                aria-label="البحث في المعاملات"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  aria-label="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-600 flex items-center">فلترة:</span>
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
                  className="gap-1"
                >
                  {filter.label}
                  <Badge variant="secondary" className="text-xs">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
          {filteredTransactions.length === 0 && searchTerm && (
            <div className="text-center py-4 text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>لم يتم العثور على نتائج للبحث "{searchTerm}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center justify-between">
            <span>المعاملات المصرفية</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {filteredTransactions.length} من {transactions.length}
              </Badge>
              <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                <Download className="w-4 h-4" />
                تصدير
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right p-4 font-semibold text-gray-700">رقم المعاملة</th>
                  <th className="text-right p-4 font-semibold text-gray-700">المستخدم</th>
                  <th className="text-right p-4 font-semibold text-gray-700">المبلغ</th>
                  <th className="text-right p-4 font-semibold text-gray-700">النوع</th>
                  <th className="text-right p-4 font-semibold text-gray-700">الحالة</th>
                  <th className="text-right p-4 font-semibold text-gray-700">درجة الخطر</th>
                  <th className="text-right p-4 font-semibold text-gray-700">التوقيت</th>
                  <th className="text-right p-4 font-semibold text-gray-700">الإجراءات</th>
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
                    <td className="p-4 font-medium">{transaction.userId}</td>
                    <td className="p-4">
                      <span className="font-bold text-lg">{transaction.amount.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 mr-1">ريال</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{transaction.type}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusColor(transaction.status)} className="font-medium">
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
                              onClick={() => onSelectTransaction(transaction)}
                              className="gap-1 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
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
        </CardContent>
      </Card>
    </div>
  )
}
