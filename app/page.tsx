"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useToast } from "@/components/toast-container"
import { validateEmail, validateRequired } from "@/lib/validation"
import { FormFieldError } from "@/components/form-field-error"

export default function LoginPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [testCourse, setTestCourse] = useState("")
  const [testMonth, setTestMonth] = useState("")
  const [testYear, setTestYear] = useState("")
  const [showCourseDropdown, setShowCourseDropdown] = useState(false)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const [activeTab, setActiveTab] = useState<"test" | "login">("test")

  const courses = [
    "Ciência da Computação",
    "Sistemas de Informação",
    "Engenharia de Computação",
    "Engenharia Elétrica",
    "Engenharia Mecânica",
    "Engenharia Civil",
    "Medicina",
    "Direito",
    "Administração",
    "Economia",
    "Arquitetura",
    "Psicologia",
  ]

  const filteredCourses = courses.filter((course) => course.toLowerCase().includes(testCourse.toLowerCase()))

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const years = Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() - i).toString())

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    const errors: { email?: string; password?: string } = {}
    const emailError = validateEmail(loginEmail)
    const passwordError = validateRequired(loginPassword, "Senha")

    if (emailError) errors.email = emailError
    if (passwordError) errors.password = passwordError

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors)
      showToast("Por favor, corrija os erros no formulário", "error")
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      showToast("Login realizado com sucesso!", "success")
      router.push("/dashboard")
    }, 1000)
  }

  const handleTestWithoutLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (testCourse && testMonth && testYear) {
      sessionStorage.setItem("testMode", "true")
      sessionStorage.setItem("testCourse", testCourse)
      sessionStorage.setItem("testEntry", `${testMonth}/${testYear}`)
      showToast("Modo de teste iniciado", "info")
      router.push("/grades")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-white border-b py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3 md:gap-4">
          <Image
            src="/images/istockphoto-1219565719-612x612.jpg"
            alt="Radar Logo"
            width={48}
            height={48}
            className="rounded-lg w-10 h-10 md:w-12 md:h-12 object-cover"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#2B3E7E]">Radar</h1>
            <p className="text-xs md:text-sm text-gray-600">Recomendador de disciplinas da UFBA</p>
          </div>
        </div>
      </header>

      <div className="md:hidden w-full bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("test")}
            className={`flex-1 py-3 md:py-4 text-sm md:text-base text-center font-semibold transition ${
              activeTab === "test" ? "bg-[#2B3E7E] text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Testar sem logar
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 md:py-4 text-sm md:text-base text-center font-semibold transition ${
              activeTab === "login" ? "bg-[#2B3E7E] text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Login
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Test Without Login */}
        <div
          className={`flex-1 flex items-center justify-center p-6 md:p-8 bg-[#2B3E7E] ${
            activeTab === "test" ? "block" : "hidden md:flex"
          }`}
        >
          <div className="w-full max-w-md">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Testar sem logar</h2>
              <p className="text-sm md:text-base text-white/80">Experimente o sistema sem criar uma conta</p>
            </div>

            <form className="space-y-4 md:space-y-6" onSubmit={handleTestWithoutLogin}>
              {/* Course Field with Autocomplete */}
              <div className="relative">
                <label htmlFor="test-course" className="block text-sm font-medium text-white mb-2">
                  Seu curso
                </label>
                <input
                  id="test-course"
                  type="text"
                  value={testCourse}
                  onChange={(e) => {
                    setTestCourse(e.target.value)
                    setShowCourseDropdown(true)
                  }}
                  onFocus={() => setShowCourseDropdown(true)}
                  placeholder="Digite seu curso"
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition"
                  required
                />
                {showCourseDropdown && filteredCourses.length > 0 && testCourse && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCourses.map((course) => (
                      <button
                        key={course}
                        type="button"
                        onClick={() => {
                          setTestCourse(course)
                          setShowCourseDropdown(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 transition text-gray-900 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {course}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Entry Date */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Mês e ano de ingresso</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={testMonth}
                    onChange={(e) => setTestMonth(e.target.value)}
                    className="px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white focus:ring-2 focus:ring-white focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="" disabled className="text-gray-900">
                      Mês
                    </option>
                    {months.map((month) => (
                      <option key={month} value={month} className="text-gray-900">
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={testYear}
                    onChange={(e) => setTestYear(e.target.value)}
                    className="px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white focus:ring-2 focus:ring-white focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="" disabled className="text-gray-900">
                      Ano
                    </option>
                    {years.map((year) => (
                      <option key={year} value={year} className="text-gray-900">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-white hover:bg-gray-100 text-[#2B3E7E] py-5 md:py-6 text-base font-semibold"
              >
                Testar
              </Button>
            </form>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div
          className={`flex-1 flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white ${
            activeTab === "login" ? "block" : "hidden md:flex"
          }`}
        >
          <div className="w-full max-w-md">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-block mb-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#2B3E7E] rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Login</h2>
              <p className="text-sm md:text-base text-gray-600">Acesse sua conta para continuar</p>
            </div>

            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value)
                    if (loginErrors.email) setLoginErrors({ ...loginErrors, email: undefined })
                  }}
                  placeholder="seu@email.com"
                  aria-invalid={!!loginErrors.email}
                  aria-describedby={loginErrors.email ? "email-error" : undefined}
                  className={`w-full px-4 py-3 border ${
                    loginErrors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition`}
                />
                <FormFieldError error={loginErrors.email || null} id="email-error" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value)
                    if (loginErrors.password) setLoginErrors({ ...loginErrors, password: undefined })
                  }}
                  placeholder="••••••••"
                  aria-invalid={!!loginErrors.password}
                  aria-describedby={loginErrors.password ? "password-error" : undefined}
                  className={`w-full px-4 py-3 border ${
                    loginErrors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition`}
                />
                <FormFieldError error={loginErrors.password || null} id="password-error" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="text-[#2B3E7E] hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2B3E7E] hover:bg-[#1f2d5a] text-white py-5 md:py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 md:mt-8 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-[#2B3E7E] font-medium hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
