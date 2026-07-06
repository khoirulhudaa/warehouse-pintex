import AppLayout from '@/Layouts/AppLayout';
import { Card, Modal, Field, Input, Textarea, Button } from '@/Components/UI';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CategoriesIndex({ categories }) {
  const [modal, setModal] = useState(null); // null | 'create' | category object

  return (
    <AppLayout title="Kategori">
      <Head title="Kategori" />

      <div className="mb-5 flex items-center justify-between">
        <p className="text-[13.5px] text-slate-500">{categories.length} kategori terdaftar</p>
        <Button onClick={() => setModal('create')}>+ Tambah Kategori</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold">{c.name}</p>
                <p className="mt-1 text-[12.5px] text-slate-500">{c.products_count} produk</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setModal(c)} className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[12px] font-medium text-black/60 hover:bg-black/[0.08]">Edit</button>
                <button
                  onClick={() => confirm(`Hapus kategori "${c.name}"?`) && router.delete(route('categories.destroy', c.id))}
                  className="rounded-full bg-red-50 px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-100"
                >
                  Hapus
                </button>
              </div>
            </div>
            {c.description && <p className="mt-3 text-[13px] text-black/50">{c.description}</p>}
          </Card>
        ))}
      </div>

      <CategoryFormModal
        show={modal !== null}
        category={modal !== 'create' ? modal : null}
        onClose={() => setModal(null)}
      />
    </AppLayout>
  );
}

function CategoryFormModal({ show, category, onClose }) {
  const isEdit = !!category;
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: category?.name ?? '',
    description: category?.description ?? '',
  });

  function submit(e) {
    e.preventDefault();
    const options = {
      onSuccess: () => {
        reset();
        onClose();
      },
    };
    if (isEdit) {
      put(route('categories.update', category.id), options);
    } else {
      post(route('categories.store'), options);
    }
  }

  return (
    <Modal show={show} onClose={onClose} title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}>
      <form onSubmit={submit}>
        <Field label="Nama Kategori" error={errors.name}>
          <Input value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
        </Field>
        <Field label="Deskripsi (opsional)" error={errors.description}>
          <Textarea rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={processing}>{isEdit ? 'Simpan' : 'Tambah'}</Button>
        </div>
      </form>
    </Modal>
  );
}
