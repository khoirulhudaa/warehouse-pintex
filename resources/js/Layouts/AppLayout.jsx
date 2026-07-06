import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
  { name: 'Produk', href: 'products.index', icon: BoxIcon },
  { name: 'Pergerakan Stok', href: 'stock-movements.index', icon: ArrowsIcon },
  { name: 'Gudang', href: 'warehouses.index', icon: WarehouseIcon },
  { name: 'Kategori', href: 'categories.index', icon: TagIcon },
  { name: 'Supplier', href: 'suppliers.index', icon: TruckIcon },
];

export default function AppLayout({ children, title }) {
  const { url, props } = usePage();
  const flash = props?.flash;
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (flash?.success) {
      setToast(flash.success);
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [flash]);

  return (
    <div className="flex min-h-screen bg-[#f5f5f7] text-[#1d1d1f] antialiased">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-black/5 bg-white/70 px-4 py-6 backdrop-blur-xl md:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
            <WarehouseIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[15px] font-semibold leading-tight tracking-tight">StokGudang</p>
            <p className="text-[11px] leading-tight text-black/40">Warehouse System</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = route().current(item.href) || route().current(item.href + '.*');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={route(item.href)}
                className={`group flex items-center gap-3 rounded-[10px] px-3 py-2 text-[13.5px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/25'
                    : 'text-black/60 hover:bg-black/[0.04] hover:text-black/90'
                }`}
              >
                <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-white' : 'text-black/40 group-hover:text-black/60'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[12px] bg-black/[0.03] p-3">
          <p className="text-[11px] font-medium text-black/40">Masuk sebagai</p>
          <p className="truncate text-[13px] font-semibold">{props.auth?.user?.name ?? 'Admin'}</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/70 px-4 md:px-6 py-4 backdrop-blur-xl md:px-10">
          <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
        </header>

        <main className="flex-1 px-4 py-8 md:px-6">{children}</main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-[fadeIn_0.2s_ease] rounded-full bg-[#1d1d1f] px-5 py-3 text-[13px] font-medium text-white shadow-lg shadow-black/20">
          {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Minimal inline icon set (no external deps) ─────────────────────────── */

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function BoxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 8.5 12 4 3 8.5 12 13l9-4.5Z" />
      <path d="M3 8.5V16l9 4.5 9-4.5V8.5" />
      <path d="M12 13v7.5" />
    </svg>
  );
}

function ArrowsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 7h11l-3-3M18 17H7l3 3" />
    </svg>
  );
}

function WarehouseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21V9.5L12 4l9 5.5V21" />
      <path d="M7 21v-6h10v6" />
      <path d="M3 21h18" />
    </svg>
  );
}

function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.5 12.5 12 21l-9-9 8.5-8.5H20a.5.5 0 0 1 .5.5v8.5Z" />
      <circle cx="15" cy="7" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TruckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 16V6a1 1 0 0 1 1-1h9v11" />
      <path d="M13 9h4l4 4v3h-2" />
      <circle cx="7.5" cy="17.5" r="1.8" />
      <circle cx="17.5" cy="17.5" r="1.8" />
    </svg>
  );
}
