import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ResetPasswordSuccessPage() {
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
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Senha alterada!</h2>
            <p className="text-gray-600 leading-relaxed">
              Sua senha foi alterada com sucesso. Você já pode fazer login com sua nova senha.
            </p>
          </div>

          <Link href="/">
            <Button className="w-full bg-[#2B3E7E] hover:bg-[#1f2d5a] text-white py-6 text-base">Ir para login</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
