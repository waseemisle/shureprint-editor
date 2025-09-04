export interface Product {
  id: string;
  name: string;
  category: string;
}

export interface Variant {
  id: string;
  productId: string;
  sku: string;
  options: Record<string, string | undefined>;
  active: boolean;
}

export interface PriceTier {
  id: string;
  variantId: string;
  minQty: number;
  price: number;
}

export interface Database {
  products: Product[];
  variants: Variant[];
  priceTiers: PriceTier[];
}
