// src/components/layout/Sidebar.tsx

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Boxes, ArrowLeftRight, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const linkBaseClasses =
    'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors';
  const iconClasses = 'h-4 w-4';

  const renderLinks = () => (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${linkBaseClasses} ${
            isActive
              ? 'bg-slate-700 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`
        }
        onClick={onClose}
      >
        <LayoutDashboard className={iconClasses} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/products"
        className={({ isActive }) =>
          `${linkBaseClasses} ${
            isActive
              ? 'bg-slate-700 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`
        }
        onClick={onClose}
      >
        <Boxes className={iconClasses} />
        <span>Products</span>
      </NavLink>

      <NavLink
        to="/stock-movements"
        className={({ isActive }) =>
          `${linkBaseClasses} ${
            isActive
              ? 'bg-slate-700 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`
        }
        onClick={onClose}
      >
        <ArrowLeftRight className={iconClasses} />
        <span>Stock Movements</span>
      </NavLink>
    </>
  );

  return (
    <>
      {/* Sidebar DESKTOP */}
      <aside className="hidden md:flex md:flex-col w-60 bg-slate-900 text-slate-100 shadow-lg">
        <div className="px-4 py-4 border-b border-slate-800">
          <span className="text-lg font-semibold">Inventory</span>
          <p className="text-xs text-slate-400 mt-1">
            Stock management system
          </p>
        </div>

        <nav className="mt-4 flex-1 flex flex-col gap-1 px-2">
          {renderLinks()}
        </nav>

        <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
          v0.1 • LocalStorage
        </div>
      </aside>

      {/* Sidebar MOBILE - drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={onClose}
            aria-label="Fechar menu"
          />

          <aside className="w-64 bg-slate-900 text-slate-100 shadow-xl flex flex-col">
            <div className="px-4 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-lg font-semibold">Inventory</span>
                <p className="text-xs text-slate-400 mt-1">
                  Stock management system
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-200 hover:bg-slate-800"
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-4 flex-1 flex flex-col gap-1 px-2">
              {renderLinks()}
            </nav>

            <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
              v0.1 • LocalStorage
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
