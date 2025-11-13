export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return "Email é obrigatório"
  if (!emailRegex.test(email)) return "Email inválido"
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return "Senha é obrigatória"
  if (password.length < 8) return "Senha deve ter pelo menos 8 caracteres"
  if (!/[A-Z]/.test(password)) return "Senha deve conter pelo menos uma letra maiúscula"
  if (!/[a-z]/.test(password)) return "Senha deve conter pelo menos uma letra minúscula"
  if (!/[0-9]/.test(password)) return "Senha deve conter pelo menos um número"
  return null
}

export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) return "As senhas não coincidem"
  return null
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim() === "") return `${fieldName} é obrigatório`
  return null
}

export function getPasswordStrength(password: string): { strength: number; label: string; color: string } {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  if (strength <= 2) return { strength: 1, label: "Fraca", color: "bg-red-500" }
  if (strength <= 4) return { strength: 2, label: "Média", color: "bg-yellow-500" }
  return { strength: 3, label: "Forte", color: "bg-green-500" }
}
