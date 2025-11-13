"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function DashboardPage() {
  useEffect(() => {
    sessionStorage.setItem("schedules_from", "dashboard")
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-[#2B3E7E] text-white py-6 px-8 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">RADAR</h1>
              <p className="text-sm text-white/80">Recomendador de Disciplinas da UFBA</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Logout
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Espaço de Usuário</h2>
          <p className="text-gray-600">Gerencie suas informações e recomendações</p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Ver HISTÓRICO DE GRADES */}
          <Link href="/history">
            <div className="bg-gradient-to-br from-[#2B3E7E] to-[#1e2a54] p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-[#2B3E7E] cursor-pointer group relative overflow-hidden">
              {/* Decorative shine effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:scale-105 transition-transform origin-left">
                    Ver HISTÓRICO DE GRADES
                  </h3>
                  <p className="text-white/90 text-sm font-medium">
                    Visualize, compare e gerencie todas as suas recomendações salvas
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Gerar nova grade */}
          <Link href="/recommendations/schedules">
            <div className="bg-gradient-to-br from-[#2B3E7E] to-[#1e2a54] p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-[#2B3E7E] cursor-pointer group relative overflow-hidden">
              {/* Decorative shine effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:scale-105 transition-transform origin-left">
                    Gerar nova grade
                  </h3>
                  <p className="text-white/90 text-sm font-medium">
                    Crie uma nova recomendação de disciplinas personalizada
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Update Grade */}
          <Link href="/grades?from=dashboard">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#2B3E7E]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#2B3E7E]/20 transition">
                  <svg className="w-7 h-7 text-[#2B3E7E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#2B3E7E] transition">
                    Atualizar Disciplinas feitas
                  </h3>
                  <p className="text-gray-600 text-sm">Modifique as disciplinas que você já cursou ou está cursando</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Update Preferences */}
          <Link href="/recommendations?from=dashboard">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#2B3E7E]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#2B3E7E]/20 transition">
                  <svg className="w-7 h-7 text-[#2B3E7E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#2B3E7E] transition">
                    Atualizar PREFERÊNCIAS
                  </h3>
                  <p className="text-gray-600 text-sm">Ajuste suas preferências de horários e professores</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Update Profile */}
          <Link href="/profile">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#2B3E7E]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#2B3E7E]/20 transition">
                  <svg className="w-7 h-7 text-[#2B3E7E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#2B3E7E] transition">
                    Atualizar dados
                  </h3>
                  <p className="text-gray-600 text-sm">Edite suas informações de cadastro e perfil</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
