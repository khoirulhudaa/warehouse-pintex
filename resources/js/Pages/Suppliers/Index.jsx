import AppLayout from '@/Layouts/AppLayout';
import { Card, Modal, Field, Input, Textarea, Button } from '@/Components/UI';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SuppliersIndex({ suppliers }) {
  const [modal, setModal] = useState(null);

  return (
    <AppLayout title="Supplier">
      <Head title="Supplier" />

      <div className="mb-5 flex items-center justify-between">
        <p className="text-[13.5px] text-slate-500">{suppliers.length} supplier terdaftar</p>
        <Button onClick={() => setModal('create')}>+ Tambah Supplier</Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-black/[0.04] text-[11.5px] uppercase tracking-wide text-black/35">
              <th className="px-6 py-3.5 font-medium">Nama</th>
              <th className="px-6 py-3.5 font-medium">Kontak</th>
              <th className="px-6 py-3.5 font-medium">Telepon</th>
              <th className="px-6 py-3.5 font-medium">Produk</th>
              <th className="px-6 py-3.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b border-black/[0.03] last:border-0 hover:bg-black/[0.015]">
                <td className="px-6 py-3.5">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-[12px] text-slate-500">{s.email}</p>
                </td>
                <td className="px-6 py-3.5 text-black/60">{s.contact_person ?? '—'}</td>
                <td className="px-6 py-3.5 text-black/60">{s.phone ?? '—'}</td>
                <td className="px-6 py-3.5 text-black/60">{s.products_count}</td>
                <td className="px-6 py-3.5">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => setModal(s)} className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[12px] font-medium text-black/60 hover:bg-black/[0.08]">Edit</button>
                    <button
                      onClick={() => confirm(`Hapus supplier "${s.name}"?`) && router.delete(route('suppliers.destroy', s.id))}
                      className="rounded-full bg-red-50 px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <SupplierFormModal show={modal !== null} supplier={modal !== 'create' ? modal : null} onClose={() => setModal(null)} />
    </AppLayout>
  );
}

function SupplierFormModal({ show, supplier, onClose }) {
  const isEdit = !!supplier;
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: supplier?.name ?? '',
    contact_person: supplier?.contact_person ?? '',
    phone: supplier?.phone ?? '',
    email: supplier?.email ?? '',
    address: supplier?.address ?? '',
  });

  function submit(e) {
    e.preventDefault();
    const options = { onSuccess: () => { reset(); onClose(); } };
    isEdit
      ? put(route('suppliers.update', supplier.id), options)
      : post(route('suppliers.store'), options);
  }

  return (
    <Modal show={show} onClose={onClose} title={isEdit ? 'Edit Supplier' : 'Tambah Supplier'}>
      <form onSubmit={submit}>
        <Field label="Nama Perusahaan" error={errors.name}>
          <Input value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kontak Person" error={errors.contact_person}>
            <Input value={data.contact_person} onChange={(e) => setData('contact_person', e.target.value)} />
          </Field>
          <Field label="Telepon" error={errors.phone}>
            <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
          </Field>
        </div>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
        </Field>
        <Field label="Alamat" error={errors.address}>
          <Textarea rows={2} value={data.address} onChange={(e) => setData('address', e.target.value)} />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={processing}>{isEdit ? 'Simpan' : 'Tambah'}</Button>
        </div>
      </form>
    </Modal>
  );
}
