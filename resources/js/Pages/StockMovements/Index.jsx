import AppLayout from '@/Layouts/AppLayout';
import { Card, Modal, Field, Input, Textarea, Select, Button, Badge } from '@/Components/UI';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function StockMovementsIndex({ movements, products, warehouses }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <AppLayout title="Pergerakan Stok">
      <Head title="Pergerakan Stok" />

      <div className="mb-5 flex items-center justify-between">
        <p className="text-[13.5px] text-slate-500">{movements.total} total pergerakan tercatat</p>
        <Button onClick={() => setShowModal(true)}>+ Catat Pergerakan</Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-black/[0.04] text-[11.5px] uppercase tracking-wide text-black/35">
              <th className="px-6 py-3.5 font-medium">Tanggal</th>
              <th className="px-6 py-3.5 font-medium">Produk</th>
              <th className="px-6 py-3.5 font-medium">Gudang</th>
              <th className="px-6 py-3.5 font-medium">Tipe</th>
              <th className="px-6 py-3.5 font-medium">Jumlah</th>
              <th className="px-6 py-3.5 font-medium">Referensi</th>
              <th className="px-6 py-3.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {movements.data.map((m) => (
              <tr key={m.id} className="border-b border-black/[0.03] last:border-0 hover:bg-black/[0.015]">
                <td className="px-6 py-3.5 text-black/60">
                  {new Date(m.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-3.5">
                  <Link href={route('products.show', m.product?.id)} className="font-medium hover:text-blue-600">{m.product?.name}</Link>
                  <p className="text-[12px] text-slate-500">{m.product?.sku}</p>
                </td>
                <td className="px-6 py-3.5 text-black/60">{m.warehouse?.name}</td>
                <td className="px-6 py-3.5">
                  <Badge tone={m.type === 'in' ? 'success' : m.type === 'out' ? 'danger' : 'neutral'}>
                    {m.type === 'in' ? 'Masuk' : m.type === 'out' ? 'Keluar' : 'Penyesuaian'}
                  </Badge>
                </td>
                <td className="px-6 py-3.5 font-medium">{m.quantity}</td>
                <td className="px-6 py-3.5 text-slate-500">{m.reference ?? '—'}</td>
                <td className="px-6 py-3.5">
                  <button
                    onClick={() => confirm('Hapus pergerakan ini? Stok akan disesuaikan kembali.') && router.delete(route('stock-movements.destroy', m.id))}
                    className="rounded-full bg-red-50 px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {movements.data.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-500">Belum ada pergerakan stok.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Pagination */}
      {movements.links.length > 3 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {movements.links.map((link, i) => (
            <Link
              key={i}
              href={link.url ?? '#'}
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${
                link.active ? 'bg-blue-500 text-white' : 'bg-black/[0.04] text-black/60 hover:bg-black/[0.08]'
              } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
            />
          ))}
        </div>
      )}

      <MovementFormModal show={showModal} products={products} warehouses={warehouses} onClose={() => setShowModal(false)} />
    </AppLayout>
  );
}

function MovementFormModal({ show, products, warehouses, onClose }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    product_id: '',
    warehouse_id: '',
    type: 'in',
    quantity: 1,
    reference: '',
    note: '',
  });

  function submit(e) {
    e.preventDefault();
    post(route('stock-movements.store'), {
      onSuccess: () => { reset(); onClose(); },
    });
  }

  return (
    <Modal show={show} onClose={onClose} title="Catat Pergerakan Stok">
      <form onSubmit={submit}>
        <Field label="Produk" error={errors.product_id}>
          <Select value={data.product_id} onChange={(e) => setData('product_id', e.target.value)} autoFocus>
            <option value="">— Pilih Produk —</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
          </Select>
        </Field>
        <Field label="Gudang" error={errors.warehouse_id}>
          <Select value={data.warehouse_id} onChange={(e) => setData('warehouse_id', e.target.value)}>
            <option value="">— Pilih Gudang —</option>
            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.code})</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipe" error={errors.type}>
            <Select value={data.type} onChange={(e) => setData('type', e.target.value)}>
              <option value="in">Masuk</option>
              <option value="out">Keluar</option>
              <option value="adjustment">Penyesuaian</option>
            </Select>
          </Field>
          <Field label="Jumlah" error={errors.quantity}>
            <Input type="number" min="1" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} />
          </Field>
        </div>
        <Field label="Referensi (opsional)" error={errors.reference}>
          <Input value={data.reference} onChange={(e) => setData('reference', e.target.value)} placeholder="No. invoice / PO..." />
        </Field>
        <Field label="Catatan (opsional)" error={errors.note}>
          <Textarea rows={2} value={data.note} onChange={(e) => setData('note', e.target.value)} />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={processing}>Simpan</Button>
        </div>
      </form>
    </Modal>
  );
}
