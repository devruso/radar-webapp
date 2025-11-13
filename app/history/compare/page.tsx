"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const mockGradeDetails = {
  "1": {
    name: "Grade Recomendada - Abril 2024",
    courses: [
      { code: "MATC82", name: "SISTEMAS WEB", schedule: "Quarta e sexta, 20h20 às 22h00" },
      { code: "MATA01", name: "CÁLCULO A", schedule: "Quarta e sexta, 18h30 às 20h20" },
      { code: "MATA64", name: "INTELIGÊNCIA ARTIFICIAL", schedule: "Terça e Quinta, 20h20 às 22h10" },
    ],
  },
  "2": {
    name: "Grade Intensiva",
    courses: [
      { code: "MATC73", name: "INTRODUÇÃO À LÓGICA MATEMÁTICA", schedule: "Segunda a Sexta, 8h às 10h" },
      { code: "MATA62", name: "COMPILADORES", schedule: "Terça e Quinta, 14h às 16h" },
      { code: "MATA68", name: "COMPUTAÇÃO GRÁFICA", schedule: "Segunda e Quarta, 16h às 18h" },
      { code: "MATB09", name: "ÁLGEBRA LINEAR", schedule: "Terça e Quinta, 10h às 12h" },
    ],
  },
  "3": {
    name: "Grade Balanceada - Fevereiro",
    courses: [
      { code: "MATA55", name: "PROGRAMAÇÃO ORIENTADA A OBJETOS", schedule: "Segunda e Quarta, 14h às 16h" },
      { code: "MATA58", name: "SISTEMAS OPERACIONAIS", schedule: "Terça e Quinta, 16h às 18h" },
      { code: "MATA59", name: "REDES DE COMPUTADORES I", schedule: "Segunda e Quarta, 18h às 20h" },
    ],
  },
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const ids = searchParams.get("ids")?.split(",") || []
  const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedGrades((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const gradesData = ids
    .filter((id) => mockGradeDetails[id as keyof typeof mockGradeDetails])
    .map((id) => ({
      id,
      ...mockGradeDetails[id as keyof typeof mockGradeDetails],
    }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-[#2B3E7E] text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/history">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                ← Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Comparação de Grades</h1>
              <p className="text-sm text-white/80">Compare suas grades lado a lado</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {gradesData.length < 2 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-6">Selecione pelo menos 2 grades para comparar</p>
            <Link href="/history">
              <Button className="bg-[#2B3E7E] hover:bg-[#1f2d5c] text-white">Voltar ao Histórico</Button>
            </Link>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${gradesData.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6`}>
            {gradesData.map((grade) => (
              <div key={grade.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#2B3E7E] text-white p-4">
                  <h3 className="font-bold text-lg">{grade.name}</h3>
                  <p className="text-sm text-white/80">{grade.courses.length} disciplinas</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {grade.courses.map((course, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleExpand(`${grade.id}-${idx}`)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                        >
                          <div>
                            <span className="font-semibold text-sm text-gray-900">{course.code}</span>
                            <p className="text-xs text-gray-600 mt-1">{course.name}</p>
                          </div>
                          {expandedGrades[`${grade.id}-${idx}`] ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedGrades[`${grade.id}-${idx}`] && (
                          <div className="px-4 pb-3 text-sm text-gray-600 bg-gray-50">{course.schedule}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
