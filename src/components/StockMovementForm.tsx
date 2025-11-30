// src/components/StockMovementForm.tsx

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useInventory } from '../context/InventoryContext';
import type { MovementType } from '../types/inventory';
import Button from './Button';

const StockMovementForm = () => {
  const { products, registerMovement } = useInventory();

  const [productId, setProductId] = useState('');
  const [type, setType] = useState<MovementType>('IN');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!productId) {
      setError('Please select a product.');
      return;
    }

    const quantityNumber = Number(quantity);
    if (Number.isNaN(quantityNumber) || quantityNumber <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }

    const result = registerMovement({
      productId,
      type,
      quantity: quantityNumber,
      notes: notes.trim() || undefined,
    });

    if (!result.success) {
      setError(result.error ?? 'Unable to register movement.');
      return;
    }

    // Reset fields after success
    setQuantity('');
    setNotes('');
  };

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-slate-300 rounded-lg p-4 md:p-5 text-sm text-slate-500 bg-white mb-4">
        You need to add products before registering stock movements.
      </div>
    );
  }

  // UI Calculations
  const selectedProduct = products.find((p) => p.id === productId);
  const currentStock = selectedProduct?.currentStock ?? 0;
  const minStock = selectedProduct?.minStock;

  const quantityNumber = Number(quantity);
  const validQty = !Number.isNaN(quantityNumber) && quantityNumber > 0;

  const projectedStock =
    validQty && selectedProduct
      ? type === 'IN'
        ? currentStock + quantityNumber
        : currentStock - quantityNumber
      : null;

  const attemptingOverRemoval =
    type === 'OUT' && validQty && quantityNumber > currentStock;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-semibold text-slate-800">
          New Stock Movement
        </h2>
        <span className="text-[11px] text-slate-400">
          Record stock entries or exits
        </span>
      </div>

      {error && (
        <div className="mb-3 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 items-start"
      >
        {/* Product selector */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-medium text-slate-700">
            Product *
          </label>
          <select
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>

          {selectedProduct && (
            <div className="mt-1 text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
              <span>
                Current:{' '}
                <span className="font-mono text-slate-800">
                  {currentStock}
                </span>
              </span>

              {typeof minStock === 'number' && (
                <span>
                  Minimum:{' '}
                  <span className="font-mono text-slate-800">
                    {minStock}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Movement type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Type *
          </label>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setType('IN')}
              className={`flex-1 rounded-md border px-2 py-1.5 transition-colors cursor-pointer ${
                type === 'IN'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Entry
            </button>

            <button
              type="button"
              onClick={() => setType('OUT')}
              className={`flex-1 rounded-md border px-2 py-1.5 transition-colors cursor-pointer ${
                type === 'OUT'
                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Exit
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Quantity *
          </label>

          <input
            type="number"
            min={1}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Ex: 5"
          />

          {selectedProduct && (
            <div className="mt-1 space-y-0.5">
              {validQty && projectedStock !== null && (
                <p
                  className={`text-[11px] ${
                    attemptingOverRemoval ? 'text-rose-600' : 'text-slate-500'
                  }`}
                >
                  After {type === 'IN' ? 'entry' : 'exit'}:{' '}
                  <span className="font-mono">
                    {Math.max(projectedStock, 0)}
                  </span>
                </p>
              )}

              {attemptingOverRemoval && (
                <p className="text-[11px] text-rose-600">
                  Quantity exceeds current stock.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-slate-700">Notes</label>

          <textarea
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50 min-h-[70px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Details about this movement (optional)"
          />
        </div>

        <div className="md:col-span-3 flex justify-end pt-1">
          <Button type="submit" size="sm">
            Register Movement
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StockMovementForm;
