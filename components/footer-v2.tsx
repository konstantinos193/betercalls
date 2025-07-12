import Link from "next/link"
import { Zap } from "lucide-react"

export function FooterV2() {
  return (
    <footer className="bg-black/30 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center gap-2">
          <Zap className="h-7 w-7 text-cyan-400" />
          <span className="text-xl font-bold text-white tracking-tighter">BetPulse</span>
        </div>
        <p className="mt-4 text-gray-500">Gamble responsibly. Must be of legal age to participate.</p>
        <div className="mt-6 flex justify-center gap-6">
          <Link href="#" className="text-sm text-gray-400 hover:text-white">
            Terms
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white">
            Contact
          </Link>
        </div>
        <p className="mt-6 text-xs text-gray-600">
          &copy; {new Date().getFullYear()} BetPulse. All rights reserved. This is not a betting site.
        </p>
      </div>
    </footer>
  )
}
