import { useState } from 'react';
import { BarChart3, Link2, PlayCircle, RotateCcw, Sparkles, UserPlus, Users, X } from 'lucide-react';
import { useApp } from '../AppContext';
import { recommend } from '../lib/projects';
import { findByCode, referralLink, register, markShared } from '../lib/store';
import { DEFAULT_SELECTIONS } from './Generator';

const SAMPLE_A = { name: 'Demo Student A', email: 'demo.student.a@example.com', college: 'Sample Institute of Technology (synthetic)', gradYear: '2026', interest: 'Data Analytics' };
const SAMPLE_B = { name: 'Demo Friend B', email: 'demo.friend.b@example.com', college: 'Sample Institute of Technology (synthetic)', gradYear: '2026', interest: 'AI and Machine Learning' };

export function DemoPanel() {
  const { state, update, navigate, recordGenerate, toast, copy, baseUrl, reset } = useApp();
  const [open, setOpen] = useState(false);
  const sampleA = state.registrations.find((r) => r.emailNorm === 'demo.student.a@example.com');
  const sampleB = state.registrations.find((r) => r.emailNorm === 'demo.friend.b@example.com');
  const hasProject = !!state.lastProjectId;

  const steps = [
    {
      id: 'demo-generate', icon: Sparkles, label: 'Generate a project idea', done: hasProject,
      run: () => {
        const p = recommend(DEFAULT_SELECTIONS, 0);
        recordGenerate();
        update((s) => ({ ...s, lastProjectId: p.id }));
        navigate('generate');
        toast(`Generated: ${p.title}`);
      },
    },
    {
      id: 'demo-register', icon: UserPlus, label: 'Complete a sample registration', done: !!sampleA,
      run: () => {
        if (sampleA) { update((s) => ({ ...s, myCode: sampleA.code })); navigate('register'); return; }
        const res = register(state, SAMPLE_A, { channel: 'ambassador', projectId: state.lastProjectId, synthetic: true });
        if (!res.ok) return toast(Object.values(res.errors)[0] ?? 'Registration failed', 'err');
        update(() => ({ ...res.state, myCode: res.registration.code }));
        navigate('register');
        toast('Synthetic registration created (Demo Student A)');
      },
    },
    {
      id: 'demo-link', icon: Link2, label: 'Generate & copy referral link', done: !!sampleA && state.sharedCodes.includes(sampleA.code), disabled: !sampleA,
      run: () => {
        if (!sampleA) return;
        update((s) => markShared(s, sampleA.code));
        copy(referralLink(sampleA.code, baseUrl), 'Referral link');
      },
    },
    {
      id: 'demo-referral', icon: Users, label: 'Simulate a referred registration', done: !!sampleB, disabled: !sampleA,
      run: () => {
        if (!sampleA) return;
        if (sampleB) return toast('Demo Friend B is already registered — duplicates are blocked', 'err');
        const res = register(state, SAMPLE_B, { ref: sampleA.code, synthetic: true });
        if (!res.ok) return toast(Object.values(res.errors)[0] ?? 'Registration failed', 'err');
        update(() => ({ ...res.state, myCode: sampleA.code }));
        navigate('register');
        toast(`Demo Friend B registered via ${sampleA.code} — referral count +1`);
      },
    },
    { id: 'demo-dashboard', icon: BarChart3, label: 'Inspect dashboard metrics', done: false, run: () => navigate('dashboard') },
  ];

  const myLink = findByCode(state, state.myCode);

  return (
    <>
      <button
        id="demo-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-ink-850/95 px-4 py-2.5 text-sm font-semibold text-amber-200 shadow-2xl backdrop-blur transition hover:border-amber-300"
      >
        {open ? <X size={16} /> : <PlayCircle size={16} />} Demo controls
      </button>
      {open && (
        <aside className="fixed bottom-20 right-5 z-50 w-[min(360px,calc(100vw-2.5rem))] rounded-2xl border border-white/10 bg-ink-900/95 p-5 shadow-2xl backdrop-blur-xl animate-fade-up" aria-label="Demo controls">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-white">Two-minute demo</p>
            <span className="tag-synth">Synthetic data</span>
          </div>
          <p className="mt-1 text-xs muted">Uses clearly fake sample people (example.com emails). Stored only in this browser.</p>
          <ol className="mt-4 space-y-2">
            {steps.map((s, i) => (
              <li key={s.id}>
                <button
                  id={s.id}
                  disabled={s.disabled}
                  onClick={s.run}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-left text-sm transition hover:border-lime-400/40 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${s.done ? 'bg-lime-400 text-ink-950' : 'bg-white/10 text-slate-300'}`}>{s.done ? '✓' : i + 1}</span>
                  <s.icon size={15} className="text-slate-400" />
                  <span className="text-slate-200">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
          {myLink && <p className="mt-3 truncate font-mono text-[11px] text-slate-500">Active code: {myLink.code}</p>}
          <button
            id="demo-reset"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 px-3 py-2 text-sm font-medium text-rose-200 hover:bg-rose-400/10"
            onClick={() => { if (confirm('Reset all local demo data in this browser?')) { reset(); } }}
          >
            <RotateCcw size={14} /> Reset local demo data
          </button>
        </aside>
      )}
    </>
  );
}
