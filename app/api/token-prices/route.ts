import { NextResponse } from 'next/server';
import { getTokenPrices } from '@/lib/price-conversion';

export async function GET() {
  try {
    const priceData = await getTokenPrices();
    
    return NextResponse.json({
      success: true,
      data: priceData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching token prices:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch token prices',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
} 