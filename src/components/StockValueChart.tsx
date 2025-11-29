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
  name: string;          // nome encurtado para o eixo
  fullName: string;      // nome completo para tooltip
  value: number;         // valor numérico para o gráfico
  formattedValue: string; // valor já formatado em €
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);

// Paleta de cores para dar mais vida ao gráfico
const barColors = [
  '#0f766e', // teal
  '#2563eb', // blue
  '#7c3aed', // violet
  '#ea580c', // orange
  '#16a34a', // green
  '#db2777', // pink
  '#075985', // sky
  '#4338ca', // indigo
  '#b91c1c', // red
  '#047857', // emerald
];

const StockValueChart = () => {
  const { products } = useInventory();

  const data: ChartItem[] = useMemo(() => {
    const mapped = products.map((p) => {
      const fullName = p.name;
      const short =
        fullName.length > 22 ? `${fullName.slice(0, 22)}…` : fullName;
      const value = p.currentStock * p.price;

      return {
        id: p.id,
        name: short,
        fullName,
        value,
        formattedValue: formatCurrency(value),
      };
    });

    return mapped
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
          margin={{ top: 16, right: 40, left: 10}}
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
            width={110}
          />

          <Tooltip
            cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.18)',
              fontSize: 12,
            }}
            formatter={(value: number) => [
              formatCurrency(Number(value)),
              'Valor em estoque',
            ]}
            labelFormatter={(_, payload) => {
              const item = payload?.[0]?.payload as ChartItem | undefined;
              return item ? item.fullName : '';
            }}
          />

          <Bar
            dataKey="value"
            radius={[4, 4, 4, 4]}
            barSize={18}
            isAnimationActive
          >
            {/* Usa o campo já formatado, sem formatter */}
            <LabelList
              dataKey="formattedValue"
              position="right"
              style={{ fontSize: 11, fill: '#0f172a' }}
            />
            {data.map((entry, index) => (
              <Cell
                key={entry.id}
                fill={barColors[index % barColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockValueChart;
