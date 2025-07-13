"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Shield, LayoutDashboard, Megaphone, Users, Settings, CreditCard } from "lucide-react"

const navItems = [
  { href: "/standoda", label: "Dashboard", icon: LayoutDashboard },
  { href: "/standoda/calls", label: "Calls", icon: Megaphone },
  { href: "/standoda/experts", label: "Experts", icon: Users },
  { href: "/standoda/users", label: "Users", icon: Users },
  { href: "/standoda/plans", label: "Plans", icon: CreditCard },
  { href: "/standoda/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-black/30 border-r border-gray-800/50 p-6 hidden lg:flex flex-col">
      <div className="flex items-center gap-2 mb-10">
        <Shield className="h-8 w-8 text-cyan-400" />
        <span className="text-xl font-bold text-white">BeterCalls Admin</span>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-white hover:bg-gray-800/50",
              pathname === item.href && "bg-cyan-500/10 text-cyan-400",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
