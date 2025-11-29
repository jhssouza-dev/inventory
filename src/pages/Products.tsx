import { useState } from 'react';
import type { Product } from '../types/inventory';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import EditProductForm from '../components/EditProductForm';
import { useInventory } from '../context/InventoryContext';
import { fetchProductsFromApi } from '../api/dummyProducts';

const Products = () => {
  const { addProduct, products } = useInventory();
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [onlyActive, setOnlyActive] = useState(false);

  const handleImportFromApi = async () => {
    try {
      setIsImporting(true);
      setImportError(null);

      const importedProducts = await fetchProductsFromApi(20);

      const existingSkus = new Set(products.map((p) => p.sku));

      importedProducts.forEach((p) => {
        if (!existingSkus.has(p.sku)) {
          addProduct(p);
        }
      });
    } catch (error) {
      console.error(error);
      setImportError('Error importing products from the API. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header + Import button */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            Register and manage your inventory products.
          </p>
        </div>

        <button
          type="button"
          onClick={handleImportFromApi}
          disabled={isImporting}
          className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isImporting ? 'Importing...' : 'Import Products from API'}
        </button>
      </div>

      {importError && (
        <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {importError}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-2">
          <label className="text-xs font-medium text-slate-700">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Product name or SKU"
            className="w-full md:w-64 rounded-md border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.target.checked)}
          />
          Show only active products
        </label>
      </div>

      {/* New product form */}
      <ProductForm />

      {/* Product edit (conditionally rendered) */}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {/* Filtered product table */}
      <ProductTable
        onEdit={(product) => setEditingProduct(product)}
        searchTerm={searchTerm}
        onlyActive={onlyActive}
      />
    </div>
  );
};

export default Products;
