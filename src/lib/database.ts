import { Database, Product, Variant, PriceTier } from '@/types';
import seedData from '@/data/seed.json';

// In-memory database simulation
let database: Database = { ...seedData };

export const getDatabase = (): Database => database;

export const saveDatabase = (newDatabase: Database): void => {
  database = newDatabase;
};

// Product operations
export const getProducts = (): Product[] => database.products;

export const getProductById = (id: string): Product | undefined => 
  database.products.find(p => p.id === id);

// Variant operations
export const getVariantsByProductId = (productId: string): Variant[] => 
  database.variants.filter(v => v.productId === productId);

export const getVariantById = (id: string): Variant | undefined => 
  database.variants.find(v => v.id === id);

// Price tier operations
export const getPriceTiersByVariantId = (variantId: string): PriceTier[] => 
  database.priceTiers
    .filter(t => t.variantId === variantId)
    .sort((a, b) => a.minQty - b.minQty);

export const createPriceTier = (priceTier: Omit<PriceTier, 'id'>): PriceTier => {
  const newId = `t${Date.now()}`;
  const newPriceTier: PriceTier = { ...priceTier, id: newId };
  
  database.priceTiers.push(newPriceTier);
  return newPriceTier;
};

export const updatePriceTier = (id: string, updates: Partial<Omit<PriceTier, 'id'>>): PriceTier | null => {
  const index = database.priceTiers.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  database.priceTiers[index] = { ...database.priceTiers[index], ...updates };
  return database.priceTiers[index];
};

export const deletePriceTier = (id: string): boolean => {
  const index = database.priceTiers.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  database.priceTiers.splice(index, 1);
  return true;
};
