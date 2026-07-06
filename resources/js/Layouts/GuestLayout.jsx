import { Link } from '@inertiajs/react';
import { Box, Warehouse } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f7] px-4 py-10">
            {/* Ambient gradient blobs */}
            <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-400/20 to-blue-300/10 blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Link href="/" className="group">
                        <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 transition-transform duration-200 group-hover:scale-105">
                            <Box className="h-7 w-7 text-white" strokeWidth={1.8} />
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <div className="rounded-[24px] border border-black/5 bg-white/80 px-8 py-9 shadow-xl shadow-black/[0.04] backdrop-blur-xl sm:px-10">
                    {children}
                </div>

                <p className="mt-6 text-center text-[12px] text-black/30">
                    StokGudang · Warehouse System
                </p>
            </div>
        </div>
    );
}