import AppLayout from '@/Layouts/AppLayout';
import { Card, Modal, Field, Input, Textarea, Select, Button, Badge } from '@/Components/UI';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductsIndex({ products, categories, suppliers, filters }) {
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState(filters.search ?? '');

  function submitSearch(e) {
    e.preventDefault();
    router.get(route('products.index'), { search }, { preserveState: true, replace: true });
  }

  function formatRupiah(n) {
    return `Rp${Number(n).toLocaleString('id-ID')}`;
  }

  return (
    <AppLayout title="Produk">
      <Head title="Produk" />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={submitSearch} className="w-full max-w-xs">
          <Input
            placeholder="Cari nama atau SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <Button onClick={() => setModal('create')}>+ Tambah Produk</Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-black/[0.04] text-[11.5px] uppercase tracking-wide text-black/35">
              <th className="px-6 py-3.5 font-medium">Produk</th>
              <th className="px-6 py-3.5 font-medium">Kategori</th>
              <th className="px-6 py-3.5 font-medium">Supplier</th>
              <th className="px-6 py-3.5 font-medium">Harga</th>
              <th className="px-6 py-3.5 font-medium">Stok</th>
              <th className="px-6 py-3.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/[0.03] last:border-0 hover:bg-black/[0.015]">
                <td className="px-6 py-3.5">
                  <Link href={route('products.show', p.id)} className="font-medium hover:text-blue-600">{p.name}</Link>
                  <p className="text-[12px] text-black/40">{p.sku}</p>
                </td>
                <td className="px-6 py-3.5 text-black/60">{p.category?.name ?? '—'}</td>
                <td className="px-6 py-3.5 text-black/60">{p.supplier?.name ?? '—'}</td>
                <td className="px-6 py-3.5 text-black/60">{formatRupiah(p.price)}</td>
                <td className="px-6 py-3.5">
                  <Badge tone={p.is_low_stock ? 'warning' : 'success'}>
                    {p.total_stock} {p.unit}
                  </Badge>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => setModal(p)} className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[12px] font-medium text-black/60 hover:bg-black/[0.08]">Edit</button>
                    <button
                      onClick={() => confirm(`Hapus produk "${p.name}"?`) && router.delete(route('products.destroy', p.id))}
                      className="rounded-full bg-red-50 px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-black/40">Tidak ada produk ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <ProductFormModal
        show={modal !== null}
        product={modal !== 'create' ? modal : null}
        categories={categories}
        suppliers={suppliers}
        onClose={() => setModal(null)}
      />
    </AppLayout>
  );
}

function ProductFormModal({ show, product, categories, suppliers, onClose }) {
  const isEdit = !!product;
  const { data, setData, post, put, processing, errors, reset } = useForm({
    sku: product?.sku ?? '',
    name: product?.name ?? '',
    category_id: product?.category?.id ?? '',
    supplier_id: product?.supplier?.id ?? '',
    unit: product?.unit ?? 'pcs',
    price: product?.price ?? 0,
    min_stock: product?.min_stock ?? 0,
    description: product?.description ?? '',
  });

  function submit(e) {
    e.preventDefault();
    const options = { onSuccess: () => { reset(); onClose(); } };
    isEdit
      ? put(route('products.update', product.id), options)
      : post(route('products.store'), options);
  }

  return (
    <Modal show={show} onClose={onClose} title={isEdit ? 'Edit Produk' : 'Tambah Produk'} maxWidth="max-w-lg">
      <form onSubmit={submit}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="SKU" error={errors.sku}>
            <Input value={data.sku} onChange={(e) => setData('sku', e.target.value)} autoFocus />
          </Field>
          <Field label="Satuan" error={errors.unit}>
            <Input value={data.unit} onChange={(e) => setData('unit', e.target.value)} placeholder="pcs, box, kg..." />
          </Field>
        </div>
        <Field label="Nama Produk" error={errors.name}>
          <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategori" error={errors.category_id}>
            <Select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}>
              <option value="">— Pilih —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <Field label="Supplier" error={errors.supplier_id}>
            <Select value={data.supplier_id} onChange={(e) => setData('supplier_id', e.target.value)}>
              <option value="">— Pilih —</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Harga (Rp)" error={errors.price}>
            <Input type="number" min="0" value={data.price} onChange={(e) => setData('price', e.target.value)} />
          </Field>
          <Field label="Stok Minimum" error={errors.min_stock}>
            <Input type="number" min="0" value={data.min_stock} onChange={(e) => setData('min_stock', e.target.value)} />
          </Field>
        </div>
        <Field label="Deskripsi (opsional)" error={errors.description}>
          <Textarea rows={2} value={data.description} onChange={(e) => setData('description', e.target.value)} />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={processing}>{isEdit ? 'Simpan' : 'Tambah'}</Button>
        </div>
      </form>
    </Modal>
  );
}
