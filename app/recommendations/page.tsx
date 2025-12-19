"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { useToast } from "@/components/toast-container"
import { useUser } from "@/lib/context/UserContext"
import { useRecomendacoes } from "@/lib/hooks/api/useRecomendacoes"
import { RecommendationCard } from "@/components/RecommendationCard"
import { usuariosService } from "@/lib/api/services/usuarios"
import { turmasService } from "@/lib/api/services/turmas"

export default function RecommendationsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { usuarioId } = useUser()

  // Estados do formulário
  const [shifts, setShifts] = useState<boolean[]>([false, false, false]) // [matutino, vespertino, noturno]
  const [professorSearch, setProfessorSearch] = useState("")
  const [showProfessorDropdown, setShowProfessorDropdown] = useState(false)
  const [bannedProfessorsList, setBannedProfessorsList] = useState<string[]>([])
  const [availableProfessors, setAvailableProfessors] = useState<string[]>([])

  // Hook de recomendações
  const { data: recomendacoes, loading: loadingRecomendacoes, error, refetch } = useRecomendacoes(usuarioId ?? undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Carregar lista de professores únicos do backend
  useEffect(() => {
    if (usuarioId) {
      usuariosService.listarProfessoresBanidos(usuarioId).then(setBannedProfessorsList).catch(console.error)
    }

    // Buscar professores únicos das turmas
    turmasService.listAll().then((turmas) => {
      const uniqueProfs = Array.from(new Set(turmas.map(t => t.professor))).sort()
      setAvailableProfessors(uniqueProfs)
    }).catch(console.error)
  }, [usuarioId])

  const filteredProfessors = availableProfessors.filter(
    (prof) => prof.toLowerCase().includes(professorSearch.toLowerCase()) && !bannedProfessorsList.includes(prof),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!shifts.some(s => s)) {
      showToast("Por favor, selecione pelo menos um turno disponível", "warning")
      return
    }

    if (!usuarioId) {
      showToast("Erro: usuário não identificado", "error")
      return
    }

    setIsSubmitting(true)
    try {
      // Salvar turnos no backend
      await usuariosService.atualizarTurnos(usuarioId, { turnosLivres: shifts })
      
      // Gerar recomendações
      await refetch()
      showToast("Recomendações geradas com sucesso!", "success")
    } catch (err) {
      showToast("Erro ao gerar recomendações", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addProfessorToBanned = async (professor: string) => {
    if (!usuarioId) return
    
    try {
      await usuariosService.banirProfessor(usuarioId, { professorNome: professor })
      setBannedProfessorsList([...bannedProfessorsList, professor])
      setProfessorSearch("")
      setShowProfessorDropdown(false)
      showToast(`Professor ${professor} adicionado à lista de banidos`, "success")
    } catch (err) {
      showToast("Erro ao banir professor", "error")
    }
  }

  const removeProfessorFromBanned = async (professor: string) => {
    if (!usuarioId) return

    try {
      await usuariosService.desbanirProfessor(usuarioId, { professorNome: professor })
      setBannedProfessorsList(bannedProfessorsList.filter((p) => p !== professor))
      showToast(`Professor ${professor} removido da lista de banidos`, "success")
    } catch (err) {
      showToast("Erro ao desbanir professor", "error")
    }
  }

  const toggleShift = (index: number) => {
    setShifts((prev) => {
      const newShifts = [...prev]
      newShifts[index] = !newShifts[index]
      return newShifts
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Defina suas preferências</h2>
            <p className="text-gray-600">Configure suas restrições para geração da recomendação</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Turnos disponíveis:</label>
              <div className="flex flex-wrap gap-4">
                {[{ name: "Matutino", index: 0 }, { name: "Vespertino", index: 1 }, { name: "Noturno", index: 2 }].map((option) => (
                  <label key={option.name} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shifts[option.index]}
                      onChange={() => toggleShift(option.index)}
                      className="w-4 h-4 text-[#2B3E7E] border-gray-300 rounded focus:ring-[#2B3E7E]"
                    />
                    <span className="text-sm text-gray-700">{option.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="professorSearch" className="block text-sm font-medium text-gray-700 mb-2">
                Professores a banir
              </label>
              <div className="relative">
                <input
                  id="professorSearch"
                  type="text"
                  value={professorSearch}
                  onChange={(e) => {
                    setProfessorSearch(e.target.value)
                    setShowProfessorDropdown(true)
                  }}
                  onFocus={() => setShowProfessorDropdown(true)}
                  placeholder="Pesquise um professor..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none"
                />
                {showProfessorDropdown && filteredProfessors.length > 0 && professorSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                    {filteredProfessors.map((prof) => (
                      <button
                        key={prof}
                        type="button"
                        onClick={() => addProfessorToBanned(prof)}
                        className="w-full px-4 py-3 text-left hover:bg-[#2B3E7E]/10 transition text-gray-900 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {prof}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {bannedProfessorsList.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {bannedProfessorsList.map((prof) => (
                    <div
                      key={prof}
                      className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200"
                    >
                      <span className="text-sm">{prof}</span>
                      <button
                        type="button"
                        onClick={() => removeProfessorFromBanned(prof)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-[#2B3E7E] hover:bg-[#1f2d5a] text-white px-8 py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Gerando..." : "Gerar recomendação"}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              Erro: {error}
            </div>
          )}

          {loadingRecomendacoes ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando recomendações...</p>
            </div>
          ) : recomendacoes.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">Nenhuma recomendação disponível</p>
              <Button onClick={handleSubmit} variant="outline" disabled={isSubmitting}>
                {isSubmitting ? "Gerando..." : "Tentar novamente"}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recomendacoes.map((rec) => (
                  <RecommendationCard key={rec.turma.id} recomendacao={rec} />
                ))}
              </div>

              <div className="flex gap-4">
                <Button onClick={() => router.push("/recommendations/result")}>
                  Ver detalhes completos
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
