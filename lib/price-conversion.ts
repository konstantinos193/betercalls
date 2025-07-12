export interface TokenPrice {
  symbol: string;
  name: string;
  priceInEur: number;
  eurAmount: number;
  tokenAmount: number;
  iconUrl: string;
}

export async function getTokenPrices(eurAmount: number): Promise<TokenPrice[]> {
  try {
    // Fetch current prices from CoinGecko API
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,usd-coin,tether&vs_currencies=eur&include_24hr_change=true'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }

    const data = await response.json();

    const tokens = [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        id: 'bitcoin',
        iconUrl: '/BTC.svg',
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        id: 'ethereum',
        iconUrl: '/ETH.svg',
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        id: 'solana',
        iconUrl: '/SOL.png',
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        id: 'usd-coin',
        iconUrl: '/USDC.svg',
      },
      {
        symbol: 'USDT',
        name: 'USD Tether',
        id: 'tether',
        iconUrl: '/USDT.svg',
      },
    ];

    return tokens.map(token => {
      const priceInEur = data[token.id]?.eur || 0;
      const tokenAmount = priceInEur > 0 ? eurAmount / priceInEur : 0;

      return {
        symbol: token.symbol,
        name: token.name,
        priceInEur,
        eurAmount,
        tokenAmount,
        iconUrl: token.iconUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching token prices:', error);
    
    // Fallback to approximate prices if API fails
    const fallbackPrices = [
      { symbol: 'BTC', name: 'Bitcoin', priceInEur: 45000, iconUrl: '/BTC.svg' },
      { symbol: 'ETH', name: 'Ethereum', priceInEur: 2800, iconUrl: '/ETH.svg' },
      { symbol: 'SOL', name: 'Solana', priceInEur: 120, iconUrl: '/SOL.png' },
      { symbol: 'USDC', name: 'USD Coin', priceInEur: 0.92, iconUrl: '/USDC.svg' },
      { symbol: 'USDT', name: 'USD Tether', priceInEur: 0.92, iconUrl: '/USDT.svg' },
    ];

    return fallbackPrices.map(token => ({
      ...token,
      eurAmount,
      tokenAmount: eurAmount / token.priceInEur,
    }));
  }
}

export function formatTokenAmount(amount: number, symbol: string): string {
  if (amount === 0) return '0';
  
  if (symbol === 'BTC') {
    return amount.toFixed(8);
  } else if (symbol === 'ETH') {
    return amount.toFixed(6);
  } else if (symbol === 'SOL') {
    return amount.toFixed(4);
  } else {
    return amount.toFixed(2);
  }
} 