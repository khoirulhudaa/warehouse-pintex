import AppLayout from '@/Layouts/AppLayout';
import { Card, Badge } from '@/Components/UI';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, lowStock, recentMovements, warehouseBreakdown }) {
  return (
    <AppLayout title="Dashboard">
      <Head title="Dashboard" />

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Produk" value={stats.total_products} accent="blue" />
        <StatCard label="Total Stok" value={stats.total_stock.toLocaleString('id-ID')} accent="indigo" />
        <StatCard label="Gudang Aktif" value={stats.total_warehouses} accent="green" />
        <StatCard label="Stok Menipis" value={stats.low_stock_count} accent="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Warehouse breakdown */}
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-[15px] font-semibold tracking-tight">Ringkasan per Gudang</h3>
          <div className="space-y-3">
            {warehouseBreakdown.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-[14px] bg-black/[0.02] px-4 py-3.5">
                <div>
                  <p className="text-[14px] font-medium">{w.name}</p>
                  <p className="text-[12px] text-black/40">{w.code} · {w.product_count} jenis produk</p>
                </div>
                <p className="text-[15px] font-semibold">{w.total_stock.toLocaleString('id-ID')} <span className="text-[12px] font-normal text-black/40">unit</span></p>
              </div>
            ))}
          </div>
        </Card>

        {/* Low stock */}
        <Card>
          <h3 className="mb-4 text-[15px] font-semibold tracking-tight">Perlu Restock</h3>
          {lowStock.length === 0 ? (
            <p className="text-[13px] text-black/40">Semua stok produk aman 🎉</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <Link
                  key={p.id}
                  href={route('products.show', p.id)}
                  className="flex items-center justify-between rounded-[14px] bg-amber-50/60 px-4 py-3 transition hover:bg-amber-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-medium">{p.name}</p>
                    <p className="text-[11.5px] text-black/40">{p.sku}</p>
                  </div>
                  <Badge tone="warning">{p.stock}/{p.min_stock}</Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent movements */}
      <Card className="mt-6">
        <h3 className="mb-4 text-[15px] font-semibold tracking-tight">Pergerakan Stok Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="text-[11.5px] uppercase tracking-wide text-black/35">
                <th className="pb-3 font-medium">Produk</th>
                <th className="pb-3 font-medium">Gudang</th>
                <th className="pb-3 font-medium">Tipe</th>
                <th className="pb-3 font-medium">Jumlah</th>
                <th className="pb-3 font-medium">Oleh</th>
              </tr>
            </thead>
            <tbody>
              {recentMovements.map((m) => (
                <tr key={m.id} className="border-t border-black/[0.04]">
                  <td className="py-3 font-medium">{m.product?.name}</td>
                  <td className="py-3 text-black/60">{m.warehouse?.name}</td>
                  <td className="py-3">
                    <Badge tone={m.type === 'in' ? 'success' : m.type === 'out' ? 'danger' : 'neutral'}>
                      {m.type === 'in' ? 'Masuk' : m.type === 'out' ? 'Keluar' : 'Penyesuaian'}
                    </Badge>
                  </td>
                  <td className="py-3">{m.quantity}</td>
                  <td className="py-3 text-black/40">{m.user?.name ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
}

function StatCard({ label, value, accent }) {
  const accents = {
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
  };
  return (
    <div className="rounded-[20px] border border-black/5 bg-white p-5 shadow-sm shadow-black/[0.02]">
      <p className="text-[12.5px] font-medium text-slate-500">{label}</p>
      <p className="mt-1.5 text-[28px] font-semibold tracking-tight">{value}</p>
      <div className={`mt-3 h-1 w-10 rounded-full bg-gradient-to-r ${accents[accent]}`} />
    </div>
  );
}
