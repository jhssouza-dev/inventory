// src/utils/stock.ts
import type { Product, StockStatus } from '../types/inventory';

// Centralized logic for stock status
export const getStockStatus = (product: Product): StockStatus => {
  if (product.currentStock === 0) return 'OUT';
  if (product.currentStock <= product.minStock) return 'LOW';
  return 'OK';
};
