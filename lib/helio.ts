import { PAYMENT_TOKENS } from "@/lib/payment-tokens";

const WALLET_ADDRESSES: Record<string, string> = {
  BTC: process.env.BTC_WALLET_ADDRESS || "",
  SOL: process.env.SOL_WALLET_ADDRESS || "",
  ETH: process.env.ETH_WALLET_ADDRESS || "",
  USDC: process.env.USDC_WALLET_ADDRESS || "",
  USDT: process.env.USDT_WALLET_ADDRESS || "",
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

    const url = `${HELIO_API_URL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    }

    console.log("Request URL:", url)
    console.log("Request method:", options.method || "GET")

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
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://betercalls.com"}/calls`,
    }

    return this.request("/subscribe", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async createOneTimePayLink(plan: { name: string; price: number; interval: string }) {
    // Convert price to base units (USDC has 6 decimals)
    const priceBaseUnits = (plan.price * 1_000_000).toString();

    // Dynamically build recipients array for all supported tokens
    const recipients = PAYMENT_TOKENS.map(token => ({
      wallet: WALLET_ADDRESSES[token.symbol] || "",
      currency: token.symbol,
    }));

    const payload = {
      template: "PRODUCT",
      product: {
        name: plan.name,
        description: `Lifetime access to all ${plan.name} features on BeterCalls.`,
      },
      price: priceBaseUnits,
      pricingCurrency: "USDC",
      features: {
        recipients,
      },
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://betercalls.com"}/calls`,
    };

    try {
      // Pass API key as query param
      const url = `${HELIO_API_URL}/v1/paylink/create/api-key?apiKey=${this.apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Helio API Error:", response.status, response.statusText, errorBody);
        throw new Error(`Helio API Error: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      const responseData = await response.json();
      // The pay link URL is usually in responseData.url or responseData.payLinkUrl
      return responseData;
    } catch (error) {
      console.error("Helio createOneTimePayLink failed:", error);
      throw error;
    }
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
