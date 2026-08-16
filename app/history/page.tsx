"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/context/UserContext"
import { simulacoesService } from "@/lib/api/services/simulacoes"
import type { SimulacaoGradeDTO } from "@/lib/api/types"

export default function HistoryPage() {
  const router = useRouter()
  const { usuarioId } = useUser()
  const [simulations, setSimulations] = useState<SimulacaoGradeDTO[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!usuarioId) {
      setLoading(false)
      return
    }
    simulacoesService.listar(usuarioId)
      .then(setSimulations)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Erro ao carregar o histórico"))
      .finally(() => setLoading(false))
  }, [usuarioId])

  const toggle = (id: number) => {
    setSelected((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : current.length < 3 ? [...current, id] : current)
  }

  const remove = async (id: number) => {
    if (!usuarioId || !window.confirm("Excluir esta simulação?")) return
    await simulacoesService.excluir(id, usuarioId)
    setSimulations((current) => current.filter((item) => item.id !== id))
    setSelected((current) => current.filter((item) => item !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Histórico de grades" showBack backHref="/dashboard" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">Simulações salvas</h2>
            <p className="text-gray-600">Selecione duas ou três para comparar.</p>
          </div>
          <Button
            disabled={selected.length < 2}
            onClick={() => router.push(`/history/compare?ids=${selected.join(",")}`)}
          >
            Comparar ({selected.length})
          </Button>
        </div>

        {loading ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">Carregando...</div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        ) : simulations.length === 0 ? (
          <div className="rounded-lg bg-white p-10 text-center shadow">
            <p className="mb-4 text-gray-600">Você ainda não salvou nenhuma grade.</p>
            <Button onClick={() => router.push("/recommendations")}>Criar simulação</Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {simulations.map((simulation) => (
              <article
                key={simulation.id}
                className={`rounded-xl border bg-white p-5 shadow-sm ${selected.includes(simulation.id) ? "ring-2 ring-[#2B3E7E]" : ""}`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(simulation.id)}
                      onChange={() => toggle(simulation.id)}
                      className="mt-1 h-4 w-4"
                    />
                    <span>
                      <strong className="block">{simulation.nome}</strong>
                      <span className="text-sm text-gray-500">{new Date(simulation.criadaEm).toLocaleString("pt-BR")}</span>
                    </span>
                  </label>
                  <button onClick={() => remove(simulation.id)} aria-label="Excluir simulação" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mb-2 text-sm text-gray-600">{simulation.turmas.length} disciplina(s) · método {simulation.metodo}</p>
                <div className="flex flex-wrap gap-1">
                  {simulation.turmas.map((turma) => (
                    <span key={turma.id} className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
                      {turma.componenteCodigo}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
