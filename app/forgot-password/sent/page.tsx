import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PasswordRecoverySentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6 inline-block">
            <div className="w-20 h-20 bg-[#2B3E7E] rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#2B3E7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Recuperação de senha</h2>
            <p className="text-gray-600 leading-relaxed mb-2">Enviamos um link de recuperação para seu email.</p>
            <p className="text-sm text-gray-500">Verifique sua caixa de entrada e spam</p>
          </div>

          <Link href="/">
            <Button className="w-full bg-[#2B3E7E] hover:bg-[#1f2d5a] text-white py-6 text-base mb-3">
              Voltar ao login
            </Button>
          </Link>

          <Link href="/reset-password" className="text-sm text-[#2B3E7E] hover:underline">
            Já tenho o código de recuperação
          </Link>
        </div>
      </div>
    </div>
  )
}
