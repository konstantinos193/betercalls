import Link from "next/link"
import { Swords, Twitter, Instagram, Facebook } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Swords className="h-8 w-8 text-green-400" />
              BetCalls
            </Link>
            <p className="text-slate-400 text-base">
              Expert sports predictions and betting calls to give you the edge.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-slate-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="#" className="text-base text-slate-400 hover:text-white">
                      Call Bets
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-slate-400 hover:text-white">
                      Group Access
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-slate-400 hover:text-white">
                      Subscriptions
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="#" className="text-base text-slate-400 hover:text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-slate-400 hover:text-white">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="#" className="text-base text-slate-400 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-slate-400 hover:text-white">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="#" className="text-base text-slate-400 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-slate-400 hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-base text-slate-400 hover:text-white">
                      Responsible Gambling
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-base text-slate-500 text-center">
            &copy; {new Date().getFullYear()} BetCalls. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
