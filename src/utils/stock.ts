// src/utils/stock.ts

import type { Product, StockStatus } from '../types/inventory';

/**
 * Centraliza a lógica de status de estoque para um produto.
 *
 * Regra:
 * - OUT  → estoque === 0
 * - LOW  → estoque > 0 e estoque < minStock
 * - OK   → estoque >= minStock
 */
export const getStockStatus = (product: Product): StockStatus => {
  const { currentStock, minStock } = product;

  if (currentStock === 0) {
    return 'OUT';
  }

  if (currentStock < minStock) {
    return 'LOW';
  }

  return 'OK';
};
