import { useEffect } from 'react';

export function Modal({ show, onClose, title, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (show) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-[fadeInBg_0.15s_ease]"
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidth} rounded-[20px] bg-white p-6 shadow-2xl shadow-black/20 animate-[popIn_0.18s_cubic-bezier(0.16,1,0.3,1)]`}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.04] text-black/40 transition hover:bg-black/[0.08] hover:text-black/70"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
      <style>{`
        @keyframes popIn { from { opacity: 0; transform: scale(0.96) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[13px] font-medium text-black/60">{label}</label>
      {children}
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-[10px] border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-[14px] outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${props.className ?? ''}`}
    />
  );
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-[10px] border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-[14px] outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${props.className ?? ''}`}
    />
  );
}

export function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-[10px] border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-[14px] outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${props.className ?? ''}`}
    />
  );
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm shadow-blue-500/25',
    secondary: 'bg-black/[0.05] text-black/80 hover:bg-black/[0.08]',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-medium transition active:scale-[0.97] disabled:opacity-50 ${variants[variant]} ${className}`}
    />
  );
}

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-[20px] border border-black/5 bg-white p-6 shadow-sm shadow-black/[0.02] ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ tone = 'neutral', children }) {
  const tones = {
    neutral: 'bg-black/[0.05] text-black/60',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
