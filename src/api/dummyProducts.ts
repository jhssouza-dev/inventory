// src/api/dummyProducts.ts

import type { CreateProductInput } from '../context/InventoryContext';

// Tipos simplificados da DummyJSON
interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
}

interface DummyProductsResponse {
  products: DummyProduct[];
}

// Busca produtos na DummyJSON e converte para CreateProductInput
export async function fetchProductsFromApi(
  limit = 20,
): Promise<CreateProductInput[]> {
  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar produtos da API (${response.status})`);
  }

  const data = (await response.json()) as DummyProductsResponse;

  // Mapeia os produtos da API para o formato que nosso contexto espera
  const mapped: CreateProductInput[] = data.products.map((p) => ({
    name: p.title,
    sku: `API-${p.id}`, // já que a API não tem SKU, criamos um padrão
    description: p.description,
    price: p.price,
    minStock: Math.max(1, Math.round(p.stock * 0.2)), // mínimo = 20% do estoque
    initialStock: p.stock,
  }));

  return mapped;
}
