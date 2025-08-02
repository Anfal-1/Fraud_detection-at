"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Plus,
  X,
  CreditCard,
  MapPin,
  Users,
  Hash,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface Feature {
  id: string
  name: string
  label: string
  icon: any
  value: string
}

interface PredictionResult {
  prediction: "شرعية" | "احتيالية"
  confidence: number
  error?: string
}

export default function ManualAnalysis() {
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([
    {
      id: "cc_num",
      name: "cc_num",
      label: "💳 رقم البطاقة",
      icon: CreditCard,
      value: "6579025485362680",
    },
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult>({
    prediction: "شرعية",
    confidence: 91.41,
  })
  const [showResult, setShowResult] = useState(true)

  const availableFeatures = [
    { id: "cc_num", name: "cc_num", label: "💳 رقم البطاقة", icon: CreditCard },
    { id: "zip", name: "zip", label: "📮 الرمز البريدي", icon: MapPin },
    { id: "city_pop", name: "city_pop", label: "🏙️ عدد سكان المدينة", icon: Users },
    { id: "acct_num", name: "acct_num", label: "🔢 رقم الحساب", icon: Hash },
    { id: "unix_time", name: "unix_time", label: "⏰ الوقت", icon: Clock },
    { id: "amt", name: "amt", label: "💰 المبلغ", icon: DollarSign },
  ]

  const simulatePrediction = async (data: Record<string, string>): Promise<PredictionResult> => {
    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // التحقق من وجود ميزة واحدة على الأقل
    const hasAnyValue = Object.values(data).some((value) => value && value.trim())
    if (!hasAnyValue) {
      return {
        prediction: "شرعية",
        confidence: 0,
        error: "الرجاء إدخال قيمة واحدة على الأقل للتحليل",
      }
    }

    // محاكاة منطق التنبؤ مع القيم الافتراضية
    let riskScore = 0
    let featuresUsed = 0

    // تحليل رقم البطاقة
    if (data.cc_num && data.cc_num.trim()) {
      featuresUsed++
      const ccNum = data.cc_num.replace(/\s/g, "")
      if (ccNum.startsWith("4") || ccNum.startsWith("5")) {
        riskScore += 10 // بطاقات فيزا وماستركارد أقل خطورة
      } else {
        riskScore += 30
      }
    } else {
      // قيمة افتراضية للبطاقة
      riskScore += 15
    }

    // تحليل المبلغ
    if (data.amt && data.amt.trim()) {
      featuresUsed++
      const amount = Number.parseFloat(data.amt)
      if (amount > 10000) riskScore += 40
      else if (amount > 5000) riskScore += 20
      else riskScore += 5
    } else {
      // قيمة افتراضية للمبلغ (متوسط)
      riskScore += 15
    }

    // تحليل الوقت
    if (data.unix_time && data.unix_time.trim()) {
      featuresUsed++
      const timestamp = Number.parseInt(data.unix_time)
      const hour = new Date(timestamp * 1000).getHours()
      if (hour < 6 || hour > 22)
        riskScore += 25 // أوقات غير اعتيادية
      else riskScore += 10
    } else {
      // قيمة افتراضية للوقت (وقت عادي)
      riskScore += 10
    }

    // تحليل عدد السكان
    if (data.city_pop && data.city_pop.trim()) {
      featuresUsed++
      const population = Number.parseInt(data.city_pop)
      if (population < 10000)
        riskScore += 15 // مدن صغيرة أكثر خطورة
      else if (population > 1000000)
        riskScore += 5 // مدن كبيرة أقل خطورة
      else riskScore += 10
    } else {
      // قيمة افتراضية لعدد السكان (مدينة متوسطة)
      riskScore += 10
    }

    // تحليل الرمز البريدي
    if (data.zip && data.zip.trim()) {
      featuresUsed++
      riskScore += 8 // تأثير محدود
    } else {
      riskScore += 8
    }

    // تحليل رقم الحساب
    if (data.acct_num && data.acct_num.trim()) {
      featuresUsed++
      riskScore += 12 // تأثير محدود
    } else {
      riskScore += 12
    }

    // تعديل النتيجة بناءً على عدد الميزات المستخدمة
    if (featuresUsed === 1) {
      // إذا كانت ميزة واحدة فقط، قلل الثقة قليلاً
      riskScore += Math.random() * 15
    } else {
      // إضافة عشوائية للواقعية
      riskScore += Math.random() * 20
    }

    // حساب الثقة بناءً على عدد الميزات
    const baseConfidence = featuresUsed === 1 ? 75 : 85
    const confidence = Math.min(95, Math.max(65, baseConfidence + Math.random() * 10))
    const isLegitimate = riskScore < 50

    return {
      prediction: isLegitimate ? "شرعية" : "احتيالية",
      confidence: Number.parseFloat(confidence.toFixed(2)),
    }
  }

  const addFeature = (featureId: string) => {
    const feature = availableFeatures.find((f) => f.id === featureId)
    if (feature && !selectedFeatures.find((f) => f.id === featureId)) {
      setSelectedFeatures([...selectedFeatures, { ...feature, value: "" }])
      setShowResult(false)
    }
  }

  const removeFeature = (featureId: string) => {
    setSelectedFeatures(selectedFeatures.filter((f) => f.id !== featureId))
    setShowResult(false)
  }

  const updateFeatureValue = (featureId: string, value: string) => {
    setSelectedFeatures(selectedFeatures.map((f) => (f.id === featureId ? { ...f, value } : f)))
    setShowResult(false)
  }

  const handlePredict = async () => {
    setIsLoading(true)
    setShowResult(false)

    const data: Record<string, string> = {}
    selectedFeatures.forEach((feature) => {
      data[feature.name] = feature.value
    })

    try {
      const prediction = await simulatePrediction(data)
      setResult(prediction)
      setShowResult(true)
    } catch (error) {
      setResult({
        prediction: "شرعية",
        confidence: 0,
        error: "حدث خطأ في التنبؤ",
      })
      setShowResult(true)
    } finally {
      setIsLoading(false)
    }
  }

  const getResultColor = (prediction: string, hasError: boolean) => {
    if (hasError) return "text-red-600 bg-red-50 border-red-200"
    return prediction === "شرعية"
      ? "text-green-600 bg-green-50 border-green-200"
      : "text-red-600 bg-red-50 border-red-200"
  }

  const getResultIcon = (prediction: string, hasError: boolean) => {
    if (hasError) return <AlertTriangle className="w-6 h-6" />
    return prediction === "شرعية" ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />
  }

  const getDropdownOptions = (featureId: string): string[] => {
    switch (featureId) {
      case "acct_num":
        return [
          "ACC123456789",
          "ACC987654321",
          "ACC456789123",
          "ACC789123456",
          "ACC321654987",
          "ACC654987321",
          "ACC147258369",
          "ACC963852741",
          "ACC258741963",
          "ACC741852963",
        ]
      case "city_pop":
        return ["50000", "100000", "250000", "500000", "750000", "1000000", "1500000", "2000000", "3000000", "5000000"]
      case "zip":
        return ["11564", "12345", "21589", "31452", "41236", "51478", "61234", "71589", "81456", "91357"]
      case "unix_time":
        const now = Math.floor(Date.now() / 1000)
        const options = []
        for (let i = 0; i < 10; i++) {
          const timestamp = now - i * 3600 // كل ساعة للخلف
          options.push(timestamp.toString())
        }
        return options
      default:
        return []
    }
  }

  const getDropdownLabels = (featureId: string, value: string): string => {
    switch (featureId) {
      case "city_pop":
        const pop = Number.parseInt(value)
        if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M نسمة`
        if (pop >= 1000) return `${pop / 1000}K نسمة`
        return `${pop} نسمة`
      case "unix_time":
        const date = new Date(Number.parseInt(value) * 1000)
        return `${date.toLocaleDateString("ar-SA")} ${date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}`
      default:
        return value
    }
  }

  const getPlaceholderForFeature = (featureId: string): string => {
    switch (featureId) {
      case "cc_num":
        return "1234567890123456"
      case "amt":
        return "1500.00"
      default:
        return "أدخل القيمة..."
    }
  }

  const getHelpTextForFeature = (featureId: string): string => {
    switch (featureId) {
      case "cc_num":
        return "رقم البطاقة الائتمانية (16 رقم)"
      case "zip":
        return "الرمز البريدي للموقع"
      case "city_pop":
        return "عدد سكان المدينة"
      case "acct_num":
        return "رقم الحساب المصرفي"
      case "unix_time":
        return "الطابع الزمني (Unix timestamp)"
      case "amt":
        return "مبلغ المعاملة بالريال السعودي"
      default:
        return ""
    }
  }

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">التحليل اليدوي للمعاملات</h1>
          <p className="text-gray-600 text-lg">
            اختبر نموذج كشف الاحتيال المصرفي بإدخال بيانات مخصصة والحصول على تنبؤات فورية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Feature Selection */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                  إضافة ميزة جديدة للتحليل
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">اختر الميزات التي تريد تضمينها في عملية التنبؤ</p>
              </CardHeader>
              <CardContent>
                <Select onValueChange={addFeature}>
                  <SelectTrigger className="w-full h-12 text-right">
                    <SelectValue placeholder="🔍 اختر ميزة لإضافتها إلى النموذج..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFeatures
                      .filter((feature) => !selectedFeatures.find((f) => f.id === feature.id))
                      .map((feature) => (
                        <SelectItem key={feature.id} value={feature.id} className="text-right">
                          <div className="flex items-center gap-2">
                            <feature.icon className="w-4 h-4" />
                            {feature.label}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {availableFeatures.filter((feature) => !selectedFeatures.find((f) => f.id === feature.id)).length ===
                  0 && <p className="text-sm text-gray-500 mt-2 text-center">✅ تم إضافة جميع الميزات المتاحة</p>}
              </CardContent>
            </Card>

            {/* Selected Features */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                  الميزات المحددة ({selectedFeatures.length})
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">أدخل القيم المطلوبة لكل ميزة محددة</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Feature Badges with improved UX */}
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((feature) => (
                    <Tooltip key={feature.id}>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="destructive"
                          className="flex items-center gap-1 px-3 py-1.5 cursor-pointer hover:bg-red-600 transition-colors"
                        >
                          {feature.label}
                          <button
                            onClick={() => removeFeature(feature.id)}
                            className="ml-1 hover:bg-red-600 rounded-full p-0.5 transition-colors"
                            aria-label={`حذف ميزة ${feature.label}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>انقر على X لحذف هذه الميزة</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                {/* Feature Inputs */}
                <div className="space-y-4">
                  {selectedFeatures.map((feature) => (
                    <div key={feature.id} className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <feature.icon className="w-4 h-4 text-blue-600" />
                        {feature.label}
                        <span className="text-red-500">*</span>
                      </label>

                      {/* استخدام dropdown للحقول المحددة */}
                      {["acct_num", "city_pop", "zip", "unix_time"].includes(feature.id) ? (
                        <Select value={feature.value} onValueChange={(value) => updateFeatureValue(feature.id, value)}>
                          <SelectTrigger className="w-full h-12 text-right border-2 focus:border-blue-500 transition-colors">
                            <SelectValue placeholder={`اختر ${feature.label}...`} />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 z-50">
                            {getDropdownOptions(feature.id).map((option, idx) => (
                              <SelectItem key={idx} value={option} className="text-right">
                                <div className="flex items-center justify-between w-full">
                                  <span>{getDropdownLabels(feature.id, option)}</span>
                                  <span className="text-xs text-gray-500 ml-2">{option}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={feature.value}
                          onChange={(e) => updateFeatureValue(feature.id, e.target.value)}
                          placeholder={`مثال: ${getPlaceholderForFeature(feature.id)}`}
                          className="w-full h-12 text-right border-2 focus:border-blue-500 transition-colors"
                          required
                          aria-describedby={`${feature.id}-help`}
                        />
                      )}

                      <p id={`${feature.id}-help`} className="text-xs text-gray-500">
                        {getHelpTextForFeature(feature.id)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Enhanced Predict Button */}
                <div className="space-y-3">
                  <Button
                    onClick={handlePredict}
                    disabled={
                      isLoading || selectedFeatures.length === 0 || selectedFeatures.every((f) => !f.value.trim()) // تغيير من some إلى every
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold transition-all duration-200 disabled:opacity-50"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        جاري تحليل البيانات...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />🔍 تحليل وتنبؤ
                      </>
                    )}
                  </Button>

                  {selectedFeatures.every((f) => !f.value.trim()) && selectedFeatures.length > 0 && (
                    <p className="text-sm text-amber-600 text-center flex items-center justify-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      يرجى إدخال قيمة واحدة على الأقل للتحليل
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Prediction Result */}
            {showResult && (
              <Card
                className={`border-2 transition-all duration-300 ${getResultColor(result.prediction, !!result.error)} shadow-lg`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {getResultIcon(result.prediction, !!result.error)}
                    نتيجة التحليل
                    {!result.error && (
                      <Badge variant="outline" className="ml-auto">
                        تم بنجاح
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.error ? (
                    <div className="text-center space-y-3">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-lg font-semibold text-red-600 mb-2">⚠️ تعذر إكمال التحليل</p>
                        <p className="text-red-600">{result.error}</p>
                      </div>
                      <Button onClick={() => setShowResult(false)} variant="outline" className="bg-transparent">
                        إعادة المحاولة
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">تصنيف المعاملة:</p>
                        <p
                          className={`text-3xl font-bold mb-2 ${
                            result.prediction === "شرعية" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {result.prediction === "شرعية" ? "✅" : "⚠️"} المعاملة تبدو {result.prediction}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          التحليل يعتمد على {selectedFeatures.filter((f) => f.value.trim()).length} من{" "}
                          {selectedFeatures.length} ميزة محددة
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">نسبة الثقة:</span>
                          <span
                            className={`text-2xl font-bold ${
                              result.prediction === "شرعية" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {result.confidence}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                              result.prediction === "شرعية" ? "bg-green-500" : "bg-red-500"
                            }`}
                            style={{ width: `${result.confidence}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          {result.confidence >= 90
                            ? "ثقة عالية جداً"
                            : result.confidence >= 80
                              ? "ثقة عالية"
                              : result.confidence >= 70
                                ? "ثقة متوسطة"
                                : "ثقة منخفضة"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Model Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  معلومات النموذج
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">XGBoost</div>
                    <div className="text-sm text-gray-600">نوع النموذج</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-gray-600">دقة النموذج</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">1.2ms</div>
                    <div className="text-sm text-gray-600">زمن التنبؤ</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">6</div>
                    <div className="text-sm text-gray-600">الميزات المتاحة</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">الميزات المستخدمة في التدريب:</h4>
                  <div className="flex flex-wrap gap-1">
                    {availableFeatures.map((feature) => (
                      <Badge key={feature.id} variant="outline" className="text-xs">
                        {feature.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>تعليمات الاستخدام</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>اختر الميزات التي تريد اختبارها من القائمة المنسدلة</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>أدخل القيم المناسبة لكل ميزة</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>اضغط على "تنبؤ" للحصول على النتيجة</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>يمكنك حذف أي ميزة بالضغط على علامة X</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
