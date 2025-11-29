import { useLocation } from 'react-router-dom';
import { LayoutDashboard, Boxes, MoveRight, PackageSearch } from 'lucide-react';

const Header = () => {
  const { pathname } = useLocation();

  const pageInfo = {
    '/': {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    '/products': {
      title: 'Products',
      icon: <Boxes size={20} />,
    },
    '/movements': {
      title: 'Stock Movements',
      icon: <MoveRight size={20} />,
    },
    '/search': {
      title: 'Product Lookup',
      icon: <PackageSearch size={20} />,
    },
  }[pathname] || {
    title: 'Inventory App',
    icon: <LayoutDashboard size={20} />,
  };

  return (
    <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center px-6">
      <div className="flex items-center gap-3 select-none">
        <span className="text-slate-700">{pageInfo.icon}</span>
        <h2 className="text-xl font-semibold text-slate-900">
          {pageInfo.title}
        </h2>
      </div>
    </header>
  );
};

export default Header;
