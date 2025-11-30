// src/types/inventory.ts

// ---------------------------------------------
// Stock status used across UI components
// ---------------------------------------------
export type StockStatus = 'OK' | 'LOW' | 'OUT';

// ---------------------------------------------
// Stock movement types
// ---------------------------------------------
export type MovementType = 'IN' | 'OUT';

// ---------------------------------------------
// Product structure stored in LocalStorage
// ---------------------------------------------
export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;

  currentStock: number;
  minStock: number;

  createdAt: string;  // ISO timestamp
  updatedAt: string;  // ISO timestamp

  isActive: boolean;
}

// ---------------------------------------------
// Individual stock movement entry
// ---------------------------------------------
export interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  date: string; // ISO timestamp
  notes?: string;
}

// ---------------------------------------------
// Entire Inventory stored in LocalStorage
// ---------------------------------------------
export interface InventoryData {
  products: Product[];
  movements: StockMovement[];
}
