"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut } from "lucide-react"

interface AppHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  backHref?: string
  backLabel?: string
  showLogout?: boolean
  logoutHref?: string
}

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  backHref = "/dashboard",
  backLabel = "Voltar",
  showLogout = true,
  logoutHref = "/",
}: AppHeaderProps) {
  return (
    <header className="bg-[#2B3E7E] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/istockphoto-1219565719-612x612.jpg"
              alt="Radar Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold">RADAR</h1>
              <p className="text-xs md:text-sm text-white/80">{subtitle || "Recomendador de disciplinas"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showBack && (
              <Link href={backHref}>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{backLabel}</span>
                </Button>
              </Link>
            )}
            {showLogout && (
              <Link href={logoutHref}>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
