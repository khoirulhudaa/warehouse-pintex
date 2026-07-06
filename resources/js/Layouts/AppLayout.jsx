import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (flash?.success) {
      setToast(flash.success);
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [flash]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tutup sidebar mobile setiap kali pindah halaman
  useEffect(() => {
    setSidebarOpen(false);
  }, [url]);

  const userName = props.auth?.user?.name ?? 'Admin';
  const userEmail = props.auth?.user?.email ?? '';

  const SidebarContent = (
    <>
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
          <BoxIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-[15px] font-semibold leading-tight tracking-tight">StokGudang</p>
          <p className="text-[11px] leading-tight text-black/40">Warehouse System</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 space-y-2">
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
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f5f7] text-[#1d1d1f] antialiased">
      {/* Sidebar - desktop (fixed) */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-shrink-0 flex-col border-r border-black/5 bg-white/70 px-2 py-6 backdrop-blur-xl md:flex">
        {SidebarContent}
      </aside>

      {/* Sidebar - mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative flex h-full w-[80vw] flex-col bg-white/95 px-4 py-6 shadow-xl backdrop-blur-xl animate-[slideIn_0.2s_ease]">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-4 top-5 bg-red-500 flex h-8 w-8 items-center justify-center rounded-lg text-white transition hover:bg-red-600 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main content - digeser ke kanan sejauh lebar sidebar (md:ml-64) */}
      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/70 px-4 md:px-6 py-4 backdrop-blur-xl md:px-10">
          <div className="flex items-center gap-3">
            {/* Hamburger - mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-black/50 bg-slate-300 transition hover:bg-slate-400 hover:text-black/80 md:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
          </div>

          {/* Profile + Logout menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-black/[0.04]"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[12px] font-semibold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-[13px] font-medium text-black/70 sm:block">{userName}</span>
              <ChevronDownIcon className={`h-3.5 w-3.5 text-black/40 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 overflow-hidden rounded-[14px] border border-black/5 bg-white/90 py-1.5 shadow-xl shadow-black/[0.08] backdrop-blur-xl">
                <div className="border-b border-black/5 px-4 py-3">
                  <p className="truncate text-[13px] font-semibold">{userName}</p>
                  <p className="truncate text-[11.5px] text-black/40">{userEmail}</p>
                </div>

                <Link
                  href={route('logout')}
                  method="post"
                  as="button"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-black/60 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogoutIcon className="h-4 w-4" />
                  Keluar
                </Link>
              </div>
            )}
          </div>
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
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
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

function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
