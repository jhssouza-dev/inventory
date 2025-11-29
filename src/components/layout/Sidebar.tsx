import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Boxes, ArrowLeftRight } from 'lucide-react';

const Sidebar = () => {
  const linkBaseClasses =
    'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors';

  const iconClasses = 'h-4 w-4';

  return (
    <aside className="hidden md:flex md:flex-col h-screen w-60 bg-slate-900 text-slate-100 shadow-lg">
      <div className="px-4 py-4 border-b border-slate-800">
        <span className="text-lg font-semibold">Inventory</span>
        <p className="text-xs text-slate-400 mt-1">
          Stock management system
        </p>
      </div>

      <nav className="mt-4 flex-1 flex flex-col gap-1 px-2">
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
        >
          <ArrowLeftRight className={iconClasses} />
          <span>Stock Movements</span>
        </NavLink>
      </nav>

      <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
        v0.1 • LocalStorage
      </div>
    </aside>
  );
};

export default Sidebar;
