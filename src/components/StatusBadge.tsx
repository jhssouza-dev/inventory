import type { StockStatus } from '../types/inventory';

interface StatusBadgeProps {
  status: StockStatus;
}

const statusConfig: Record<
  StockStatus,
  { label: string; className: string }
> = {
  OK: {
    label: 'OK',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  LOW: {
    label: 'Baixo',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  OUT: {
    label: 'Zerado',
    className: 'bg-rose-100 text-rose-700 border-rose-200',
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
