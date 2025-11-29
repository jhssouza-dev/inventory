import { useMemo, useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import StockMovementForm from '../components/StockMovementForm';
import StockMovementsTable from '../components/StockMovementsTable';
import type { StockMovement } from '../types/inventory';

type MovementTypeFilter = 'ALL' | 'IN' | 'OUT';

const StockMovements = () => {
  const { movements, products } = useInventory();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<MovementTypeFilter>('ALL');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const filteredMovements = useMemo<StockMovement[]>(() => {
    return movements.filter((movement) => {
      // Filter by product
      if (selectedProductId && movement.productId !== selectedProductId) {
        return false;
      }

      // Filter by type
      if (typeFilter !== 'ALL' && movement.type !== typeFilter) {
        return false;
      }

      // Filter by start date
      if (dateFrom) {
        const from = new Date(dateFrom);
        const movementDate = new Date(movement.date);
        if (movementDate < from) return false;
      }

      // Filter by end date (inclusive)
      if (dateTo) {
        const to = new Date(dateTo);
        to.setDate(to.getDate() + 1); // include the entire end day
        const movementDate = new Date(movement.date);
        if (movementDate >= to) return false;
      }

      return true;
    });
  }, [movements, selectedProductId, typeFilter, dateFrom, dateTo]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Stock Movements
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Register stock entries and exits and review the movement history.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Product
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          >
            <option value="">All products</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as MovementTypeFilter)
            }
            className="rounded-md border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          >
            <option value="ALL">All</option>
            <option value="IN">Entries</option>
            <option value="OUT">Exits</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            From date
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            To date
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          />
        </div>
      </div>

      <StockMovementForm />

      <StockMovementsTable movements={filteredMovements} />
    </div>
  );
};

export default StockMovements;
