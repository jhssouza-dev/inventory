import { useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import StatusBadge from '../components/StatusBadge';
import StockValueChart from '../components/StockValueChart';
import type { StockMovement } from '../types/inventory';
import { formatCurrency, formatDateTimeShort } from '../utils/format';
import { getStockStatus } from '../utils/stock';

const Dashboard = () => {
  const { products, movements } = useInventory();

  // Total inventory value (€)
  const totalValue = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.currentStock, 0),
    [products],
  );

  const activeProductsCount = useMemo(
    () => products.filter((p) => p.isActive).length,
    [products],
  );

  const outOfStockCount = useMemo(
    () => products.filter((p) => p.currentStock === 0).length,
    [products],
  );

  const lowStockCount = useMemo(
    () =>
      products.filter(
        (p) => p.currentStock > 0 && p.currentStock <= p.minStock,
      ).length,
    [products],
  );

  // Products that are not OK (low or out of stock)
  const criticalStockProducts = useMemo(
    () => products.filter((p) => getStockStatus(p) !== 'OK'),
    [products],
  );

  // Recent movements (last 5)
  const recentMovements = useMemo<StockMovement[]>(
    () => movements.slice(0, 5),
    [movements],
  );

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Inventory Value */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-slate-600">
            Total Inventory Value
          </h3>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {formatCurrency(totalValue)}
          </p>
        </div>

        {/* Active Products */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-slate-600">
            Active Products
          </h3>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {activeProductsCount}
          </p>
        </div>

        {/* Out of Stock */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-slate-600">
            Out of Stock
          </h3>
          <p className="text-2xl font-semibold text-rose-600 mt-1">
            {outOfStockCount}
          </p>
        </div>

        {/* Low Stock (but not zero) */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-slate-600">
            Low Stock Products
          </h3>
          <p className="text-2xl font-semibold text-amber-600 mt-1">
            {lowStockCount}
          </p>
        </div>
      </div>

      {/* Top value products chart */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Top Products by Inventory Value
        </h3>
        {/* StockValueChart uses products from context */}
        <StockValueChart />
      </div>

      {/* Critical stock products */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Products at Risk (Low or Out of Stock)
        </h3>

        {criticalStockProducts.length === 0 ? (
          <p className="text-sm text-slate-500">
            All products are currently above their minimum stock levels.
          </p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-3 py-2 font-medium text-slate-600">
                  Product
                </th>
                <th className="text-right px-3 py-2 font-medium text-slate-600">
                  Stock
                </th>
                <th className="text-right px-3 py-2 font-medium text-slate-600">
                  Min
                </th>
                <th className="text-center px-3 py-2 font-medium text-slate-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {criticalStockProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-slate-100 hover:bg-slate-50/60"
                >
                  <td className="px-3 py-2">
                    <span className="font-medium text-slate-800">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {product.currentStock}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {product.minStock}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <StatusBadge status={getStockStatus(product)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent movements */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Recent Stock Movements
        </h3>

        {recentMovements.length === 0 ? (
          <p className="text-sm text-slate-500">
            No movements have been registered yet.
          </p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-3 py-2 font-medium text-slate-600">
                  Product
                </th>
                <th className="text-center px-3 py-2 font-medium text-slate-600">
                  Type
                </th>
                <th className="text-center px-3 py-2 font-medium text-slate-600">
                  Qty
                </th>
                <th className="text-left px-3 py-2 font-medium text-slate-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentMovements.map((movement) => {
                const product = products.find(
                  (p) => p.id === movement.productId,
                );

                return (
                  <tr
                    key={movement.id}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-3 py-2">
                      {product ? product.name : 'Removed product'}
                    </td>
                    <td className="px-3 py-2 text-center">
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
                    <td className="px-3 py-2 text-center">
                      {movement.quantity}
                    </td>
                    <td className="px-3 py-2">
                      {formatDateTimeShort(movement.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
