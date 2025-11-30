// src/components/StockValueChart.tsx
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useInventory } from '../context/InventoryContext';

interface ChartItem {
  id: string;
  name: string;           // nome encurtado para exibição
  fullName: string;       // nome completo para tooltip
  value: number;          // valor total (stock * price)
  formattedValue: string; // valor formatado (€)
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);

// Cores variadas para barras
const BAR_COLORS = [
  '#0f766e',
  '#2563eb',
  '#7c3aed',
  '#ea580c',
  '#16a34a',
  '#db2777',
  '#075985',
  '#4338ca',
  '#b91c1c',
  '#047857',
];

const StockValueChart = () => {
  const { products } = useInventory();

  const data: ChartItem[] = useMemo(() => {
    return products
      .map((p) => {
        const fullName = p.name;
        const shortName =
          fullName.length > 22 ? `${fullName.slice(0, 22)}…` : fullName;

        const value = Math.max(0, p.currentStock * p.price); // proteção extra

        return {
          id: p.id,
          name: shortName,
          fullName,
          value,
          formattedValue: formatCurrency(value),
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [products]);

  if (data.length === 0) {
    return (
      <div className="text-xs text-slate-500">
        Cadastre produtos e registre estoque para visualizar este gráfico.
      </div>
    );
  }

  return (
    <div className="w-full h-72 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 16, right: 40, left: 10 }}
        >
          <CartesianGrid
            strokeDasharray="2 4"
            horizontal
            vertical={false}
            stroke="#e2e8f0"
          />

          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              formatCurrency(Number(v)).replace('€', '').trim()
            }
          />

          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 11, fill: '#0f172a' }}
            axisLine={false}
            tickLine={false}
            width={120}
          />

          <Tooltip
            cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.18)',
              fontSize: 12,
            }}
            formatter={(value) => [
              formatCurrency(Number(value)),
              'Valor em estoque',
            ]}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.fullName ?? ''
            }
          />

          <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={18}>
            <LabelList
              dataKey="formattedValue"
              position="right"
              style={{ fontSize: 11, fill: '#0f172a' }}
            />
            {data.map((entry, index) => (
              <Cell
                key={entry.id}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockValueChart;
