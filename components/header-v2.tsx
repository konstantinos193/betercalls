"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Zap, Menu } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

function SignOutButton() {
  return (
    <Button
      variant="ghost"
      className="text-gray-300 hover:bg-gray-800 hover:text-white"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Log Out
    </Button>
  )
}

export function HeaderV2() {
  const { data: session, status } = useSession()
  const user = session?.user
  
  console.log("HeaderV2 - Session status:", status)
  console.log("HeaderV2 - Session data:", session)
  console.log("HeaderV2 - User:", user)
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0D0D0D]/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-7 w-7 text-cyan-400" />
          <span className="text-xl font-bold text-white tracking-tighter">BeterCalls</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/calls" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Calls
          </Link>
          <Link href="/experts" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Experts
          </Link>
          <Link href="/#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" className="text-gray-300 hover:bg-gray-800 hover:text-white">
                <Link href="/account">My Account</Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-gray-300 hover:bg-gray-800 hover:text-white">
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black bg-transparent"
              >
                <Link href="/sign-up">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0D0D0D] border-gray-800/50 text-white">
              <div className="p-6 h-full flex flex-col">
                <Link href="/" className="flex items-center gap-2 mb-8">
                  <Zap className="h-7 w-7 text-cyan-400" />
                  <span className="text-xl font-bold text-white tracking-tighter">BeterCalls</span>
                </Link>
                <nav className="flex flex-col gap-6">
                  <SheetClose asChild>
                    <Link href="/calls" className="text-lg font-medium">
                      Calls
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/experts" className="text-lg font-medium">
                      Experts
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/#pricing" className="text-lg font-medium">
                      Pricing
                    </Link>
                  </SheetClose>
                </nav>
                <div className="mt-auto flex flex-col gap-4">
                  {user ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          href="/account"
                          className="w-full text-left px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-800/50"
                        >
                          My Account
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <SignOutButton />
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black bg-transparent"
                        >
                          <Link href="/login">Login</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="w-full bg-cyan-400 text-black font-bold hover:bg-cyan-300">
                          <Link href="/sign-up">Register</Link>
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
