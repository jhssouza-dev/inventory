import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import type {
  InventoryData,
  Product,
  StockMovement,
  MovementType,
} from '../types/inventory';

const STORAGE_KEY = 'inventory-data-v1';

// ---- Input types ----

export interface CreateProductInput {
  name: string;
  sku: string;
  description?: string;
  price: number;
  minStock: number;
  initialStock?: number;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  minStock?: number;
  isActive?: boolean;
}

export interface RegisterMovementInput {
  productId: string;
  type: MovementType;
  quantity: number;
  notes?: string;
}

interface MovementResult {
  success: boolean;
  error?: string;
}

// ---- Context shape ----

interface InventoryContextValue {
  products: Product[];
  movements: StockMovement[];

  addProduct: (data: CreateProductInput) => void;
  updateProduct: (data: UpdateProductInput) => void;
  registerMovement: (data: RegisterMovementInput) => MovementResult;
  archiveProduct: (id: string) => void;
  deleteProduct: (id: string) => void;

  getProductCurrentStock: (productId: string) => number;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(
  undefined,
);

// ---- LocalStorage helpers ----

function loadFromStorage(): InventoryData {
  if (typeof window === 'undefined') {
    return { products: [], movements: [] };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { products: [], movements: [] };
    }

    const parsed = JSON.parse(raw) as InventoryData;

    return {
      products: parsed.products ?? [],
      movements: parsed.movements ?? [],
    };
  } catch (error) {
    console.error('Failed to read inventory data from LocalStorage', error);
    return { products: [], movements: [] };
  }
}

function saveToStorage(data: InventoryData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save inventory data to LocalStorage', error);
  }
}

// ---- Provider ----

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [data, setData] = useState<InventoryData>(() => loadFromStorage());

  // Persist whenever data changes
  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const addProduct = (input: CreateProductInput) => {
    const now = new Date().toISOString();

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: input.name,
      sku: input.sku,
      description: input.description,
      price: input.price,
      minStock: input.minStock,
      currentStock: input.initialStock ?? 0,
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };

    setData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));
  };

  const updateProduct = (input: UpdateProductInput) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === input.id
          ? {
              ...product,
              ...input,
              updatedAt: new Date().toISOString(),
            }
          : product,
      ),
    }));
  };

  const registerMovement = (input: RegisterMovementInput): MovementResult => {
    if (input.quantity <= 0) {
      return {
        success: false,
        error: 'Quantity must be greater than zero.',
      };
    }

    const product = data.products.find((p) => p.id === input.productId);
    if (!product) {
      return {
        success: false,
        error: 'Product not found.',
      };
    }

    // Block stock out if there is not enough stock
    if (input.type === 'OUT' && product.currentStock < input.quantity) {
      return {
        success: false,
        error: `Insufficient stock. Current stock: ${product.currentStock}, requested: ${input.quantity}.`,
      };
    }

    const now = new Date().toISOString();

    setData((prev) => {
      const prevProduct = prev.products.find((p) => p.id === input.productId);
      if (!prevProduct) {
        return prev;
      }

      const delta = input.type === 'IN' ? input.quantity : -input.quantity;
      const newStock = prevProduct.currentStock + delta;

      const updatedProduct: Product = {
        ...prevProduct,
        currentStock: newStock,
        updatedAt: now,
      };

      const movement: StockMovement = {
        id: crypto.randomUUID(),
        productId: input.productId,
        type: input.type,
        quantity: input.quantity,
        date: now,
        notes: input.notes,
      };

      return {
        products: prev.products.map((p) =>
          p.id === prevProduct.id ? updatedProduct : p,
        ),
        movements: [movement, ...prev.movements],
      };
    });

    return { success: true };
  };

  const archiveProduct = (id: string) => {
    const now = new Date().toISOString();

    setData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id
          ? { ...product, isActive: false, updatedAt: now }
          : product,
      ),
    }));
  };

  const deleteProduct = (id: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== id),
      // Keep movements; UI already handles "Product removed"
    }));
  };

  const getProductCurrentStock = (productId: string) => {
    const product = data.products.find((p) => p.id === productId);
    return product?.currentStock ?? 0;
  };

  const value: InventoryContextValue = {
    products: data.products,
    movements: data.movements,
    addProduct,
    updateProduct,
    registerMovement,
    archiveProduct,
    deleteProduct,
    getProductCurrentStock,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

// ---- Hook ----

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error('useInventory must be used inside InventoryProvider');
  }
  return ctx;
};
