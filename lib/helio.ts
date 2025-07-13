import { PAYMENT_TOKENS } from "@/lib/payment-tokens";

const WALLET_ADDRESSES: Record<string, string> = {
  BTC: process.env.BTC_WALLET_ADDRESS || "bc1q3tfcwm2rxjwm9aj76x60gphpt9pglnl4rs3406",
  SOL: process.env.SOL_WALLET_ADDRESS || "7sHE15Cv8UeVj68F9MYpAZBife1TjZQUisCuNdyEpBwp",
  ETH: process.env.ETH_WALLET_ADDRESS || "0x79a2Dd0fCC27879fC258e81310670f0508Aa21BA",
  USDC: process.env.USDC_WALLET_ADDRESS || "7sHE15Cv8UeVj68F9MYpAZBife1TjZQUisCuNdyEpBwp",
  USDT: process.env.USDT_WALLET_ADDRESS || "7sHE15Cv8UeVj68F9MYpAZBife1TjZQUisCuNdyEpBwp",
};

const HELIO_API_URL = "https://api.hel.io/v1"

export class HelioClient {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.HELIO_SECRET_KEY || ""
    console.log("=== HELIO CLIENT CONSTRUCTOR ===")
    console.log("HELIO_SECRET_KEY present:", !!this.apiKey)
    console.log("HELIO_SECRET_KEY length:", this.apiKey.length)
    if (!this.apiKey) {
      console.warn("HELIO_SECRET_KEY is not set in environment variables. Payment functionality will be disabled.")
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    console.log("=== HELIO REQUEST ===")
    console.log("Endpoint:", endpoint)
    console.log("API Key present:", !!this.apiKey)
    
    if (!this.apiKey) {
      throw new Error("Helio payment is not configured. Please set HELIO_SECRET_KEY environment variable.")
    }

    // Use API key in headers instead of query parameter
    const url = `${HELIO_API_URL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.apiKey}`,
    }

    console.log("Request URL:", url)
    console.log("Request method:", options.method || "GET")
    console.log("Request headers:", headers)
    if (options.body) {
      console.log("Request body:", options.body)
    }

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    })

    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("Helio API Error:", response.status, response.statusText, errorBody)
      throw new Error(`Helio API Error: ${response.status} ${response.statusText} - ${errorBody}`)
    }

    const responseData = await response.json()
    console.log("Response data:", responseData)
    return responseData
  }

  async createSubscriptionPayLink(plan: { name: string; price: number; interval: "monthly" | "annual" | "lifetime" }) {
    // For lifetime plans, we'll create a one-time payment link instead of a subscription
    if (plan.interval === "lifetime") {
      return this.createOneTimePayLink(plan)
    }

    // For monthly/annual plans, create a subscription pay link using the SUBSCRIPTION template
    // Convert price to base units (USDC has 6 decimals)
    const priceBaseUnits = (plan.price * 1_000_000).toString();

    // Recipients: all supported tokens
    const recipients = PAYMENT_TOKENS.map(token => ({
      currencyId: token.id,
      walletId: WALLET_ADDRESSES[token.symbol] || "",
    }));

    const payload = {
      template: "SUBSCRIPTION",
      product: {
        name: `${plan.name} Subscription`,
        description: `Access to all ${plan.name} features on BeterCalls.`,
      },
      price: priceBaseUnits,
      pricingCurrency: PAYMENT_TOKENS.find(t => t.symbol === "USDC")?.id || recipients[0].currencyId,
      features: {},
      recipients,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://betercalls.com"}/calls`,
      subscriptionDetails: {
        interval: plan.interval === "monthly" ? "MONTHLY" : "YEARLY",
        description: `${plan.name} subscription on BeterCalls`,
      },
    };

    return this.request("/paylink/create/api-key", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async createOneTimePayLink(plan: { name: string; price: number; interval: string }) {
    // Convert price to base units (USDC has 6 decimals)
    const priceBaseUnits = (plan.price * 1_000_000).toString();

    // Recipients: all supported tokens
    const recipients = PAYMENT_TOKENS.map(token => ({
      currencyId: token.id,
      walletId: WALLET_ADDRESSES[token.symbol] || "",
    }));

    const payload = {
      template: "PRODUCT",
      product: {
        name: plan.name,
        description: `Access to all ${plan.name} features on BeterCalls.`,
      },
      price: priceBaseUnits,
      pricingCurrency: PAYMENT_TOKENS.find(t => t.symbol === "USDC")?.id || recipients[0].currencyId,
      features: {},
      recipients,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://betercalls.com"}/calls`,
    };

    return this.request("/paylink/create/api-key", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

// Create a lazy singleton instance
let helioInstance: HelioClient | null = null

export const getHelioClient = () => {
  if (!helioInstance) {
    helioInstance = new HelioClient()
  }
  return helioInstance
}

// For backward compatibility, export a function that returns the client
export const helio = getHelioClient()
