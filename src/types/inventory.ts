// Status do estoque para exibição
export type StockStatus = 'OK' | 'LOW' | 'OUT';

// Tipos de movimentação de estoque
export type MovementType = 'IN' | 'OUT';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  currentStock: number;
  minStock: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isActive: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  date: string; // ISO string
  notes?: string;
}

// Estrutura geral que vamos salvar no LocalStorage
export interface InventoryData {
  products: Product[];
  movements: StockMovement[];
}
