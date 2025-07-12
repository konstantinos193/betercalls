const HELIO_API_URL = "https://api.hel.io/v1"

export class HelioClient {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.HELIO_SECRET_KEY!
    if (!this.apiKey) {
      throw new Error("HELIO_SECRET_KEY is not set in environment variables.")
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${HELIO_API_URL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    }

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Helio API Error: ${response.status} ${response.statusText} - ${errorBody}`)
    }

    return response.json()
  }

  async createSubscriptionPayLink(plan: { name: string; price: number; interval: "monthly" | "annual" }) {
    // NOTE: Helio works with a base currency (e.g., USDC).
    // It will automatically allow payment in other cryptos like SOL, ETH, BTC.
    // You must get your Wallet ID and the Currency ID for USDC from your Helio dashboard.
    const payload = {
      name: `${plan.name} Subscription`,
      amount: plan.price,
      interval: plan.interval === "monthly" ? "MONTHLY" : "YEARLY",
      currency: "USDC", // Base currency
      product: {
        name: `BeterCalls - ${plan.name}`,
        description: `Access to all ${plan.name} features on BeterCalls.`,
      },
      customerDetails: {
        // We will pre-fill these later with user data
        email: true,
        name: true,
      },
      // This is where Helio will send the user after a successful payment
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/calls`,
    }

    return this.request("/subscribe", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }
}

export const helio = new HelioClient()
