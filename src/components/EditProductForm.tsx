// src/components/EditProductForm.tsx

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { Product } from '../types/inventory';
import { useInventory } from '../context/InventoryContext';
import Button from './Button';
import { formatNumberDE } from '../utils/format';

interface EditProductFormProps {
  product: Product;
  onCancel: () => void;
}

const EditProductForm = ({ product, onCancel }: EditProductFormProps) => {
  const { updateProduct } = useInventory();

  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);

  // Inicializa o preço já formatado no padrão de-DE (ex: "12,50")
  const [price, setPrice] = useState(
    product.price != null ? formatNumberDE(product.price) : '',
  );

  const [minStock, setMinStock] = useState(String(product.minStock));
  const [description, setDescription] = useState(product.description ?? '');
  const [isActive, setIsActive] = useState(product.isActive);
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

    // Converte string "1.234,56" → 1234.56
    const priceNumber = Number(
      price.replace(/\./g, '').replace(',', '.'),
    );
    const minStockNumber = Number(minStock);

    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      setError('Informe um preço válido.');
      return;
    }

    if (Number.isNaN(minStockNumber) || minStockNumber < 0) {
      setError('Estoque mínimo deve ser um número válido.');
      return;
    }

    updateProduct({
      id: product.id,
      name: name.trim(),
      sku: sku.trim(),
      description: description.trim() || undefined,
      price: priceNumber,
      minStock: minStockNumber,
      isActive,
    });

    onCancel();
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-4 md:p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-semibold text-slate-800">
          Editar produto
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] text-slate-500 hover:text-slate-700 "
        >
          Fechar
        </button>
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
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Preço (€) *
          </label>
          <input
            type="text" // importante: text, para máscara funcionar
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
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <input
            id="isActive"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label
            htmlFor="isActive"
            className="text-xs text-slate-700 select-none"
          >
            Produto ativo
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" size="sm">
            Salvar alterações
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
