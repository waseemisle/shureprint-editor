import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const category = searchParams.get('category');
    
    let products = getProducts();
    
    // Apply filters
    if (name) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    if (category) {
      products = products.filter(p => 
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
