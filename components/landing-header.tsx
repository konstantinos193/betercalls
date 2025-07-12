"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Swords } from "lucide-react"

export function LandingHeader() {
  const [isOpen, setIsOpen] = React.useState(false)

  const navLinks = [
    { href: "#", label: "Call Bets" },
    { href: "#", label: "Group Access" },
    { href: "#subscriptions", label: "Subscriptions" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Swords className="h-6 w-6 text-green-400" />
          BetCalls
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" className="text-slate-300 hover:bg-slate-800 hover:text-white">
            Login
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-slate-900">Register</Button>
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-900 border-slate-800 text-white">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg" onClick={() => setIsOpen(false)}>
                  <Swords className="h-6 w-6 text-green-400" />
                  BetCalls
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline" className="border-slate-700 bg-transparent">
                    Login
                  </Button>
                  <Button className="bg-green-500 hover:bg-green-600 text-slate-900">Register</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
