"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ArrowRight, ArrowLeft, ArrowLeftIcon, Info, X, Pencil, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { jsPDF } from "jspdf"
import { useToast } from "@/components/toast-container"
import { useFocusTrap } from "@/hooks/use-focus-trap"

const easySchedule = [
  {
    code: "MATC82",
    name: "SISTEMAS WEB",
    classes: [
      { id: "T01", schedule: "Quarta e sexta, 20h20 às 22h00", professor: "Prof. João Silva" },
      { id: "T02", schedule: "Segunda e quarta, 18h30 às 20h20", professor: "Prof. Maria Santos" },
    ],
    color: "bg-red-200 text-red-900",
  },
  {
    code: "MATA01",
    name: "CÁLCULO A",
    classes: [
      { id: "T01", schedule: "Quarta e sexta, 18h30 às 20h20", professor: "Prof. Carlos Oliveira" },
      { id: "T02", schedule: "Terça e quinta, 20h20 às 22h10", professor: "Prof. Ana Costa" },
      { id: "T03", schedule: "Segunda e sexta, 14h50 às 16h40", professor: "Prof. Pedro Lima" },
    ],
    color: "bg-orange-200 text-orange-900",
  },
  {
    code: "MATA64",
    name: "INTELIGÊNCIA ARTIFICIAL",
    classes: [
      { id: "T01", schedule: "Terça e Quinta, 20h20 às 22h10", professor: "Prof. Fernanda Rocha" },
      { id: "T02", schedule: "Segunda e quarta, 14h50 às 16h40", professor: "Prof. Ricardo Alves" },
    ],
    color: "bg-yellow-200 text-yellow-900",
  },
]

const reserveCourses = [
  {
    code: "MATC73",
    name: "INTRODUÇÃO À LÓGICA MATEMÁTICA",
    classes: [
      { id: "T01", schedule: "Toda dia, toda hora", professor: "Prof. Luiza Ferreira" },
      { id: "T02", schedule: "Terça e quinta, 16h40 às 18h30", professor: "Prof. Bruno Martins" },
    ],
    color: "bg-blue-200 text-blue-900",
  },
]

