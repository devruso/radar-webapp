"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Download } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { useToast } from "@/components/toast-container"

type SavedGrade = {
  id: string
  name: string
  date: string
  type: "easy" | "hard"
  coursesCount: number
}

const mockGrades: SavedGrade[] = [
  {
    id: "1",
    name: "Grade Recomendada - Abril 2024",
    date: "15/04/2024",
    type: "easy",
    coursesCount: 5,
  },
  {
    id: "2",
    name: "Grade Intensiva",
    date: "10/03/2024",
    type: "hard",
    coursesCount: 7,
  },
  {
    id: "3",
    name: "Grade Balanceada - Fevereiro",
    date: "20/02/2024",
    type: "easy",
    coursesCount: 4,
  },
  {
    id: "4",
    name: "Grade Semestre 2024.1",
    date: "05/02/2024",
    type: "easy",
    coursesCount: 6,
  },
]

export default function HistoryPage() {
  const router = useRouter()
  const { showToast } = useToast()
    const [grades, setGrades] = useState<SavedGrade[]>([]) // VAZIO - Dados devem vir do backend
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  
    // TODO: Buscar grades salvas do backend quando endpoint existir
    // useEffect(() => {
    //   historico ou preferencias service
    // }, [])

  const handleRename = (id: string, currentName: string) => {
    setEditingId(id)
    setEditingName(currentName)
  }

  const saveRename = (id: string) => {
    if (!editingName.trim()) {
      showToast("O nome não pode estar vazio", "warning")
      return
    }
    setGrades(grades.map((g) => (g.id === id ? { ...g, name: editingName } : g)))
    setEditingId(null)
    setEditingName("")
    showToast("Nome atualizado com sucesso!", "success")
  }

  const cancelRename = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta grade?")) {
      setGrades(grades.filter((g) => g.id !== id))
      selectedForComparison.delete(id)
      setSelectedForComparison(new Set(selectedForComparison))
      showToast("Grade excluída com sucesso", "success")
    }
  }

  const handleDownload = (id: string) => {
    showToast("Iniciando download da grade...", "info")
    setTimeout(() => {
      showToast("Download concluído!", "success")
    }, 1500)
  }

  const toggleComparison = (id: string) => {
    const newSelected = new Set(selectedForComparison)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedForComparison(newSelected)
  }

  const handleCompare = () => {
    if (selectedForComparison.size < 2) {
      showToast("Selecione pelo menos 2 grades para comparar", "warning")
      return
    }
    const ids = Array.from(selectedForComparison).join(",")
    router.push(`/history/compare?ids=${ids}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <AppHeader
        title="Histórico de Grades"
        subtitle="Visualize e gerencie suas grades salvas"
        showBack
        backHref="/dashboard"
        backLabel="Voltar"
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Comparison Bar */}
        {selectedForComparison.size > 0 && (
          <div className="mb-6 p-4 bg-[#2B3E7E]/10 rounded-lg border border-[#2B3E7E]/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{selectedForComparison.size}</span> grade(s) selecionada(s) para
                comparação
              </p>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setSelectedForComparison(new Set())}
                  className="text-gray-600 flex-1 sm:flex-none"
                >
                  Limpar seleção
                </Button>
                <Button
                  onClick={handleCompare}
                  disabled={selectedForComparison.size < 2}
                  className="bg-[#2B3E7E] hover:bg-[#1f2d5c] text-white flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comparar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Grades List */}
        {grades.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma grade salva</h3>
            <p className="text-gray-600 mb-6">Você ainda não salvou nenhuma recomendação de grade</p>
            <Link href="/dashboard">
              <Button className="bg-[#2B3E7E] hover:bg-[#1f2d5c] text-white">Gerar nova recomendação</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 ${
                  selectedForComparison.has(grade.id) ? "border-[#2B3E7E]" : "border-gray-100"
                }`}
              >
                <div className="p-6">
                  {/* Grade Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {editingId === grade.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => saveRename(grade.id)}
                            className="bg-[#2B3E7E] hover:bg-[#1f2d5c] text-white"
                          >
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelRename}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{grade.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>{grade.date}</span>
                            <span>•</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                grade.type === "easy" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {grade.type === "easy" ? "Fácil" : "Difícil"}
                            </span>
                            <span>•</span>
                            <span>{grade.coursesCount} disciplinas</span>
                          </div>
                        </>
                      )}
                    </div>
                    {editingId !== grade.id && (
                      <input
                        type="checkbox"
                        checked={selectedForComparison.has(grade.id)}
                        onChange={() => toggleComparison(grade.id)}
                        className="w-5 h-5 text-[#2B3E7E] border-gray-300 rounded focus:ring-[#2B3E7E] cursor-pointer"
                      />
                    )}
                  </div>

                  {/* Actions */}
                  {editingId !== grade.id && (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRename(grade.id, grade.name)}
                        className="flex-1 text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Renomear
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(grade.id)}
                        className="flex-1 text-gray-700 hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(grade.id)}
                        className="text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
