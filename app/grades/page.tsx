"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { useToast } from "@/components/toast-container"
import { useUser } from "@/lib/context/UserContext"
import { useHistorico } from "@/lib/hooks/api/useHistorico"
import { useComponentes } from "@/lib/hooks/api/useComponentes"
import { usuariosService } from "@/lib/api/services/usuarios"
import type { ComponenteCurricularDTO } from "@/lib/api/types"

interface SemesterData {
  number: number
  courses: ComponenteCurricularDTO[]
}

const OLD_semesters = [
  {
    number: 1,
    courses: [
      { name: "cálculo 1", color: "bg-pink-100 text-pink-700 border-pink-200" },
      { name: "computador, ética e sociedade", color: "bg-blue-100 text-blue-700 border-blue-200" },
      { name: "introdução à lógica de programação", color: "bg-blue-100 text-blue-700 border-blue-200" },
      {
        name: "circuitos digitais e arquitetura de computadores",
        color: "bg-green-100 text-green-700 border-green-200",
      },
      {
        name: "Seminários de introdução ao curso",
        color: "bg-green-100 text-green-700 border-green-200",
      },
    ],
  },
  {
    number: 2,
    courses: [
      { name: "economia da inovação", color: "bg-purple-100 text-purple-700 border-purple-200" },
      {
        name: "circuitos digitais e arquitetura de computadores",
        color: "bg-purple-100 text-purple-700 border-purple-200",
      },
      { name: "estruturas de dados", color: "bg-orange-100 text-orange-700 border-orange-200" },
      { name: "fundamentos de sistemas de informação", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
      { name: "introdução à lógica matemática", color: "bg-pink-100 text-pink-700 border-pink-200" },
    ],
  },
  {
    number: 3,
    courses: [
      { name: "álgebra linear", color: "bg-pink-100 text-pink-700 border-pink-200" },
      { name: "introdução a administração", color: "bg-purple-100 text-purple-700 border-purple-200" },
      {
        name: "introdução a linguagens formais e teoria da computação",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      { name: "programação orientada a objetos", color: "bg-blue-100 text-blue-700 border-blue-200" },
      { name: "sistemas operacionais", color: "bg-green-100 text-green-700 border-green-200" },
    ],
  },
  {
    number: 4,
    courses: [
      { name: "engenharia de software I", color: "bg-orange-100 text-orange-700 border-orange-200" },
      { name: "métodos estatísticos", color: "bg-pink-100 text-pink-700 border-pink-200" },
      { name: "oficina de leitura e produção de textos", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      { name: "redes de computadores I", color: "bg-green-100 text-green-700 border-green-200" },
      { name: "sistemas web", color: "bg-green-100 text-green-700 border-green-200" },
    ],
  },
  {
    number: 5,
    courses: [
      { name: "banco de dados", color: "bg-purple-100 text-purple-700 border-purple-200" },
      { name: "engenharia de software II", color: "bg-orange-100 text-orange-700 border-orange-200" },
      { name: "laboratório de programação web", color: "bg-green-100 text-green-700 border-green-200" },
      {
        name: "métodos quantitativos aplicados à administração",
        color: "bg-purple-100 text-purple-700 border-purple-200",
      },
      { name: "paradigmas de linguagem de programação", color: "bg-blue-100 text-blue-700 border-blue-200" },
    ],
  },
  {
    number: 6,
    courses: [
      { name: "aplicações para dispositivos móveis", color: "bg-green-100 text-green-700 border-green-200" },
      { name: "empreendedores em informática", color: "bg-purple-100 text-purple-700 border-purple-200" },
      { name: "laboratório de banco de dados", color: "bg-purple-100 text-purple-700 border-purple-200" },
      { name: "linguagens para aplicação comercial", color: "bg-blue-100 text-blue-700 border-blue-200" },
      { name: "sistemas de apoio a decisão", color: "bg-purple-100 text-purple-700 border-purple-200" },
    ],
  },
  {
    number: 7,
    courses: [
      { name: "inteligência artificial", color: "bg-orange-100 text-orange-700 border-orange-200" },
      { name: "interação humano computador", color: "bg-orange-100 text-orange-700 border-orange-200" },
      { name: "qualidade de software", color: "bg-orange-100 text-orange-700 border-orange-200" },
      {
        name: "segurança e auditoria de sistemas de informação",
        color: "bg-green-100 text-green-700 border-green-200",
      },
      { name: "sistemas multimidia", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    ],
  },
  {
    number: 8,
    courses: [],
  },
  {
    number: 9,
    courses: [{ name: "tcc bacharelado sistemas de informação I", color: "bg-red-100 text-red-700 border-red-200" }],
  },
  {
    number: 10,
    courses: [{ name: "tcc bacharelado sistemas de informação II", color: "bg-red-100 text-red-700 border-red-200" }],
  },
]

export default function GradesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromDashboard = searchParams.get("from") === "dashboard"
  const { showToast } = useToast()
  const { usuarioId, usuario } = useUser()
  
  // Buscar componentes e histórico do backend
  const { data: componentes, loading: loadingComponentes } = useComponentes()
  const { data: historico, loading: loadingHistorico } = useHistorico(usuarioId)
  
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
  const [semesters, setSemesters] = useState<SemesterData[]>([])
  const [expandedSemesters, setExpandedSemesters] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  
  // Organizar componentes por semestre
  useEffect(() => {
    if (componentes.length > 0) {
      const semesterMap: Record<number, ComponenteCurricularDTO[]> = {}
      
      componentes.forEach(comp => {
        const nivel = comp.nivel || 1
        if (!semesterMap[nivel]) {
          semesterMap[nivel] = []
        }
        semesterMap[nivel].push(comp)
      })
      
      const semesterData: SemesterData[] = Object.keys(semesterMap)
        .map(Number)
        .sort((a, b) => a - b)
        .map(num => ({
          number: num,
          courses: semesterMap[num]
        }))
      
      setSemesters(semesterData)
      setExpandedSemesters(new Set(semesterData.map(s => s.number)))
    }
  }, [componentes])
  
  // Pré-selecionar disciplinas já cursadas
  useEffect(() => {
    if (usuario?.disciplinasFeitas && usuario.disciplinasFeitas.length > 0) {
      setSelectedCourses(new Set(usuario.disciplinasFeitas))
    }
  }, [usuario])

  const toggleCourse = (componenteId: number) => {
    const courseIdStr = componenteId.toString()
    const newSelected = new Set(selectedCourses)

    if (newSelected.has(courseIdStr)) {
      newSelected.delete(courseIdStr)
    } else {
      newSelected.add(courseIdStr)
    }

    setSelectedCourses(newSelected)
  }

  const toggleSemester = (semesterNumber: number) => {
    const semester = semesters.find((s) => s.number === semesterNumber)
    if (!semester || semester.courses.length === 0) return

    const allSelected = semester.courses.every((c) => selectedCourses.has(c.id.toString()))

    const newSelected = new Set(selectedCourses)

    semester.courses.forEach((course) => {
      const courseIdStr = course.id.toString()
      if (allSelected) {
        newSelected.delete(courseIdStr)
      } else {
        newSelected.add(courseIdStr)
      }
    })

    setSelectedCourses(newSelected)
  }

  const isSemesterFullySelected = (semesterNumber: number) => {
    const semester = semesters.find((s) => s.number === semesterNumber)
    if (!semester || semester.courses.length === 0) return false

    return semester.courses.every((c) => selectedCourses.has(c.id.toString()))
  }

  const toggleSemesterExpansion = (semesterNumber: number) => {
    const newExpanded = new Set(expandedSemesters)
    if (newExpanded.has(semesterNumber)) {
      newExpanded.delete(semesterNumber)
    } else {
      newExpanded.add(semesterNumber)
    }
    setExpandedSemesters(newExpanded)
  }

  const collapsedCount = semesters.length - expandedSemesters.size

  const handleCompleteUpdate = async () => {
    if (!usuarioId) {
      showToast("Erro: usuário não identificado", "error")
      return
    }

    setIsLoading(true)
    try {
      await usuariosService.atualizarDisciplinas(usuarioId, {
        disciplinasFeitas: Array.from(selectedCourses)
      })
      showToast("Disciplinas atualizadas com sucesso!", "success")
      setTimeout(() => router.push("/dashboard"), 500)
    } catch (err: any) {
      showToast(err.message || "Erro ao atualizar disciplinas", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProceedToPreferences = async () => {
    if (!usuarioId) {
      showToast("Erro: usuário não identificado", "error")
      return
    }

    setIsLoading(true)
    try {
      await usuariosService.atualizarDisciplinas(usuarioId, {
        disciplinasFeitas: Array.from(selectedCourses)
      })
      showToast("Navegando para preferências...", "info", 2000)
      router.push("/recommendations")
    } catch (err: any) {
      showToast(err.message || "Erro ao salvar disciplinas", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppHeader
        title="Disciplinas feitas"
        subtitle="Selecione as disciplinas que você já cursou"
        showBack
        backHref={fromDashboard ? "/dashboard" : "/"}
        backLabel={fromDashboard ? "Voltar" : "Sair"}
        showLogout={false}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Grade do seu Curso</h2>
            <p className="text-gray-600">Selecione todas as disciplinas que você já fez</p>
          </div>

          {loadingComponentes ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando disciplinas...</p>
            </div>
          ) : semesters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma disciplina encontrada</p>
            </div>
          ) : (
            <div className={collapsedCount >= 2 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-8"}>
            {semesters.map((semester) => {
              const isExpanded = expandedSemesters.has(semester.number)

              return (
                <div
                  key={semester.number}
                  className={`border rounded-lg ${isExpanded ? "border-l-4 border-[#2B3E7E] pl-6 p-4" : "border-gray-200 p-4"}`}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        id={`semester-${semester.number}`}
                        checked={isSemesterFullySelected(semester.number)}
                        onChange={() => toggleSemester(semester.number)}
                        disabled={semester.courses.length === 0}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 rounded border-gray-300 text-[#2B3E7E] focus:ring-[#2B3E7E] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <label
                        htmlFor={`semester-${semester.number}`}
                        className="text-lg font-bold text-gray-900 cursor-pointer"
                        onClick={(e) => e.preventDefault()}
                      >
                        Semestre {semester.number}
                      </label>
                    </div>
                    <button
                      onClick={() => toggleSemesterExpansion(semester.number)}
                      className="text-[#2B3E7E] hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      aria-label={isExpanded ? "Recolher semestre" : "Expandir semestre"}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <>
                      {semester.courses.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {semester.courses.map((course) => {
                            const courseIdStr = course.id.toString()
                            const isSelected = selectedCourses.has(courseIdStr)
                            const colorClass = `bg-blue-100 text-blue-700 border-blue-200`

                            return (
                              <label
                                key={course.id}
                                className={`px-3 py-2 rounded-lg text-sm font-medium border ${colorClass} transition-all hover:scale-105 cursor-pointer flex items-center gap-2 ${
                                  isSelected ? "ring-2 ring-[#2B3E7E] ring-offset-2" : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleCourse(course.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-[#2B3E7E] focus:ring-[#2B3E7E] cursor-pointer"
                                />
                                {course.nome}
                              </label>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">Nenhuma disciplina cadastrada</p>
                      )}
                    </>
                  )}
                </div>
              )
            })}
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-200">
            {fromDashboard ? (
              <div className="flex justify-center">
                <Button
                  onClick={handleCompleteUpdate}
                  disabled={isLoading}
                  className="bg-[#2B3E7E] text-white hover:bg-[#1f2d5c] px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Salvando..." : "Concluir atualização"}
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button
                  onClick={handleProceedToPreferences}
                  className="bg-[#2B3E7E] text-white hover:bg-[#1f2d5c] px-8 py-6 text-lg"
                >
                  Seguir para preferências
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
