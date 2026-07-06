import AppLayout from '@/Layouts/AppLayout';
import { Card, Badge } from '@/Components/UI';
import { Head, Link } from '@inertiajs/react';

export default function ProductShow({ product }) {
  function formatRupiah(n) {
    return `Rp${Number(n).toLocaleString('id-ID')}`;
  }

  return (
    <AppLayout title={product.name}>
      <Head title={product.name} />

      <Link href={route('products.index')} className="mb-5 inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:text-blue-700">
        ← Kembali ke Produk
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Info utama */}
        <Card className="lg:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-black/35">{product.sku}</p>
          <h2 className="mt-1 text-[19px] font-semibold tracking-tight">{product.name}</h2>
          {product.description && <p className="mt-2 text-[13.5px] text-black/50">{product.description}</p>}

          <div className="mt-5 space-y-3 border-t border-black/[0.04] pt-4">
            <Row label="Kategori" value={product.category?.name ?? '—'} />
            <Row label="Supplier" value={product.supplier?.name ?? '—'} />
            <Row label="Harga" value={formatRupiah(product.price)} />
            <Row label="Satuan" value={product.unit} />
            <Row label="Stok Minimum" value={`${product.min_stock} ${product.unit}`} />
            <Row label="Total Stok" value={
              <Badge tone={product.total_stock <= product.min_stock ? 'warning' : 'success'}>
                {product.total_stock} {product.unit}
              </Badge>
            } />
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {/* Stok per gudang */}
          <Card>
            <h3 className="mb-4 text-[15px] font-semibold tracking-tight">Stok per Gudang</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {product.warehouses.length === 0 && (
                <p className="text-[13px] text-black/40">Belum ada stok tercatat di gudang manapun.</p>
              )}
              {product.warehouses.map((w) => (
                <div key={w.id} className="flex items-center justify-between rounded-[14px] bg-black/[0.02] px-4 py-3.5">
                  <div>
                    <p className="text-[13.5px] font-medium">{w.name}</p>
                    <p className="text-[11.5px] text-black/40">{w.code}</p>
                  </div>
                  <p className="text-[16px] font-semibold">{w.quantity}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Riwayat pergerakan */}
          <Card>
            <h3 className="mb-4 text-[15px] font-semibold tracking-tight">Riwayat Pergerakan</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13.5px]">
                <thead>
                  <tr className="text-[11.5px] uppercase tracking-wide text-black/35">
                    <th className="pb-3 font-medium">Tanggal</th>
                    <th className="pb-3 font-medium">Gudang</th>
                    <th className="pb-3 font-medium">Tipe</th>
                    <th className="pb-3 font-medium">Jumlah</th>
                    <th className="pb-3 font-medium">Oleh</th>
                  </tr>
                </thead>
                <tbody>
                  {product.movements.map((m) => (
                    <tr key={m.id} className="border-t border-black/[0.04]">
                      <td className="py-3 text-black/60">{new Date(m.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3">{m.warehouse?.name}</td>
                      <td className="py-3">
                        <Badge tone={m.type === 'in' ? 'success' : m.type === 'out' ? 'danger' : 'neutral'}>
                          {m.type === 'in' ? 'Masuk' : m.type === 'out' ? 'Keluar' : 'Penyesuaian'}
                        </Badge>
                      </td>
                      <td className="py-3">{m.quantity}</td>
                      <td className="py-3 text-black/40">{m.user?.name ?? '—'}</td>
                    </tr>
                  ))}
                  {product.movements.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-black/40">Belum ada riwayat pergerakan.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-black/40">{label}</span>
      <span className="text-[13.5px] font-medium">{value}</span>
    </div>
  );
}
