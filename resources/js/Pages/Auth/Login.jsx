import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <h2 className="mb-1 text-[20px] font-semibold tracking-tight">Selamat datang</h2>
            <p className="mb-6 text-[13px] text-black/40">Masuk untuk kelola stok gudang</p>

            {status && (
                <div className="mb-5 rounded-[12px] bg-emerald-50 px-4 py-2.5 text-[13px] font-medium text-emerald-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-[12.5px] font-medium text-black/60">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-[12px] border border-black/10 bg-black/[0.02] px-4 py-2.5 text-[14px] outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <label htmlFor="password" className="mb-1.5 block text-[12.5px] font-medium text-black/60">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-[12px] border border-black/10 bg-black/[0.02] px-4 py-2.5 text-[14px] outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-[13px] text-black/50">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded border-black/20 text-blue-500 focus:ring-blue-500/30"
                        />
                        Ingat saya
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-[13px] font-medium text-blue-600 hover:text-blue-700"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-2 w-full rounded-[12px] bg-gradient-to-br from-blue-500 to-indigo-600 py-2.5 text-[14px] font-semibold text-white shadow-md shadow-blue-500/20 transition hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
                >
                    Masuk
                </button>
            </form>
        </GuestLayout>
    );
}