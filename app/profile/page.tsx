"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import { useToast } from "@/components/toast-container"
import { validateEmail, validatePassword, validatePasswordMatch, validateRequired } from "@/lib/validation"
import { FormFieldError } from "@/components/form-field-error"
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator"

export default function ProfilePage() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("Nome Completo")
  const [email, setEmail] = useState("usuario@email.com")
  const [course, setCourse] = useState("Sistemas de Informação")
  const [month, setMonth] = useState("Março")
  const [year, setYear] = useState("2021")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

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

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    const nameError = validateRequired(name, "Nome")
    const emailError = validateEmail(email)

    if (nameError) newErrors.name = nameError
    if (emailError) newErrors.email = emailError

    // Validate password fields if user is trying to change password
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = "Senha atual é obrigatória para alterar a senha"
      }
      if (newPassword) {
        const passwordError = validatePassword(newPassword)
        if (passwordError) newErrors.newPassword = passwordError
      } else {
        newErrors.newPassword = "Nova senha é obrigatória"
      }
      if (newPassword && confirmPassword) {
        const matchError = validatePasswordMatch(newPassword, confirmPassword)
        if (matchError) newErrors.confirmPassword = matchError
      } else if (!confirmPassword) {
        newErrors.confirmPassword = "Confirmação de senha é obrigatória"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast("Por favor, corrija os erros no formulário", "error")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (newPassword) {
      showToast("Dados e senha atualizados com sucesso!", "success")
    } else {
      showToast("Dados cadastrais atualizados com sucesso!", "success")
    }

    setIsLoading(false)

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <AppHeader
        title="Atualizar Dados"
        subtitle="Edite suas informações cadastrais"
        showBack
        backHref="/dashboard"
        backLabel="Voltar"
      />

      <main className="max-w-2xl mx-auto px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSave}>
            <fieldset className="space-y-6 pb-6 border-b border-gray-200">
              <legend className="text-base font-semibold text-[#2B3E7E] mb-4">Dados Pessoais</legend>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    clearError("name")
                  }}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`w-full px-4 py-3.5 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base`}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearError("email")
                  }}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full px-4 py-3.5 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base`}
                />
                <FormFieldError error={errors.email} id="email-error" />
              </div>
            </fieldset>

            <fieldset className="space-y-6 pb-6 border-b border-gray-200">
              <legend className="text-base font-semibold text-[#2B3E7E] mb-4">Informações Acadêmicas</legend>

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                  Curso
                </label>
                <select
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base"
                >
                  {courses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mês e ano de ingresso</label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-6 pt-2">
              <legend className="text-base font-semibold text-[#2B3E7E] mb-4">Segurança</legend>

              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha Atual
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value)
                    clearError("currentPassword")
                  }}
                  placeholder="Digite sua senha atual"
                  aria-invalid={!!errors.currentPassword}
                  aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
                  className={`w-full px-4 py-3.5 border ${
                    errors.currentPassword ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base`}
                />
                <FormFieldError error={errors.currentPassword} id="current-password-error" />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    clearError("newPassword")
                  }}
                  placeholder="Digite sua nova senha"
                  aria-invalid={!!errors.newPassword}
                  aria-describedby={errors.newPassword ? "new-password-error password-strength" : "password-strength"}
                  className={`w-full px-4 py-3.5 border ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base`}
                />
                <FormFieldError error={errors.newPassword} id="new-password-error" />
                <div id="password-strength">
                  <PasswordStrengthIndicator password={newPassword} />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    clearError("confirmPassword")
                  }}
                  placeholder="Confirme sua nova senha"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  className={`w-full px-4 py-3.5 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#2B3E7E] focus:border-transparent outline-none transition text-base`}
                />
                <FormFieldError error={errors.confirmPassword} id="confirm-password-error" />
              </div>
            </fieldset>

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2B3E7E] hover:bg-[#1f2d5a] text-white py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
