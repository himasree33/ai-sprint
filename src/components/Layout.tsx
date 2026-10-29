import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { useApp, type Route } from '../AppContext';

const LINKS: { route: Route; label: string }[] = [
  { route: 'generate', label: 'Project Generator' },
  { route: 'register', label: 'Register' },
  { route: 'dashboard', label: 'Dashboard' },
  { route: 'playbook', label: 'Playbook' },
  { route: 'experiments', label: 'Experiments' },
  { route: 'worklog', label: 'AI Worklog' },
];

export function Nav() {
  const { route, navigate, pendingRef } = useApp();
  const [open, setOpen] = useState(false);
  const go = (r: Route) => {
    setOpen(false);
    navigate(r);
  };
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/75 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <a
          href="#/"
          id="nav-home"
          onClick={(e) => { e.preventDefault(); go('home'); }}
          className="flex items-center gap-2.5 font-bold text-white"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-400 text-ink-950 shadow-[0_0_24px_-4px_rgba(163,230,53,.7)]">
            <Zap size={17} strokeWidth={2.6} />
          </span>
          <span className="tracking-tight">AI Sprint</span>
        </a>
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.route}
              id={`nav-${l.route}`}
              href={`#/${l.route}`}
              onClick={(e) => { e.preventDefault(); go(l.route); }}
              aria-current={route === l.route ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                route === l.route ? 'bg-white/[0.07] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {pendingRef && (
            <span className="chip hidden sm:inline-flex" title="Referral code detected from your link">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" /> Invited · {pendingRef}
            </span>
          )}
          <button id="nav-cta" className="btn-primary hidden sm:inline-flex !py-2" onClick={() => go('register')}>
            Register free
          </button>
          <button
            className="btn-ghost lg:hidden !p-2"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            id="nav-menu-toggle"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-white/[0.06] bg-ink-950/95 animate-fade-up" aria-label="Mobile">
          <div className="container-x grid gap-1 py-3">
            {LINKS.map((l) => (
              <button
                key={l.route}
                onClick={() => go(l.route)}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                  route === l.route ? 'bg-white/[0.07] text-white' : 'text-slate-300'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { navigate } = useApp();
  return (
    <footer className="mt-24 border-t border-white/[0.06] py-10">
      <div className="container-x grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-bold text-white">
            <Zap size={16} className="text-lime-400" /> AI Sprint
          </div>
          <p className="mt-3 max-w-xl text-sm muted">
            <strong className="text-slate-300">Prototype disclaimer:</strong> AI Sprint is a simulation built for the
            NxtWave Growth Intern Round 1 Challenge. It is not an official NxtWave product. Registrations are stored only
            in this browser's LocalStorage and are never sent to NxtWave or any server. Campaign numbers are planning
            assumptions or clearly labelled synthetic data — not real results.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(['generate', 'register', 'dashboard', 'playbook', 'experiments', 'worklog'] as Route[]).map((r) => (
            <button key={r} onClick={() => navigate(r)} className="text-left capitalize muted hover:text-white">
              {r === 'generate' ? 'Project generator' : r === 'worklog' ? 'AI worklog' : r}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2" aria-live="polite" role="status">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-fade-up rounded-xl border px-4 py-2.5 text-sm font-medium shadow-2xl backdrop-blur ${
            t.tone === 'ok' ? 'border-lime-400/30 bg-ink-800/95 text-lime-200' : 'border-rose-400/30 bg-ink-800/95 text-rose-200'
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
