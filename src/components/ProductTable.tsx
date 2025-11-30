// src/components/ProductTable.tsx

import { useInventory } from '../context/InventoryContext';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '../utils/format';
import { getStockStatus } from '../utils/stock';
import type { Product } from '../types/inventory';

interface ProductTableProps {
  onEdit?: (product: Product) => void;
  searchTerm?: string;
  onlyActive?: boolean;
}

const ProductTable = ({ onEdit, searchTerm, onlyActive }: ProductTableProps) => {
  const { products, archiveProduct, deleteProduct } = useInventory();

  const normalizedSearch = searchTerm?.trim().toLowerCase() ?? '';

  const filteredProducts = products.filter((product) => {
    if (onlyActive && !product.isActive) return false;

    if (!normalizedSearch) return true;

    const inName = product.name.toLowerCase().includes(normalizedSearch);
    const inSku = product.sku.toLowerCase().includes(normalizedSearch);

    return inName || inSku;
  });

  const handleArchive = (product: Product) => {
    if (!product.isActive) return;

    const confirmed = window.confirm(
      `Archive the product "${product.name}"?\nIt will no longer appear when filtering only active products, but will remain in the history.`,
    );
    if (!confirmed) return;

    archiveProduct(product.id);
  };

  const handleDelete = (product: Product) => {
    const confirmed = window.confirm(
      `Permanently delete the product "${product.name}"?\nPrevious movements will remain, but will appear as "Removed product".`,
    );
    if (!confirmed) return;

    deleteProduct(product.id);
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center text-sm text-slate-500 bg-white">
        No products found with the current filters.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full md:min-w-[800px] text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-slate-600">
                Product
              </th>
              <th className="text-left px-4 py-2 font-medium text-slate-600 hidden sm:table-cell">
                SKU
              </th>
              <th className="text-right px-4 py-2 font-medium text-slate-600 hidden sm:table-cell">
                Price
              </th>
              <th className="text-right px-4 py-2 font-medium text-slate-600">
                Stock
              </th>
              <th className="text-right px-4 py-2 font-medium text-slate-600 hidden sm:table-cell">
                Minimum
              </th>
              <th className="text-center px-4 py-2 font-medium text-slate-600">
                Status
              </th>
              <th className="text-center px-4 py-2 font-medium text-slate-600 hidden sm:table-cell">
                Active
              </th>
              <th className="text-center px-4 py-2 font-medium text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product);

              return (
                <tr
                  key={product.id}
                  className="border-t border-slate-100 hover:bg-slate-50/60"
                >
                  {/* Product + description */}
                  <td className="px-4 py-2 align-top">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800 text-sm">
                        {product.name}
                      </span>
                      {product.description && (
                        <span className="text-xs text-slate-500 line-clamp-2">
                          {product.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-4 py-2 text-slate-700 hidden sm:table-cell align-top">
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                      {product.sku}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-2 text-right text-slate-700 hidden sm:table-cell align-top whitespace-nowrap">
                    {formatCurrency(product.price)}
                  </td>

                  {/* Current stock */}
                  <td className="px-4 py-2 text-right text-slate-800 align-top">
                    {product.currentStock}
                  </td>

                  {/* Min stock */}
                  <td className="px-4 py-2 text-right text-slate-700 hidden sm:table-cell align-top">
                    {product.minStock}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2 text-center align-top">
                    <StatusBadge status={status} />
                  </td>

                  {/* Active indicator */}
                  <td className="px-4 py-2 text-center hidden sm:table-cell align-top">
                    {product.isActive ? (
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    ) : (
                      <span className="inline-flex h-2 w-2 rounded-full bg-slate-400" />
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 text-center align-top">
                    <div className="flex flex-col gap-1 items-center text-[11px]">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className="text-slate-700 hover:text-slate-900 underline cursor-pointer"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleArchive(product)}
                        className="text-amber-700 hover:text-amber-900 underline disabled:text-slate-400 cursor-pointer"
                        disabled={!product.isActive}
                      >
                        {product.isActive ? 'Archive' : 'Archived'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="text-rose-700 hover:text-rose-900 underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
