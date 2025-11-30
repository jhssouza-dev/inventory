// src/components/StockMovementsTable.tsx

import type { StockMovement } from '../types/inventory';
import { formatDateTimeShort } from '../utils/format';
import { useInventory } from '../context/InventoryContext';

interface StockMovementsTableProps {
  movements: StockMovement[];
}

const StockMovementsTable = ({ movements }: StockMovementsTableProps) => {
  const { products } = useInventory();

  if (movements.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-lg p-6 text-center text-sm text-slate-500">
        No movements found with the selected filters.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-2 font-medium text-slate-600">
              Product
            </th>
            <th className="text-center px-4 py-2 font-medium text-slate-600">
              Type
            </th>
            <th className="text-center px-4 py-2 font-medium text-slate-600">
              Quantity
            </th>
            <th className="text-left px-4 py-2 font-medium text-slate-600">
              Date
            </th>
            <th className="text-left px-4 py-2 font-medium text-slate-600">
              Notes
            </th>
          </tr>
        </thead>

        <tbody>
          {movements.map((movement) => {
            const product = products.find((p) => p.id === movement.productId);

            return (
              <tr
                key={movement.id}
                className="border-t border-slate-100 hover:bg-slate-50/70"
              >
                {/* Product */}
                <td className="px-4 py-2">
                  {product ? (
                    <span className="font-medium text-slate-800">
                      {product.name}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">
                      Removed product
                    </span>
                  )}
                </td>

                {/* Type */}
                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      movement.type === 'IN'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {movement.type === 'IN' ? 'Entry' : 'Exit'}
                  </span>
                </td>

                {/* Quantity */}
                <td className="px-4 py-2 text-center font-mono">
                  {movement.type === 'OUT'
                    ? `-${movement.quantity}`
                    : movement.quantity}
                </td>

                {/* Date */}
                <td className="px-4 py-2">
                  {formatDateTimeShort(movement.date)}
                </td>

                {/* Notes */}
                <td className="px-4 py-2 text-slate-700">
                  {movement.notes?.trim() || (
                    <span className="text-slate-400 italic">–</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockMovementsTable;
