"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, RefreshCw } from "lucide-react"
import { jsPDF } from "jspdf"

import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/context/UserContext"
import { useRecomendacoes } from "@/lib/hooks/api/useRecomendacoes"
import { simulacoesService } from "@/lib/api/services/simulacoes"
import type { RecomendacaoTurmaDTO } from "@/lib/api/types"

const dayOrder = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"]

interface Meeting {
  day: string
  interval: string
  recommendation: RecomendacaoTurmaDTO
}

export default function SchedulesResultPage() {
  const router = useRouter()
  const { usuarioId } = useUser()
  const { data, loading, error, refetch } = useRecomendacoes(usuarioId)
  const [downloading, setDownloading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [gradeName, setGradeName] = useState("Minha grade")
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const meetings = useMemo(() => {
    const result: Meeting[] = []
    data.forEach((recommendation) => {
      Object.entries(recommendation.turma.horarios ?? {}).forEach(([day, intervals]) => {
        intervals.split(/[,;]/).forEach((interval) => {
          result.push({ day: day.toUpperCase().slice(0, 3), interval: interval.trim(), recommendation })
        })
      })
    })
    return result.sort((first, second) => {
      const day = dayOrder.indexOf(first.day) - dayOrder.indexOf(second.day)
      return day !== 0 ? day : first.interval.localeCompare(second.interval)
    })
  }, [data])

  const downloadPdf = () => {
    setDownloading(true)
    try {
      const pdf = new jsPDF()
      pdf.setFontSize(18)
      pdf.text("Grade recomendada — RADAR", 15, 18)
      pdf.setFontSize(10)
      let y = 30
      data.forEach((item) => {
        const turma = item.turma
        pdf.text(`${item.posicao}. ${turma.componenteCodigo} — ${turma.componenteNome ?? ""}`, 15, y)
        y += 6
        pdf.text(`Turma ${turma.numero} | ${turma.professor} | ${turma.turno ?? "turno não informado"}`, 20, y)
        y += 6
        Object.entries(turma.horarios ?? {}).forEach(([day, interval]) => {
          pdf.text(`${day}: ${interval}`, 20, y)
          y += 5
        })
        y += 4
        if (y > 275) {
          pdf.addPage()
          y = 20
        }
      })
      pdf.save("grade-radar.pdf")
    } finally {
      setDownloading(false)
    }
  }

  const saveSimulation = async () => {
    if (!usuarioId || data.length === 0) return
    setSaving(true)
    setSaveMessage(null)
    try {
      await simulacoesService.salvar({
        usuarioId,
        nome: gradeName,
        metodo: "busca",
        turmaIds: data.map((item) => item.turma.id),
      })
      setSaveMessage("Grade salva no histórico.")
    } catch (saveError) {
      setSaveMessage(saveError instanceof Error ? saveError.message : "Não foi possível salvar a grade.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppHeader
        title="Grade recomendada"
        subtitle="Turmas compatíveis, sem sobreposição de horários"
        showBack
        backHref="/recommendations"
      />

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">Calculando a grade...</div>
        ) : data.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <h2 className="mb-2 text-xl font-semibold">Nenhuma grade verificável foi encontrada</h2>
            <p className="mx-auto mb-6 max-w-2xl text-gray-600">
              O RADAR só inclui turmas com vagas, pré-requisitos atendidos e horários completos. Cadastre ou importe
              as ofertas do semestre antes de simular novamente.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => router.push("/recommendations")}>Ajustar preferências</Button>
              <Button onClick={refetch}><RefreshCw className="mr-2 h-4 w-4" />Simular novamente</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="rounded-xl bg-white p-6 shadow">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold">{data.length} disciplina(s) selecionada(s)</h2>
                  <p className="text-sm text-gray-600">Resultado recalculado pelo backend a partir das suas preferências.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={refetch}><RefreshCw className="mr-2 h-4 w-4" />Recalcular</Button>
                  <Button onClick={downloadPdf} disabled={downloading}>
                    <Download className="mr-2 h-4 w-4" />{downloading ? "Gerando..." : "Baixar PDF"}
                  </Button>
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-2 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-center">
                <label htmlFor="grade-name" className="text-sm font-medium">Nome da simulação</label>
                <input
                  id="grade-name"
                  value={gradeName}
                  maxLength={120}
                  onChange={(event) => setGradeName(event.target.value)}
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                />
                <Button onClick={saveSimulation} disabled={saving || !gradeName.trim()}>
                  {saving ? "Salvando..." : "Salvar no histórico"}
                </Button>
                {saveMessage && <span className="text-sm text-gray-600">{saveMessage}</span>}
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.map((item) => (
                  <article key={item.turma.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm text-[#2B3E7E]">{item.turma.componenteCodigo}</p>
                        <h3 className="font-semibold">{item.turma.componenteNome}</h3>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">#{item.posicao}</span>
                    </div>
                    <p className="text-sm text-gray-700">Turma {item.turma.numero} · {item.turma.professor}</p>
                    <p className="mb-3 text-sm text-gray-500">{item.turma.local} · {item.turma.turno}</p>
                    {Object.entries(item.turma.horarios ?? {}).map(([day, interval]) => (
                      <p key={day} className="text-sm"><strong>{day}:</strong> {interval}</p>
                    ))}
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-bold">Agenda semanal</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dayOrder.map((day) => {
                  const dayMeetings = meetings.filter((meeting) => meeting.day === day)
                  return (
                    <div key={day} className="min-h-28 rounded-lg border bg-gray-50 p-3">
                      <h3 className="mb-2 font-semibold text-[#2B3E7E]">{day}</h3>
                      {dayMeetings.length === 0 ? (
                        <p className="text-sm text-gray-400">Livre</p>
                      ) : dayMeetings.map((meeting) => (
                        <div key={`${meeting.recommendation.turma.id}-${meeting.interval}`} className="mb-2 rounded bg-white p-2 text-sm shadow-sm">
                          <strong>{meeting.interval}</strong>
                          <p>{meeting.recommendation.turma.componenteCodigo}</p>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
