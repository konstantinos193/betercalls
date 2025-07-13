export interface TokenPrice {
  symbol: string;
  priceEUR: number;
  priceUSD: number;
  change24h: number;
  lastUpdated: string;
}

export interface PriceConversionResult {
  tokenPrices: TokenPrice[];
  euroToUSD: number;
}

// Cache prices for 5 minutes to avoid too many API calls
let priceCache: PriceConversionResult | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getTokenPrices(): Promise<PriceConversionResult> {
  const now = Date.now();
  
  // Return cached prices if still valid
  if (priceCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return priceCache;
  }

  try {
    // Fetch prices from CoinGecko API (free, no API key required)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,usd-coin,tether&vs_currencies=eur,usd&include_24hr_change=true&include_last_updated_at=true'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert to our format
    const tokenPrices: TokenPrice[] = [
      {
        symbol: 'BTC',
        priceEUR: data.bitcoin.eur,
        priceUSD: data.bitcoin.usd,
        change24h: data.bitcoin.eur_24h_change || 0,
        lastUpdated: new Date(data.bitcoin.last_updated_at * 1000).toISOString(),
      },
      {
        symbol: 'ETH',
        priceEUR: data.ethereum.eur,
        priceUSD: data.ethereum.usd,
        change24h: data.ethereum.eur_24h_change || 0,
        lastUpdated: new Date(data.ethereum.last_updated_at * 1000).toISOString(),
      },
      {
        symbol: 'SOL',
        priceEUR: data.solana.eur,
        priceUSD: data.solana.usd,
        change24h: data.solana.eur_24h_change || 0,
        lastUpdated: new Date(data.solana.last_updated_at * 1000).toISOString(),
      },
      {
        symbol: 'USDC',
        priceEUR: data['usd-coin'].eur,
        priceUSD: data['usd-coin'].usd,
        change24h: data['usd-coin'].eur_24h_change || 0,
        lastUpdated: new Date(data['usd-coin'].last_updated_at * 1000).toISOString(),
      },
      {
        symbol: 'USDT',
        priceEUR: data.tether.eur,
        priceUSD: data.tether.usd,
        change24h: data.tether.eur_24h_change || 0,
        lastUpdated: new Date(data.tether.last_updated_at * 1000).toISOString(),
      },
    ];

    // Calculate EUR to USD rate (using USDC as reference)
    const euroToUSD = data['usd-coin'].usd / data['usd-coin'].eur;

    const result: PriceConversionResult = {
      tokenPrices,
      euroToUSD,
    };

    // Cache the result
    priceCache = result;
    cacheTimestamp = now;

    return result;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    
    // Return fallback prices if API fails
    return {
      tokenPrices: [
        { symbol: 'BTC', priceEUR: 45000, priceUSD: 50000, change24h: 0, lastUpdated: new Date().toISOString() },
        { symbol: 'ETH', priceEUR: 3000, priceUSD: 3300, change24h: 0, lastUpdated: new Date().toISOString() },
        { symbol: 'SOL', priceEUR: 100, priceUSD: 110, change24h: 0, lastUpdated: new Date().toISOString() },
        { symbol: 'USDC', priceEUR: 0.91, priceUSD: 1, change24h: 0, lastUpdated: new Date().toISOString() },
        { symbol: 'USDT', priceEUR: 0.91, priceUSD: 1, change24h: 0, lastUpdated: new Date().toISOString() },
      ],
      euroToUSD: 1.1,
    };
  }
}

export function convertEuroToToken(euroAmount: number, tokenSymbol: string, tokenPrices: TokenPrice[]): number {
  const token = tokenPrices.find(t => t.symbol === tokenSymbol);
  if (!token) {
    throw new Error(`Token ${tokenSymbol} not found`);
  }
  
  return euroAmount / token.priceEUR;
}

export function formatTokenAmount(amount: number, tokenSymbol: string): string {
  if (tokenSymbol === 'BTC') {
    return `${amount.toFixed(8)} BTC`;
  } else if (tokenSymbol === 'ETH') {
    return `${amount.toFixed(6)} ETH`;
  } else if (tokenSymbol === 'SOL') {
    return `${amount.toFixed(4)} SOL`;
  } else {
    return `${amount.toFixed(2)} ${tokenSymbol}`;
  }
} 