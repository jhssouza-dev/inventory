// src/components/ProductForm.tsx

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useInventory } from '../context/InventoryContext';
import { formatNumberDE } from '../utils/format';

const ProductForm = () => {
  const { addProduct } = useInventory();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(''); // string formatada ex: "12,50"
  const [minStock, setMinStock] = useState('');
  const [initialStock, setInitialStock] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // mantém apenas dígitos
    const digits = input.replace(/\D/g, '');

    if (!digits) {
      setPrice('');
      return;
    }

    const number = Number(digits) / 100;
    const formatted = formatNumberDE(number);

    setPrice(formatted);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Nome do produto é obrigatório.');
      return;
    }

    if (!sku.trim()) {
      setError('SKU é obrigatório.');
      return;
    }

    // "1.234,56" -> 1234.56
    const priceNumber = Number(
      price.replace(/\./g, '').replace(',', '.'),
    );
    const minStockNumber = Number(minStock);
    const initialStockNumber = initialStock ? Number(initialStock) : 0;

    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      setError('Informe um preço válido.');
      return;
    }

    if (Number.isNaN(minStockNumber) || minStockNumber < 0) {
      setError('Estoque mínimo deve ser um número válido.');
      return;
    }

    if (Number.isNaN(initialStockNumber) || initialStockNumber < 0) {
      setError('Estoque inicial deve ser um número válido.');
      return;
    }

    addProduct({
      name: name.trim(),
      sku: sku.trim(),
      description: description.trim() || undefined,
      price: priceNumber,
      minStock: minStockNumber,
      initialStock: initialStockNumber,
    });

    setName('');
    setSku('');
    setPrice('');
    setMinStock('');
    setInitialStock('');
    setDescription('');
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-semibold text-slate-800">
          Novo produto
        </h2>
        <span className="text-[11px] text-slate-400">
          Campos com * são obrigatórios
        </span>
      </div>

      {error && (
        <div className="mb-3 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Nome *
          </label>
          <input
            type="text"
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Monitor 24''"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            SKU *
          </label>
          <input
            type="text"
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Ex: MON-24-001"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Preço (€) *
          </label>
          <input
            type="text"
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            value={price}
            onChange={handlePriceChange}
            placeholder="0,00"
            inputMode="decimal"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Estoque mínimo *
          </label>
          <input
            type="number"
            min={0}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            placeholder="Ex: 5"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Estoque inicial
          </label>
          <input
            type="number"
            min={0}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            value={initialStock}
            onChange={(e) => setInitialStock(e.target.value)}
            placeholder="Ex: 10"
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-medium text-slate-700">
            Descrição
          </label>
          <textarea
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50 min-h-[70px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes do produto (opcional)"
          />
        </div>

        <div className="md:col-span-2 flex justify-end pt-1">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Salvar produto
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
