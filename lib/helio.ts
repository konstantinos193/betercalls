import { PAYMENT_TOKENS } from "@/lib/payment-tokens";
import { getTokenPrices, convertEuroToToken } from "@/lib/price-conversion";

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

    // Use JWT token in Authorization header for Helio API
    const url = `${HELIO_API_URL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.apiKey}`, // This is a JWT token
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

    // Get real-time token prices
    const { tokenPrices } = await getTokenPrices()
    
    // Use USDC for subscription payments (most stable)
    const usdcAmount = convertEuroToToken(plan.price, 'USDC', tokenPrices)
    const priceBaseUnits = (usdcAmount * 1_000_000).toString(); // USDC has 6 decimals

    const payload = {
      template: "SUBSCRIPTION",
      name: `${plan.name} Subscription`,
      price: priceBaseUnits,
      pricingCurrency: "6812817fcf4943d0f0e4d5a1", // USDC currency ID from Helio API
    };

    return this.request("/paylink/create/api-key", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async createOneTimePayLink(plan: { name: string; price: number; interval: string }) {
    // Get real-time token prices
    const { tokenPrices } = await getTokenPrices()
    
    // Use USDC for one-time payments (most stable)
    const usdcAmount = convertEuroToToken(plan.price, 'USDC', tokenPrices)
    const priceBaseUnits = (usdcAmount * 1_000_000).toString(); // USDC has 6 decimals

    const payload = {
      template: "PRODUCT",
      name: plan.name,
      price: priceBaseUnits,
      pricingCurrency: "6812817fcf4943d0f0e4d5a1", // USDC currency ID from Helio API
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
