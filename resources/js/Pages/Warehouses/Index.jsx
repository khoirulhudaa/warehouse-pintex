import AppLayout from '@/Layouts/AppLayout';
import { Card, Modal, Field, Input, Button } from '@/Components/UI';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function WarehousesIndex({ warehouses }) {
  const [modal, setModal] = useState(null);

  return (
    <AppLayout title="Gudang">
      <Head title="Gudang" />

      <div className="mb-5 flex items-center justify-between">
        <p className="text-[13.5px] text-slate-500">{warehouses.length} gudang aktif</p>
        <Button onClick={() => setModal('create')}>+ Tambah Gudang</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((w) => (
          <Card key={w.id}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-500">{w.code}</p>
                <p className="mt-0.5 text-[15px] font-semibold">{w.name}</p>
                <p className="mt-1 text-[12.5px] text-slate-500">{w.location}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setModal(w)} className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[12px] font-medium text-black/60 hover:bg-black/[0.08]">Edit</button>
                <button
                  onClick={() => confirm(`Hapus gudang "${w.name}"?`) && router.delete(route('warehouses.destroy', w.id))}
                  className="rounded-full bg-red-50 px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-100"
                >
                  Hapus
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-[12px] bg-black/[0.02] px-4 py-3">
              <div>
                <p className="text-[11.5px] text-slate-500">Total Stok</p>
                <p className="text-[16px] font-semibold">{w.total_stock.toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="text-[11.5px] text-slate-500">Jenis Produk</p>
                <p className="text-[16px] font-semibold">{w.products_count}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <WarehouseFormModal show={modal !== null} warehouse={modal !== 'create' ? modal : null} onClose={() => setModal(null)} />
    </AppLayout>
  );
}

function WarehouseFormModal({ show, warehouse, onClose }) {
  const isEdit = !!warehouse;
  const { data, setData, post, put, processing, errors, reset } = useForm({
    code: warehouse?.code ?? '',
    name: warehouse?.name ?? '',
    location: warehouse?.location ?? '',
  });

  function submit(e) {
    e.preventDefault();
    const options = { onSuccess: () => { reset(); onClose(); } };
    isEdit
      ? put(route('warehouses.update', warehouse.id), options)
      : post(route('warehouses.store'), options);
  }

  return (
    <Modal show={show} onClose={onClose} title={isEdit ? 'Edit Gudang' : 'Tambah Gudang'}>
      <form onSubmit={submit}>
        <Field label="Kode Gudang" error={errors.code}>
          <Input value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="WH-XXX" autoFocus />
        </Field>
        <Field label="Nama Gudang" error={errors.name}>
          <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
        </Field>
        <Field label="Lokasi" error={errors.location}>
          <Input value={data.location} onChange={(e) => setData('location', e.target.value)} />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={processing}>{isEdit ? 'Simpan' : 'Tambah'}</Button>
        </div>
      </form>
    </Modal>
  );
}
