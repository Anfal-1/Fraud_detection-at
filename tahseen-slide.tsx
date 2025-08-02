import {
  Shield,
  Database,
  Brain,
  Network,
  Bell,
  Settings,
  Users,
  BarChart3,
  Eye,
  Lock,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TahseenSlide() {
  const workflowSteps = [
    { id: 1, title: "استقبال المعاملات", desc: "بشكل لحظي", icon: Database, color: "bg-blue-500" },
    { id: 2, title: "تحليل السلوك", desc: "Autoencoder", icon: Brain, color: "bg-purple-500" },
    { id: 3, title: "تصنيف المعاملات", desc: "XGBoost", icon: BarChart3, color: "bg-green-500" },
    { id: 4, title: "تحليل العلاقات", desc: "Graph Analysis", icon: Network, color: "bg-orange-500" },
    { id: 5, title: "التنبيهات الفورية", desc: "للموظف", icon: Bell, color: "bg-red-500" },
  ]

  const interfaces = [
    {
      title: "تسجيل الدخول",
      desc: "حماية الوصول بالتحقق الثنائي",
      icon: Lock,
      color: "text-green-600 bg-green-50",
      features: ["تحقق ثنائي", "رسالة ترحيبية", "حماية البيانات"],
    },
    {
      title: "الواجهة الرئيسية",
      desc: "ملخص شامل لحالة النظام",
      icon: BarChart3,
      color: "text-yellow-600 bg-yellow-50",
      features: ["عدد المعاملات", "نسبة الخطورة", "رسم بياني لحظي"],
    },
    {
      title: "قائمة المعاملات",
      desc: "جدول تفاعلي للمعاملات",
      icon: Database,
      color: "text-red-600 bg-red-50",
      features: ["عرض لحظي", "فرز ذكي", "درجة الخطورة"],
    },
    {
      title: "تفاصيل المعاملة",
      desc: "تحليل عميق للمعاملات المشبوهة",
      icon: Eye,
      color: "text-blue-600 bg-blue-50",
      features: ["تفاصيل شاملة", "رسم بياني", "قرار مدعوم بالبيانات"],
    },
    {
      title: "تحليل العلاقات",
      desc: "شبكة تفاعلية للحسابات",
      icon: Network,
      color: "text-purple-600 bg-purple-50",
      features: ["عرض الشبكة", "كشف الأنماط", "العلاقات المخفية"],
    },
    {
      title: "التنبيهات والتنظيم",
      desc: "نظام تنبيهات ذكي",
      icon: Bell,
      color: "text-orange-600 bg-orange-50",
      features: ["تنبيهات ملونة", "قرار سريع", "تصعيد الحالات"],
    },
    {
      title: "إعدادات النظام",
      desc: "تحكم شامل في النظام",
      icon: Settings,
      color: "text-gray-600 bg-gray-50",
      features: ["مستوى الحساسية", "صلاحيات المستخدمين", "إدارة التنبيهات"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="p-4 bg-blue-600 rounded-full">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800">منصة تحصين</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          نظام ذكي لكشف الاحتيال البنكي باستخدام الذكاء الاصطناعي وتحليل البيانات المتقدم
        </p>
      </div>

      {/* Workflow Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">آلية العمل</h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <Card className="w-64 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                  <Badge variant="outline" className="mt-2">
                    {step.id}
                  </Badge>
                </CardContent>
              </Card>
              {index < workflowSteps.length - 1 && <div className="hidden lg:block w-8 h-0.5 bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Interfaces Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">واجهات النظام</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {interfaces.map((interface_, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${interface_.color} flex items-center justify-center mb-3`}>
                  <interface_.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{interface_.title}</CardTitle>
                <p className="text-sm text-gray-600">{interface_.desc}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {interface_.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Benefits */}
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">الفوائد الرئيسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">قرار أسرع</h3>
            <p className="text-gray-600">تحليل فوري للمعاملات مع تنبيهات ذكية</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">خسائر أقل</h3>
            <p className="text-gray-600">كشف مبكر للاحتيال قبل حدوث الضرر</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">ثقة أعلى</h3>
            <p className="text-gray-600">حماية شاملة تعزز ثقة العملاء</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold">
          <Shield className="w-5 h-5" />
          <span>الواجهة الذكية = قرار أسرع = خسائر أقل = ثقة أعلى</span>
        </div>
      </div>
    </div>
  )
}
