'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTokenPrices, formatTokenAmount, type TokenPrice } from '@/lib/price-conversion';
import { RefreshCw } from 'lucide-react';

interface TokenPriceDisplayProps {
  eurAmount: number;
  className?: string;
}

export function TokenPriceDisplay({ eurAmount, className }: TokenPriceDisplayProps) {
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const prices = await getTokenPrices(eurAmount);
      setTokenPrices(prices);
    } catch (err) {
      setError('Failed to fetch token prices');
      console.error('Error fetching token prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [eurAmount]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-white">Token Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin" />
            <span className="ml-2 text-gray-400">Loading prices...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-white">Token Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-400 mb-2">{error}</p>
            <button
              onClick={fetchPrices}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>€{eurAmount} in Crypto</span>
          <button
            onClick={fetchPrices}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
            title="Refresh prices"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tokenPrices.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-800/50"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={token.iconUrl}
                  alt={token.name}
                  className="w-6 h-6 rounded-full"
                />
                <div>
                  <p className="text-white font-medium">{token.name}</p>
                  <p className="text-gray-400 text-sm">
                    €{token.priceInEur.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-mono font-medium">
                  {formatTokenAmount(token.tokenAmount, token.symbol)} {token.symbol}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Prices update automatically • Powered by CoinGecko
        </div>
      </CardContent>
    </Card>
  );
} 