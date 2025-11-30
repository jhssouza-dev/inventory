// src/components/layout/Header.tsx

import {
  LayoutDashboard,
  Boxes,
  MoveRight,
  PackageSearch,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  title: string;
  onToggleMenu?: () => void;
}

const Header = ({ title, onToggleMenu }: HeaderProps) => {
  // Ícone exibido de acordo com o título recebido
  const icon =
    title === 'Products' ? (
      <Boxes size={20} />
    ) : title === 'Stock Movements' ? (
      <MoveRight size={20} />
    ) : title === 'Product Lookup' ? (
      <PackageSearch size={20} />
    ) : (
      <LayoutDashboard size={20} />
    );

  return (
    <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-6">
      {/* Botão de menu - só no mobile */}
      <button
        type="button"
        onClick={onToggleMenu}
        className="mr-3 inline-flex items-center justify-center rounded-md p-1.5 text-slate-700 hover:bg-slate-100 md:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-3 select-none">
        <span className="text-slate-700 hidden md:inline-block">
          {icon}
        </span>

        <h2 className="text-lg md:text-xl font-semibold text-slate-900">
          {title}
        </h2>
      </div>
    </header>
  );
};

export default Header;
