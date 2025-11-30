// src/App.tsx

import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import StockMovements from './pages/StockMovements';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/products')) return 'Products';
  if (pathname.startsWith('/stock-movements')) return 'Stock Movements';
  return 'Dashboard';
};

function App() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar: fixa no desktop, drawer no mobile */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Área principal */}
        <div className="flex-1 flex flex-col">
          <Header title={pageTitle} onToggleMenu={toggleSidebar} />

          <main className="flex-1 px-3 py-4 md:px-6 md:py-6">
            <div className="max-w-6xl mx-auto w-full space-y-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/stock-movements" element={<StockMovements />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
