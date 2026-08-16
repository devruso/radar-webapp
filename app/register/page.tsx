"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/toast-container"
import { validateEmail, validatePassword, validatePasswordMatch, validateRequired } from "@/lib/validation"
import { FormFieldError } from "@/components/form-field-error"
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator"
import { useCursos } from "@/lib/hooks/api/useCursos"
import { useUser } from "@/lib/context/UserContext"

const MONTHS = [
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

const YEARS = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i)

export default function RegisterPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { data: cursos } = useCursos()
  const { cadastro } = useUser()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "",
    entryMonth: "",
    entryYear: "",
    initialProfile: "1",
    regularPeriods: "0",
    cr: "",
    graduating: false,
  })

  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [isLoading, setIsLoading] = useState(false)

  const [showCourseDropdown, setShowCourseDropdown] = useState(false)
  const filteredCourses = cursos
    .map((course) => course.nome)
    .filter((course) => course.toLowerCase().includes(formData.course.toLowerCase()))

  const handleCourseChange = (value: string) => {
    setFormData({ ...formData, course: value })
    setShowCourseDropdown(true)

  }

  const handleCourseSelect = (course: string) => {
    setFormData({ ...formData, course })
    setShowCourseDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    const nameError = validateRequired(formData.name, "Nome completo")
    const emailError = validateEmail(formData.email)
    const courseError = validateRequired(formData.course, "Curso")
    const monthError = validateRequired(formData.entryMonth, "Mês de ingresso")
    const yearError = validateRequired(formData.entryYear, "Ano de ingresso")
    const passwordError = validatePassword(formData.password)
    const confirmPasswordError = validatePasswordMatch(formData.password, formData.confirmPassword)
    const initialProfile = Number(formData.initialProfile)
    const regularPeriods = Number(formData.regularPeriods)
    const cr = Number(formData.cr)

    if (nameError) newErrors.name = nameError
    if (emailError) newErrors.email = emailError
    if (courseError) newErrors.course = courseError
    if (monthError) newErrors.entryMonth = monthError
    if (yearError) newErrors.entryYear = yearError
    if (passwordError) newErrors.password = passwordError
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError
    if (!Number.isInteger(initialProfile) || initialProfile < 1) {
      newErrors.initialProfile = "Informe um perfil inicial válido"
    }
    if (!Number.isInteger(regularPeriods) || regularPeriods < 0) {
      newErrors.regularPeriods = "Informe quantos períodos regulares foram cursados"
    }
    if (formData.cr.trim() === "" || !Number.isFinite(cr) || cr < 0 || cr > 10) {
      newErrors.cr = "Informe um CR entre 0 e 10"
    }
    const selectedCourse = cursos.find((course) => course.nome === formData.course)
    if (!selectedCourse) newErrors.course = "Selecione um curso cadastrado no RADAR"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast("Por favor, corrija os erros no formulário", "error")
      return
    }

    setIsLoading(true)
    try {
      await cadastro({
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
        confirmarSenha: formData.confirmPassword,
        cursoId: selectedCourse!.id,
        mesIngresso: MONTHS.indexOf(formData.entryMonth) + 1,
        anoIngresso: Number(formData.entryYear),
        perfilInicial: initialProfile,
        periodosRegularesCursados: regularPeriods,
        coeficienteRendimento: cr,
        statusFormando: formData.graduating,
      })
      showToast("Cadastro realizado com sucesso!", "success")
      router.push("/register/success")
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao realizar cadastro", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Navy blue */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2B3E7E] items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="mb-8 inline-block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">RADAR</h1>
          <p className="text-lg text-white/80">Recomendador de Disciplinas da UFBA</p>
        </div>
      </div>

      {/* Right side - White with form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block mb-4 lg:hidden">
              <div className="w-16 h-16 bg-[#2B3E7E] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro - Aluno</h2>
            <p className="text-gray-600">Crie sua conta para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="space-y-5 pb-6 border-b border-gray-200">
              <legend className="text-sm font-semibold text-[#2B3E7E] mb-4">Dados Pessoais</legend>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    clearError("name")
                  }}
                  placeholder="Seu nome"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`w-full px-4 py-3.5 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base`}
                  required
                />
                <FormFieldError error={errors.name} id="name-error" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    clearError("email")
                  }}
                  placeholder="seu@email.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full px-4 py-3.5 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base`}
                  required
                />
                <FormFieldError error={errors.email} id="email-error" />
              </div>

            </fieldset>

            <fieldset className="space-y-5 pb-6 border-b border-gray-200">
              <legend className="text-sm font-semibold text-[#2B3E7E] mb-4">Informações Acadêmicas</legend>

              <div className="relative">
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                  Curso
                </label>
                <input
                  id="course"
                  type="text"
                  value={formData.course}
                  onChange={(e) => {
                    handleCourseChange(e.target.value)
                    clearError("course")
                  }}
                  onFocus={() => setShowCourseDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCourseDropdown(false), 200)}
                  placeholder="Digite para buscar seu curso"
                  aria-invalid={!!errors.course}
                  aria-describedby={errors.course ? "course-error" : undefined}
                  className={`w-full px-4 py-3.5 border ${
                    errors.course ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base`}
                  required
                  autoComplete="off"
                />
                <FormFieldError error={errors.course} id="course-error" />

                {showCourseDropdown && filteredCourses.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCourses.map((course) => (
                      <button
                        key={course}
                        type="button"
                        onClick={() => handleCourseSelect(course)}
                        className="w-full text-left px-4 py-3.5 hover:bg-[#2B3E7E] hover:text-white transition-colors border-b border-gray-100 last:border-b-0 text-base"
                      >
                        {course}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingresso</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select
                      value={formData.entryMonth}
                      onChange={(e) => setFormData({ ...formData, entryMonth: e.target.value })}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition bg-white text-base"
                      required
                    >
                      <option value="">Mês</option>
                      {MONTHS.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={formData.entryYear}
                      onChange={(e) => setFormData({ ...formData, entryYear: e.target.value })}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition bg-white text-base"
                      required
                    >
                      <option value="">Ano</option>
                      {YEARS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {(errors.entryMonth || errors.entryYear) && (
                  <FormFieldError error={errors.entryMonth || errors.entryYear} id="entry-error" />
                )}
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
                Estes dados aplicam literalmente a legenda de prioridades do SIGAA. Conte somente
                períodos letivos regulares; não inclua trancamento, suspensão ou mobilidade.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="initial-profile" className="block text-sm font-medium text-gray-700 mb-2">
                    Perfil inicial
                  </label>
                  <input
                    id="initial-profile"
                    type="number"
                    min="1"
                    value={formData.initialProfile}
                    onChange={(e) => setFormData({ ...formData, initialProfile: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg"
                    required
                  />
                  <FormFieldError error={errors.initialProfile} id="initial-profile-error" />
                </div>
                <div>
                  <label htmlFor="regular-periods" className="block text-sm font-medium text-gray-700 mb-2">
                    Períodos regulares cursados
                  </label>
                  <input
                    id="regular-periods"
                    type="number"
                    min="0"
                    value={formData.regularPeriods}
                    onChange={(e) => setFormData({ ...formData, regularPeriods: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg"
                    required
                  />
                  <FormFieldError error={errors.regularPeriods} id="regular-periods-error" />
                </div>
              </div>

              <div>
                <label htmlFor="cr" className="block text-sm font-medium text-gray-700 mb-2">
                  Coeficiente de Rendimento (CR)
                </label>
                <input
                  id="cr"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={formData.cr}
                  onChange={(e) => setFormData({ ...formData, cr: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg"
                  required
                />
                <FormFieldError error={errors.cr} id="cr-error" />
              </div>

              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.graduating}
                  onChange={(e) => setFormData({ ...formData, graduating: e.target.checked })}
                  className="mt-1 h-4 w-4"
                />
                <span>Tenho status <strong>FORMANDO</strong> no SIGAA</span>
              </label>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="text-sm font-semibold text-[#2B3E7E] mb-4">Segurança</legend>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    clearError("password")
                  }}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error password-strength" : "password-strength"}
                  className={`w-full px-4 py-3.5 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base`}
                  required
                />
                <FormFieldError error={errors.password} id="password-error" />
                <div id="password-strength">
                  <PasswordStrengthIndicator password={formData.password} />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value })
                    clearError("confirmPassword")
                  }}
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  className={`w-full px-4 py-3.5 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base`}
                  required
                />
                <FormFieldError error={errors.confirmPassword} id="confirm-password-error" />
              </div>
            </fieldset>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2B3E7E] hover:bg-[#1f2d5a] text-white py-6 text-base mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/" className="text-[#2B3E7E] font-medium hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
