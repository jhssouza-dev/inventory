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
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-4 py-2 font-medium text-slate-600">
              Product
            </th>
            <th className="text-left px-4 py-2 font-medium text-slate-600">
              SKU
            </th>
            <th className="text-right px-4 py-2 font-medium text-slate-600">
              Price
            </th>
            <th className="text-right px-4 py-2 font-medium text-slate-600">
              Stock
            </th>
            <th className="text-right px-4 py-2 font-medium text-slate-600">
              Minimum
            </th>
            <th className="text-center px-4 py-2 font-medium text-slate-600">
              Status
            </th>
            <th className="text-center px-4 py-2 font-medium text-slate-600">
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
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800">
                      {product.name}
                    </span>
                    {product.description && (
                      <span className="text-xs text-slate-500">
                        {product.description}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-2 text-slate-700">
                  <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                    {product.sku}
                  </span>
                </td>

                <td className="px-4 py-2 text-right text-slate-700">
                  {formatCurrency(product.price)}
                </td>

                <td className="px-4 py-2 text-right text-slate-800">
                  {product.currentStock}
                </td>

                <td className="px-4 py-2 text-right text-slate-700">
                  {product.minStock}
                </td>

                <td className="px-4 py-2 text-center">
                  <StatusBadge status={status} />
                </td>

                <td className="px-4 py-2 text-center">
                  {product.isActive ? (
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="inline-flex h-2 w-2 rounded-full bg-slate-400" />
                  )}
                </td>

                <td className="px-4 py-2 text-center">
                  <div className="flex flex-col gap-1 items-center">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="text-xs text-slate-700 hover:text-slate-900 underline"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleArchive(product)}
                      className="text-[11px] text-amber-700 hover:text-amber-900 underline"
                      disabled={!product.isActive}
                    >
                      {product.isActive ? 'Archive' : 'Archived'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="text-[11px] text-rose-700 hover:text-rose-900 underline"
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
  );
};

export default ProductTable;
