"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { useToast } from "@/components/toast-container"

export default function RecommendationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromDashboard = searchParams.get("from") === "dashboard"
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [shifts, setShifts] = useState<string[]>([])
  const [bannedProfessors, setBannedProfessors] = useState("")
  const [professorSearch, setProfessorSearch] = useState("")
  const [showProfessorDropdown, setShowProfessorDropdown] = useState(false)
  const [bannedProfessorsList, setBannedProfessorsList] = useState<string[]>([])

  const professors = [
    "Prof. João Silva",
    "Prof. Maria Santos",
    "Prof. Carlos Oliveira",
    "Prof. Ana Costa",
    "Prof. Pedro Ferreira",
    "Prof. Juliana Lima",
    "Prof. Roberto Souza",
    "Prof. Fernanda Alves",
    "Prof. Lucas Martins",
    "Prof. Beatriz Rocha",
  ]

  const filteredProfessors = professors.filter(
    (prof) => prof.toLowerCase().includes(professorSearch.toLowerCase()) && !bannedProfessorsList.includes(prof),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (shifts.length === 0) {
      showToast("Por favor, selecione pelo menos um turno disponível", "warning")
      return
    }

    setIsLoading(true)
    sessionStorage.setItem("schedules_from", "recommendations")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    showToast("Gerando recomendação...", "info", 2000)
    setIsLoading(false)
    router.push("/recommendations/schedules")
  }

  const handleCompleteUpdate = async () => {
    if (shifts.length === 0) {
      showToast("Por favor, selecione pelo menos um turno disponível", "warning")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    showToast("Preferências atualizadas com sucesso!", "success")
    setIsLoading(false)
    setTimeout(() => router.push("/dashboard"), 500)
  }

  const addProfessorToBanned = (professor: string) => {
    setBannedProfessorsList([...bannedProfessorsList, professor])
    setProfessorSearch("")
    setShowProfessorDropdown(false)
  }

  const removeProfessorFromBanned = (professor: string) => {
    setBannedProfessorsList(bannedProfessorsList.filter((p) => p !== professor))
  }

  const toggleShift = (shift: string) => {
    setShifts((prev) => (prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppHeader
        title="Preferências"
        subtitle="Configure suas restrições para geração da grade"
        showBack
        backHref={fromDashboard ? "/dashboard" : "/grades"}
        backLabel="Voltar"
        showLogout={false}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Defina suas preferências</h2>
            <p className="text-gray-600">Configure suas restrições e preferências para a geração da grade</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Turnos disponíveis:</label>
              <div className="flex flex-wrap gap-4">
                {["Matutino", "Vespertino", "Noturno"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shifts.includes(option)}
                      onChange={() => toggleShift(option)}
                      className="w-4 h-4 text-[#2B3E7E] border-gray-300 rounded focus:ring-[#2B3E7E]"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="professorSearch" className="block text-sm font-medium text-gray-700 mb-2">
                Lista de professores a banir (pesquisável)
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
              {fromDashboard ? (
                <Button
                  type="button"
                  onClick={handleCompleteUpdate}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-[#2B3E7E] hover:bg-[#1f2d5a] text-white px-8 py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Salvando..." : "Concluir atualização"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto bg-[#2B3E7E] hover:bg-[#1f2d5a] text-white px-8 py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processando..." : "Gerar recomendação"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