export default function SchedulesResultPage() {
  const [recommendedCourses, setRecommendedCourses] = useState([]) // VAZIO - Dados devem vir de recomendações
  const [reserveCoursesList, setReserveCoursesList] = useState([]) // VAZIO
  const [easyExpanded, setEasyExpanded] = useState<number[]>([0, 1, 2])
  const [reserveExpanded, setReserveExpanded] = useState<number[]>([0])
  const [selectedClasses, setSelectedClasses] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    easySchedule.forEach((course) => {
      initial[course.code] = course.classes[0].id
    })
    reserveCourses.forEach((course) => {
      initial[course.code] = course.classes[0].id
    })
    return initial
  })
  const [isTestMode, setIsTestMode] = useState(false)
  const [draggedItem, setDraggedItem] = useState<{ course: any; source: "recommended" | "reserve" } | null>(null)
  const [draggingCode, setDraggingCode] = useState<string | null>(null)
  const [comeFrom, setComeFrom] = useState<string>("/dashboard")
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [gradeName, setGradeName] = useState("Nova grade")
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempGradeName, setTempGradeName] = useState("")
  const router = useRouter()
  const { showToast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [mobileView, setMobileView] = useState<"recommended" | "reserve">("recommended")
  const modalRef = useFocusTrap(showAnalysis)

  const toggleEasy = (idx: number) => {
    setEasyExpanded((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]))
  }

  const toggleReserve = (idx: number) => {
    setReserveExpanded((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]))
  }

  const parseSchedule = (scheduleStr: string) => {
    const days: string[] = []
    const timeRanges: { start: string; end: string }[] = []

    // Extract days (Segunda, Terça, etc.)
    const dayMatch = scheduleStr.match(/(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)/gi)
    if (dayMatch) {
      days.push(...dayMatch.map((d) => d.toLowerCase()))
    }

    // Extract time ranges (18h30 às 20h10)
    const timeMatch = scheduleStr.match(/(\d{1,2}h\d{2})\s*às\s*(\d{1,2}h\d{2})/gi)
    if (timeMatch) {
      timeMatch.forEach((range) => {
        const [start, end] = range.split(/\s*às\s*/i)
        timeRanges.push({ start: start.toLowerCase(), end: end.toLowerCase() })
      })
    }

    return { days, timeRanges }
  }

  const timeToMinutes = (timeStr: string): number => {
    const match = timeStr.match(/(\d{1,2})h(\d{2})/)
    if (!match) return 0
    const hours = Number.parseInt(match[1])
    const minutes = Number.parseInt(match[2])
    return hours * 60 + minutes
  }

  const checkScheduleConflict = (schedule1: string, schedule2: string): boolean => {
    const parsed1 = parseSchedule(schedule1)
    const parsed2 = parseSchedule(schedule2)

    // Check if they share any days
    const sharedDays = parsed1.days.filter((day) => parsed2.days.includes(day))
    if (sharedDays.length === 0) return false

    // Check if time ranges overlap on shared days
    for (const range1 of parsed1.timeRanges) {
      for (const range2 of parsed2.timeRanges) {
        const start1 = timeToMinutes(range1.start)
        const end1 = timeToMinutes(range1.end)
        const start2 = timeToMinutes(range2.start)
        const end2 = timeToMinutes(range2.end)

        // Check for overlap: start1 < end2 AND start2 < end1
        if (start1 < end2 && start2 < end1) {
          return true // Conflict detected
        }
      }
    }

    return false
  }

  const handleClassChange = (courseCode: string, classId: string) => {
    const course = recommendedCourses.find((c) => c.code === courseCode)
    if (!course) return

    const newClass = course.classes.find((c: any) => c.id === classId)
    if (!newClass) return

    // Check for conflicts with other courses in recommended list
    for (const otherCourse of recommendedCourses) {
      if (otherCourse.code === courseCode) continue // Skip the same course

      const otherClassId = selectedClasses[otherCourse.code]
      const otherClass = otherCourse.classes.find((c: any) => c.id === otherClassId)

      if (otherClass && checkScheduleConflict(newClass.schedule, otherClass.schedule)) {
        showToast(
          `Conflito de horário com ${otherCourse.code} - ${otherCourse.name} (${otherClass.schedule})`,
          "error",
          4000,
        )
        return // Don't change the class
      }
    }

    // No conflict, proceed with change
    setSelectedClasses((prev) => ({
      ...prev,
      [courseCode]: classId,
    }))
  }

  const getCurrentClassInfo = (course: any) => {
    const selectedClassId = selectedClasses[course.code]
    const classInfo = course.classes.find((c: any) => c.id === selectedClassId)
    return classInfo || course.classes[0]
  }

  const getCurrentSchedule = (course: any) => {
    return getCurrentClassInfo(course).schedule
  }

  const getCurrentProfessor = (course: any) => {
    return getCurrentClassInfo(course).professor
  }

  const handleDragStart = (course: any, source: "recommended" | "reserve") => {
    setDraggedItem({ course, source })
    setDraggingCode(course.code)
  }

  const handleDropOnRecommended = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (draggedItem && draggedItem.source === "reserve") {
      const updatedRecommendedCourses = [...recommendedCourses, draggedItem.course]
      const updatedReserveCoursesList = reserveCoursesList.filter((course) => course.code !== draggedItem.course.code)
      setRecommendedCourses(updatedRecommendedCourses)
      setReserveCoursesList(updatedReserveCoursesList)
      setDraggedItem(null)
      setDraggingCode(null)
    }
  }

  const handleDropOnReserve = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (draggedItem && draggedItem.source === "recommended") {
      const updatedReserveCoursesList = [...reserveCoursesList, draggedItem.course]
      const updatedRecommendedCourses = recommendedCourses.filter((course) => course.code !== draggedItem.course.code)
      setRecommendedCourses(updatedRecommendedCourses)
      setReserveCoursesList(updatedReserveCoursesList)
      setDraggedItem(null)
      setDraggingCode(null)
    }
  }

  const moveToReserve = (course: any) => {
    const updatedRecommendedCourses = recommendedCourses.filter((c) => c.code !== course.code)
    const updatedReserveCoursesList = [...reserveCoursesList, course]
    setRecommendedCourses(updatedRecommendedCourses)
    setReserveCoursesList(updatedReserveCoursesList)

    if (updatedRecommendedCourses.length === 0) {
      showToast(
        "A Nova Grade está vazia. Verifique as Disciplinas Reserva para adicionar disciplinas.",
        "warning",
        5000,
      )
    }
  }

  const moveToRecommended = (course: any) => {
    const updatedReserveCoursesList = reserveCoursesList.filter((c) => c.code !== course.code)
    const updatedRecommendedCourses = [...recommendedCourses, course]
    setRecommendedCourses(updatedRecommendedCourses)
    setReserveCoursesList(updatedReserveCoursesList)
  }

  useEffect(() => {
    const testMode = sessionStorage.getItem("testMode")
    setIsTestMode(testMode === "true")

    const from = sessionStorage.getItem("schedules_from") || "dashboard"
    setComeFrom(from === "dashboard" ? "/dashboard" : "/recommendations")
  }, [])

  const handleSaveResults = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (isTestMode) {
      showToast("Redirecionando para cadastro...", "info", 2000)
      setIsSaving(false)
      router.push("/register?from=test")
    } else {
      showToast("Resultados salvos com sucesso!", "success")
      setIsSaving(false)
      setTimeout(() => router.push("/dashboard"), 500)
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    showToast("Gerando PDF...", "info", 2000)

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      let yPosition = 20

      // Header
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text(`RADAR - ${gradeName}`, margin, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("Recomendador de Disciplinas", margin, yPosition)
      yPosition += 15

      // Grade Recomendada
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(gradeName.toUpperCase(), margin, yPosition)
      yPosition += 10

      doc.setFont("helvetica", "normal")
      recommendedCourses.forEach((course, idx) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }

        const schedule = getCurrentSchedule(course)
        const professor = getCurrentProfessor(course)
        const selectedClassId = selectedClasses[course.code]

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text(`${idx + 1}. ${course.code} - ${course.name} (${selectedClassId})`, margin, yPosition)
        yPosition += 6

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.text(`   ${schedule}`, margin, yPosition)
        yPosition += 5
        doc.text(`   Professor: ${professor}`, margin, yPosition)
        yPosition += 8
      })

      yPosition += 5

      // Disciplinas Reserva
      if (reserveCoursesList.length > 0) {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.text("DISCIPLINAS RESERVA", margin, yPosition)
        yPosition += 10

        doc.setFont("helvetica", "normal")
        reserveCoursesList.forEach((course, idx) => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }

          const schedule = getCurrentSchedule(course)
          const professor = getCurrentProfessor(course)
          const selectedClassId = selectedClasses[course.code]

          doc.setFontSize(11)
          doc.setFont("helvetica", "bold")
          doc.text(`${idx + 1}. ${course.code} - ${course.name} (${selectedClassId})`, margin, yPosition)
          yPosition += 6

          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.text(`   ${schedule}`, margin, yPosition)
          yPosition += 5
          doc.text(`   Professor: ${professor}`, margin, yPosition)
          yPosition += 8
        })
      }

      // New page for analysis
      doc.addPage()
      yPosition = 20

      // Analysis section
      doc.setFontSize(18)
      doc.setFont("helvetica", "bold")
      doc.text("ANÁLISE DA GRADE", margin, yPosition)
      yPosition += 15

      // General summary
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("Resumo Geral:", margin, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const summaryData = [
        `Dias com aulas na semana: ${gradeAnalysis.daysPerWeek}`,
        `Carga horaria do semestre: ${gradeAnalysis.semesterWorkload}h`,
        `Carga horaria semanal no campus: ${gradeAnalysis.weeklyWorkload}h`,
        `Previsao de semestres ate formatura: ${gradeAnalysis.semestersToGraduation}`,
      ]

      summaryData.forEach((line) => {
        doc.text(`  ${line}`, margin + 2, yPosition)
        yPosition += 6
      })

      yPosition += 8

      // Shift distribution
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("Distribuicao por turno:", margin, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      Object.entries(gradeAnalysis.shiftDistribution).forEach(([shift, percentage]) => {
        doc.text(`  ${shift}: ${percentage}%`, margin + 2, yPosition)
        yPosition += 6
      })

      yPosition += 8

      // Daily schedule
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("Tempo estimado diario na universidade:", margin, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      Object.entries(gradeAnalysis.dailySchedule).forEach(([day, time]) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(`  ${day}: ${time}`, margin + 2, yPosition)
        yPosition += 6
      })

      yPosition += 8

      // Unlocked courses
      if (yPosition > 220) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("Destrava as seguintes obrigatorias:", margin, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")

      // Wrap long list of courses
      let courseLine = ""
      gradeAnalysis.unlockedCourses.forEach((course, idx) => {
        const courseText = idx === 0 ? course : `, ${course}`

        // Check if adding this course would exceed page width
        if (doc.getTextWidth(courseLine + courseText) > pageWidth - 2 * margin - 4) {
          // Print current line and start new one
          doc.text(`  ${courseLine}`, margin + 2, yPosition)
          yPosition += 6
          courseLine = course

          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
        } else {
          courseLine += courseText
        }
      })

      // Print remaining line
      if (courseLine) {
        doc.text(`  ${courseLine}`, margin + 2, yPosition)
      }

      // Save the PDF
      const filename = `radar-${gradeName.toLowerCase().replace(/\s+/g, "-")}.pdf`
      doc.save(filename)

      setIsDownloading(false)
      showToast("PDF baixado com sucesso!", "success")
    } catch (error) {
      setIsDownloading(false)
      showToast("Erro ao gerar PDF. Tente novamente.", "error")
      console.error("PDF generation error:", error)
    }
  }

  const gradeAnalysis = {
    daysPerWeek: 4,
    semesterWorkload: 240,
    weeklyWorkload: 18,
    shiftDistribution: { Noturno: 100.0 },
    dailySchedule: {
      Segunda: "Sem aulas",
      Terça: "20h20 - 22h10 (1h50)",
      Quarta: "18h30 - 22h00 (3h30)",
      Quinta: "20h20 - 22h10 (1h50)",
      Sexta: "20h20 - 22h00 (1h40)",
      Sábado: "Sem aulas",
      Domingo: "Sem aulas",
    },
    unlockedCourses: [
      "banco de dados",
      "programação orientada a objetos",
      "redes de computadores i",
      "sistemas operacionais",
    ],
    semestersToGraduation: 6,
  }

  const startEditingName = () => {
    setTempGradeName(gradeName)
    setIsEditingName(true)
  }

  const saveGradeName = () => {
    if (tempGradeName.trim()) {
      setGradeName(tempGradeName.trim())
    }
    setIsEditingName(false)
  }

  const cancelEditingName = () => {
    setIsEditingName(false)
    setTempGradeName("")
  }

  return (
    <div className="min-h-screen bg-[#2B3E7E]">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/istockphoto-1219565719-612x612.jpg"
              alt="Radar Logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#2B3E7E]">{gradeName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push(comeFrom)}
              variant="outline"
              size="sm"
              className="border-[#2B3E7E] text-[#2B3E7E] hover:bg-[#2B3E7E]/10 flex items-center gap-2 bg-transparent"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#2B3E7E] hover:bg-[#2B3E7E]/10 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 pt-6">
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-blue-50 border-l-4 border-[#2B3E7E] rounded-r-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-[#2B3E7E] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#2B3E7E] text-sm md:text-base mb-1">Critérios de ordenação</h3>
              <p className="text-gray-700 text-xs md:text-sm">
                Disciplinas ordenadas por: <span className="font-medium">1. Obrigatória</span>,{" "}
                <span className="font-medium">2. Mais pré-requisitada</span>,{" "}
                <span className="font-medium">3. Menor semestre</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-8">
        <div className="lg:hidden mb-4 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-1 flex gap-1">
            <button
              onClick={() => setMobileView("recommended")}
              className={`flex-1 py-3 rounded-md font-medium transition-all ${
                mobileView === "recommended"
                  ? "bg-[#2B3E7E] text-white"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              Nova Grade
            </button>
            <button
              onClick={() => setMobileView("reserve")}
              className={`flex-1 py-3 rounded-md font-medium transition-all ${
                mobileView === "reserve" ? "bg-[#2B3E7E] text-white" : "bg-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              Reservas
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${mobileView !== "recommended" ? "hidden lg:block" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnRecommended}
          >
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 lg:p-6">
              <div className="mb-2 lg:mb-6">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempGradeName}
                      onChange={(e) => setTempGradeName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveGradeName()
                        if (e.key === "Escape") cancelEditingName()
                      }}
                      className="text-2xl font-bold text-gray-900 border-2 border-[#2B3E7E] rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-[#2B3E7E]"
                      autoFocus
                    />
                    <button
                      onClick={saveGradeName}
                      className="text-green-600 hover:text-green-700 p-2"
                      aria-label="Salvar nome"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEditingName}
                      className="text-gray-500 hover:text-gray-700 transition-colors p-2"
                      aria-label="Cancelar edição"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h2 className="text-2xl font-bold text-gray-900">{gradeName.toUpperCase()}</h2>
                    <button
                      onClick={startEditingName}
                      className="text-gray-400 hover:text-[#2B3E7E] transition-colors p-1 opacity-0 group-hover:opacity-100"
                      aria-label="Editar nome da grade"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 lg:p-6 pt-0">
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {recommendedCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma disciplina recomendada</h3>
                    <p className="text-gray-600 mb-6">
                      Você precisa gerar recomendações primeiro
                    </p>
                    <Link href="/recommendations">
                      <Button className="bg-[#2B3E7E] hover:bg-[#1f2d5c] text-white">
                        Gerar recomendações
                      </Button>
                    </Link>
                  </div>
                ) : (
                  recommendedCourses.map((course, idx) => (
                  <div
                    key={course.code}
                    className={`rounded-lg ${course.color} cursor-move transition-all duration-200 ${
                      draggingCode === course.code ? "opacity-50 scale-105 shadow-xl ring-4 ring-[#2B3E7E]" : ""
                    }`}
                  >
                    <div className="flex items-stretch">
                      <div
                        className="flex-1 cursor-move hidden md:block"
                        draggable
                        onDragStart={() => handleDragStart(course, "recommended")}
                      >
                        <button
                          onClick={() => toggleEasy(idx)}
                          className="w-full px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {easyExpanded.includes(idx) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronUp className="w-5 h-5" />
                            )}
                            <span className="font-bold text-sm md:text-base">
                              {course.code} - {course.name}
                            </span>
                          </div>
                        </button>
                        {easyExpanded.includes(idx) && (
                          <div className="px-4 pb-4 mx-3 mb-3 bg-white/40 rounded-lg">
                            <div className="space-y-3 py-3">
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-gray-700">Turma:</label>
                                <select
                                  value={selectedClasses[course.code] || course.classes[0].id}
                                  onChange={(e) => handleClassChange(course.code, e.target.value)}
                                  className="text-sm px-3 py-1.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent shadow-sm"
                                >
                                  {course.classes.map((classOption: any) => (
                                    <option key={classOption.id} value={classOption.id}>
                                      {classOption.id}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-start gap-2 leading-relaxed">
                                <span className="text-base">🕐</span>
                                <div className="flex-1">
                                  <span className="font-bold text-gray-900 text-sm">Horário:</span>{" "}
                                  <span className="text-gray-700 text-sm">{getCurrentSchedule(course)}</span>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 leading-relaxed">
                                <span className="text-base">👤</span>
                                <div className="flex-1">
                                  <span className="font-semibold text-gray-700 text-sm">Professor(a):</span>{" "}
                                  <span className="text-gray-600 text-sm">{getCurrentProfessor(course)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 md:hidden">
                        <button
                          onClick={() => toggleEasy(idx)}
                          className="w-full px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {easyExpanded.includes(idx) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronUp className="w-5 h-5" />
                            )}
                            <span className="font-bold text-sm">
                              {course.code} - {course.name}
                            </span>
                          </div>
                        </button>
                        {easyExpanded.includes(idx) && (
                          <div className="px-3 pb-3 mx-2 mb-2 bg-white/40 rounded-lg">
                            <div className="space-y-3 py-3">
                              <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-gray-700">Turma:</label>
                                <select
                                  value={selectedClasses[course.code] || course.classes[0].id}
                                  onChange={(e) => handleClassChange(course.code, e.target.value)}
                                  className="text-xs px-2 py-1 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent"
                                >
                                  {course.classes.map((classOption: any) => (
                                    <option key={classOption.id} value={classOption.id}>
                                      {classOption.id}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-start gap-2 leading-relaxed">
                                <span className="text-sm">🕐</span>
                                <div className="flex-1">
                                  <span className="font-bold text-gray-900 text-xs">Horário:</span>{" "}
                                  <span className="text-gray-700 text-xs">{getCurrentSchedule(course)}</span>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 leading-relaxed">
                                <span className="text-sm">👤</span>
                                <div className="flex-1">
                                  <span className="font-semibold text-gray-700 text-xs">Professor(a):</span>{" "}
                                  <span className="text-gray-600 text-xs">{getCurrentProfessor(course)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => moveToReserve(course)}
                        className="px-2 md:px-3 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors border-l border-black/10"
                        aria-label="Mover para reserva"
                      >
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                  ))
                )}
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => setShowAnalysis(true)}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-6 text-base font-medium"
                >
                  VER ANÁLISE
                </Button>
              </div>
            </div>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${mobileView !== "reserve" ? "hidden lg:block" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnReserve}
          >
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 lg:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">DISCIPLINAS RESERVA</h2>
              <p className="text-xs md:text-sm text-gray-600 italic">arraste para adicionar à grade</p>
            </div>
            <div className="p-4 lg:p-6 pt-0">
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {reserveCoursesList.map((course, idx) => (
                  <div
                    key={course.code}
                    className={`rounded-lg ${course.color} transition-all duration-200 ${
                      draggingCode === course.code ? "opacity-50 scale-105 shadow-xl ring-4 ring-[#2B3E7E]" : ""
                    }`}
                  >
                    <div className="flex items-stretch">
                      <button
                        onClick={() => moveToRecommended(course)}
                        className="px-2 md:px-3 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors border-r border-black/10"
                        aria-label="Mover para grade recomendada"
                      >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                      </button>

                      <div
                        className="flex-1 cursor-move hidden md:block"
                        draggable
                        onDragStart={() => handleDragStart(course, "reserve")}
                      >
                        <button
                          onClick={() => toggleReserve(idx)}
                          className="w-full px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {reserveExpanded.includes(idx) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronUp className="w-5 h-5" />
                            )}
                            <span className="font-bold text-sm md:text-base">
                              {course.code} - {course.name}
                            </span>
                          </div>
                        </button>
                        {reserveExpanded.includes(idx) && (
                          <div className="px-4 pb-4 mx-3 mb-3 bg-white/40 rounded-lg">
                            <div className="space-y-3 py-3">
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-gray-700">Turma:</label>
                                <select
                                  value={selectedClasses[course.code] || course.classes[0].id}
                                  onChange={(e) => handleClassChange(course.code, e.target.value)}
                                  className="text-sm px-3 py-1.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent shadow-sm"
                                >
                                  {course.classes.map((classOption: any) => (
                                    <option key={classOption.id} value={classOption.id}>
                                      {classOption.id}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-start gap-2 leading-relaxed">
                                <span className="text-base">🕐</span>
                                <div className="flex-1">
                                  <span className="font-bold text-gray-900 text-sm">Horário:</span>{" "}
                                  <span className="text-gray-700 text-sm">{getCurrentSchedule(course)}</span>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 leading-relaxed">
                                <span className="text-base">👤</span>
                                <div className="flex-1">
                                  <span className="font-semibold text-gray-700 text-sm">Professor(a):</span>{" "}
                                  <span className="text-gray-600 text-sm">{getCurrentProfessor(course)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 md:hidden">
                        <button
                          onClick={() => toggleReserve(idx)}
                          className="w-full px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {reserveExpanded.includes(idx) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronUp className="w-5 h-5" />
                            )}
                            <span className="font-bold text-sm">
                              {course.code} - {course.name}
                            </span>
                          </div>
                        </button>
                        {reserveExpanded.includes(idx) && (
                          <div className="px-3 pb-3 mx-2 mb-2 bg-white/40 rounded-lg">
                            <div className="space-y-3 py-3">
                              <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-gray-700">Turma:</label>
                                <select
                                  value={selectedClasses[course.code] || course.classes[0].id}
                                  onChange={(e) => handleClassChange(course.code, e.target.value)}
                                  className="text-xs px-2 py-1 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent"
                                >
                                  {course.classes.map((classOption: any) => (
                                    <option key={classOption.id} value={classOption.id}>
                                      {classOption.id}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-start gap-2 leading-relaxed">
                                <span className="text-sm">🕐</span>
                                <div className="flex-1">
                                  <span className="font-bold text-gray-900 text-xs">Horário:</span>{" "}
                                  <span className="text-gray-700 text-xs">{getCurrentSchedule(course)}</span>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 leading-relaxed">
                                <span className="text-sm">👤</span>
                                <div className="flex-1">
                                  <span className="font-semibold text-gray-700 text-xs">Professor(a):</span>{" "}
                                  <span className="text-gray-600 text-xs">{getCurrentProfessor(course)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                variant="outline"
                className="px-8 py-6 text-base border-[#2B3E7E] text-[#2B3E7E] hover:bg-[#2B3E7E]/10 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? "Gerando PDF..." : "Baixar em PDF"}
              </Button>
              <Button
                onClick={handleSaveResults}
                disabled={isSaving}
                className="px-8 py-6 text-base bg-[#2B3E7E] hover:bg-[#1f2d5c] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Salvando..." : isTestMode ? "Salvar resultados/criar conta" : "Criar/Salvar resultados"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showAnalysis && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="analysis-title"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 id="analysis-title" className="text-xl md:text-2xl font-bold text-[#2B3E7E]">
                📊 Sobre a Grade
              </h3>
              <button
                onClick={() => setShowAnalysis(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Fechar análise da grade"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Resumo geral */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Dias com aulas na semana:</span>
                  <span className="text-[#2B3E7E] font-bold">{gradeAnalysis.daysPerWeek}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Carga horária do semestre:</span>
                  <span className="text-[#2B3E7E] font-bold">{gradeAnalysis.semesterWorkload}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Carga horária semanal no campus:</span>
                  <span className="text-[#2B3E7E] font-bold">{gradeAnalysis.weeklyWorkload}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Previsão de semestres até formatura:</span>
                  <span className="text-[#2B3E7E] font-bold">{gradeAnalysis.semestersToGraduation}</span>
                </div>
              </div>

              {/* Distribuição por turno */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Distribuição por turno:</h4>
                <div className="space-y-2">
                  {Object.entries(gradeAnalysis.shiftDistribution).map(([shift, percentage]) => (
                    <div key={shift} className="flex items-center gap-3">
                      <span className="text-gray-700 min-w-[80px]">{shift}:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-[#2B3E7E] h-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tempo diário na universidade */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Tempo estimado diário na universidade:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(gradeAnalysis.dailySchedule).map(([day, time]) => (
                    <div key={day} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                      <span className="font-medium text-gray-700">{day}:</span>
                      <span className="text-gray-900 text-sm">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disciplinas desbloqueadas */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Destrava as seguintes obrigatórias:</h4>
                <div className="flex flex-wrap gap-2">
                  {gradeAnalysis.unlockedCourses.map((course) => (
                    <span
                      key={course}
                      className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <Button
                onClick={() => setShowAnalysis(false)}
                className="w-full bg-[#2B3E7E] hover:bg-[#1f2d5c] text-white py-3"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
