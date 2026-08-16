"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { AppHeader } from "@/components/app-header"
import { simulacoesService } from "@/lib/api/services/simulacoes"
import type { SimulacaoGradeDTO } from "@/lib/api/types"

export default function CompareGradesPage() {
  const searchParams = useSearchParams()
  const ids = useMemo(() => (searchParams.get("ids") ?? "")
    .split(",")
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0)
    .slice(0, 3), [searchParams])
  const [grades, setGrades] = useState<SimulacaoGradeDTO[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (ids.length < 2) {
      setError("Selecione ao menos duas grades no histórico.")
      return
    }
    Promise.all(ids.map(simulacoesService.buscar))
      .then(setGrades)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Erro ao comparar grades"))
  }, [ids])

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Comparar grades" showBack backHref="/history" />
      <main className="container mx-auto px-4 py-8">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        ) : grades.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">Carregando comparação...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-4">Critério</th>
                  {grades.map((grade) => <th key={grade.id} className="p-4">{grade.nome}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <th className="p-4">Criada em</th>
                  {grades.map((grade) => <td key={grade.id} className="p-4">{new Date(grade.criadaEm).toLocaleString("pt-BR")}</td>)}
                </tr>
                <tr className="border-b">
                  <th className="p-4">Disciplinas</th>
                  {grades.map((grade) => <td key={grade.id} className="p-4">{grade.turmas.length}</td>)}
                </tr>
                <tr className="border-b align-top">
                  <th className="p-4">Componentes</th>
                  {grades.map((grade) => (
                    <td key={grade.id} className="p-4">
                      {grade.turmas.map((turma) => <p key={turma.id}>{turma.componenteCodigo} — {turma.componenteNome}</p>)}
                    </td>
                  ))}
                </tr>
                <tr className="align-top">
                  <th className="p-4">Horários</th>
                  {grades.map((grade) => (
                    <td key={grade.id} className="p-4">
                      {grade.turmas.flatMap((turma) => Object.entries(turma.horarios ?? {}).map(([day, interval]) => (
                        <p key={`${turma.id}-${day}`}>{day} {interval}: {turma.componenteCodigo}</p>
                      )))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
