import Link from "next/link"
import { Button } from "@/components/ui/button"

const recommendations = [
  { name: "Banco de dados", semester: 6, shift: "Matutino", professor: "Prof. Silva" },
  { name: "Engenharia de software II", semester: 6, shift: "Vespertino", professor: "Prof. Santos" },
  { name: "Laboratório de programação web", semester: 6, shift: "Noturno", professor: "Prof. Oliveira" },
  { name: "Inteligência artificial", semester: 8, shift: "Matutino", professor: "Prof. Costa" },
]

export default function RecommendationsResultPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-[#2B3E7E] text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Sistema Acadêmico</h1>
                <p className="text-sm text-white/80">Resultado das Recomendações</p>
              </div>
            </div>
            <Link href="/grades">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recomendações Geradas</h2>
                <p className="text-gray-600">Baseado no seu perfil e disponibilidade</p>
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="border-l-4 border-[#2B3E7E] bg-gray-50 p-5 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{rec.name}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Semestre {rec.semester}</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">{rec.shift}</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">{rec.professor}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#2B3E7E] text-[#2B3E7E] hover:bg-[#2B3E7E] hover:text-white bg-transparent"
                  >
                    Selecionar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/recommendations" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Ajustar Critérios
              </Button>
            </Link>
            <Link href="/grades" className="flex-1">
              <Button className="w-full bg-[#2B3E7E] hover:bg-[#1f2d5a] text-white">Confirmar Seleção</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
