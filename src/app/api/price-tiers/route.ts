import { NextRequest, NextResponse } from 'next/server';
import { 
  getPriceTiersByVariantId, 
  createPriceTier, 
  updatePriceTier, 
  deletePriceTier 
} from '@/lib/database';
import { PriceTier } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get('variantId');
    
    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }
    
    const priceTiers = getPriceTiersByVariantId(variantId);
    return NextResponse.json(priceTiers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch price tiers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variantId, minQty, price } = body;
    
    // Validation
    if (!variantId || !minQty || !price) {
      return NextResponse.json(
        { error: 'variantId, minQty, and price are required' },
        { status: 400 }
      );
    }
    
    if (minQty < 1 || !Number.isInteger(minQty)) {
      return NextResponse.json(
        { error: 'minQty must be an integer >= 1' },
        { status: 400 }
      );
    }
    
    if (price <= 0) {
      return NextResponse.json(
        { error: 'price must be > 0' },
        { status: 400 }
      );
    }
    
    // Check for duplicate minQty
    const existingTiers = getPriceTiersByVariantId(variantId);
    if (existingTiers.some(tier => tier.minQty === minQty)) {
      return NextResponse.json(
        { error: 'A price tier with this minimum quantity already exists' },
        { status: 400 }
      );
    }
    
    const newPriceTier = createPriceTier({ variantId, minQty, price });
    return NextResponse.json(newPriceTier, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create price tier' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, minQty, price } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    const updates: Partial<Omit<PriceTier, 'id'>> = {};
    
    if (minQty !== undefined) {
      if (minQty < 1 || !Number.isInteger(minQty)) {
        return NextResponse.json(
          { error: 'minQty must be an integer >= 1' },
          { status: 400 }
        );
      }
      updates.minQty = minQty;
    }
    
    if (price !== undefined) {
      if (price <= 0) {
        return NextResponse.json(
          { error: 'price must be > 0' },
          { status: 400 }
        );
      }
      updates.price = price;
    }
    
    const updatedTier = updatePriceTier(id, updates);
    
    if (!updatedTier) {
      return NextResponse.json(
        { error: 'Price tier not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedTier);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update price tier' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    const success = deletePriceTier(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Price tier not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete price tier' },
      { status: 500 }
    );
  }
}
