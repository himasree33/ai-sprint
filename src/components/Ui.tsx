import type { ReactNode } from 'react';

export function SectionHeader({ eyebrow, title, children, tag }: { eyebrow: string; title: ReactNode; children?: ReactNode; tag?: ReactNode }) {
  return (
    <div className="mb-10 max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        <p className="eyebrow">{eyebrow}</p>
        {tag}
      </div>
      <h2 className="h2 mt-3">{title}</h2>
      {children && <p className="mt-4 text-lg muted leading-relaxed">{children}</p>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, children, tag }: { eyebrow: string; title: string; children?: ReactNode; tag?: ReactNode }) {
  return (
    <div className="pt-14 pb-10 animate-fade-up">
      <div className="flex flex-wrap items-center gap-3">
        <p className="eyebrow">{eyebrow}</p>
        {tag}
      </div>
      <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">{title}</h1>
      {children && <p className="mt-4 max-w-3xl text-lg muted leading-relaxed">{children}</p>}
    </div>
  );
}

export function Stat({ label, value, hint, accent }: { label: string; value: ReactNode; hint?: ReactNode; accent?: boolean }) {
  const na = value === 'Not enough data';
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-2 font-bold tracking-tight ${na ? 'text-base text-slate-500' : 'text-2xl'} ${accent && !na ? 'text-lime-300' : 'text-white'}`}>
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs muted">{hint}</p>}
    </div>
  );
}

export function ProgressBar({ value, color = '#a3e635', label }: { value: number; color?: string; label: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]" role="progressbar" aria-label={label} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 12px ${color}80` }} />
    </div>
  );
}

export function DemoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] px-4 py-3 text-sm text-amber-100">
      <span className="tag-demo shrink-0">Demo mode</span>
      <span>{children}</span>
    </div>
  );
}
