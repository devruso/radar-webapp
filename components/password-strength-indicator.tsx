import { getPasswordStrength } from "@/lib/validation"

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null

  const { strength, label, color } = getPasswordStrength(password)

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors ${level <= strength ? color : "bg-gray-200"}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">Força da senha: {label}</p>
    </div>
  )
}
