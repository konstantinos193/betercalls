import { SiteHeader } from "@/components/site-header"
import { FooterV2 } from "@/components/footer-v2"
import { TokenPriceDisplay } from "@/components/token-price-display"

export default function TokenPricesPage() {
  return (
    <div className="bg-[#0D0D0D] text-gray-200 font-sans min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
              €10 in Cryptocurrency
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              See how much 10 EUR is worth in different cryptocurrencies. Prices update in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 10 EUR Display */}
            <div className="bg-black/30 p-8 rounded-xl border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
              <h2 className="text-2xl font-bold text-white mb-4">€10 EUR</h2>
              <p className="text-gray-400 mb-6">
                This is the amount you'll be paying for the subscription. Below you can see how much this is worth in different cryptocurrencies.
              </p>
              <div className="text-3xl font-bold text-cyan-400">
                €10.00
              </div>
            </div>

            {/* Token Prices */}
            <TokenPriceDisplay eurAmount={10} />
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-400">
              <div>
                <h4 className="text-white font-semibold mb-2">Real-time Prices</h4>
                <p>Prices are fetched from CoinGecko API and update automatically</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Multiple Tokens</h4>
                <p>Support for Bitcoin, Ethereum, Solana, USDC, and USDT</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Secure Payments</h4>
                <p>All payments are processed securely through Helio</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterV2 />
    </div>
  )
} 