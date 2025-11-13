"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending recovery email
    router.push("/forgot-password/sent")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 bg-[#2B3E7E] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Esqueceu a senha?</h2>
            <p className="text-gray-600 leading-relaxed">
              Digite seu email e enviaremos instruções para recuperar sua senha
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-[#2B3E7E] hover:bg-[#1f2d5a] text-white py-6 text-base">
              Recuperar senha
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#2B3E7E] hover:underline">
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
