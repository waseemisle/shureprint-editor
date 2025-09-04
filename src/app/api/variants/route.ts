import { NextRequest, NextResponse } from 'next/server';
import { getVariantsByProductId } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const variants = getVariantsByProductId(productId);
    return NextResponse.json(variants);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    );
  }
}
