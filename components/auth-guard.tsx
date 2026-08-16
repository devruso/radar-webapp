"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUser } from "@/lib/context/UserContext"

const PUBLIC_PREFIXES = ["/register", "/forgot-password", "/reset-password"]

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, loading } = useUser()
  const isPublic = pathname === "/" || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  useEffect(() => {
    if (!loading && !isPublic && !isAuthenticated) {
      router.replace("/")
    }
  }, [isAuthenticated, isPublic, loading, router])

  if (!isPublic && (loading || !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verificando sessão...</p>
      </div>
    )
  }

  return children
}
