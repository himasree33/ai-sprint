import { useState, type ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, CalendarDays, FlaskConical, Info, ListChecks } from 'lucide-react';
import { useApp } from '../AppContext';
import { PageHeader, ProgressBar, Stat } from '../components/Ui';
import { BUDGET_LINES, BUDGET_TOTAL, CHANNELS, TARGET_TOTAL, TIMELINE } from '../lib/campaign';
import { computeMetrics, fmtINR, fmtNum, fmtPct, fromState, fromSynthetic } from '../lib/metrics';

type Source = 'local' | 'synthetic';

const tooltipStyle = { background: '#0e1630', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 12 };

function SourceTag({ source }: { source: Source }) {
  return source === 'local' ? <span className="tag-local">Local demo activity</span> : <span className="tag-synth">Synthetic sample</span>;
}

export function Dashboard() {
  const { state, update, navigate } = useApp();
  const [source, setSource] = useState<Source>('local');
  const input = source === 'local' ? fromState(state) : fromSynthetic();
  const m = computeMetrics(input);

  const channelData = m.channelRows.map((c) => ({ name: c.short, Target: c.target, [source === 'local' ? 'Local' : 'Synthetic']: c.actual }));
  const actualKey = source === 'local' ? 'Local' : 'Synthetic';

  const funnel = [
    { label: 'Discovers the campaign', value: null as number | null, note: 'Happens off-site — not trackable in this prototype' },
    { label: 'Visits the landing page', value: input.visits, note: 'Browser sessions' },
    { label: 'Explores a project idea', value: input.generatorSessions, note: 'Sessions that generated an idea' },
    { label: 'Registers', value: input.registrations, note: 'Unique normalised emails' },
    { label: 'Shares a referral link', value: input.sharers, note: 'Registrants who copied/shared their link' },
    { label: 'Referred student registers', value: input.referred, note: 'Registrations with valid referral attribution' },
  ];
  const funnelMax = Math.max(1, ...funnel.map((f) => f.value ?? 0));

  const setSpend = (k: keyof typeof state.spend, v: string) => {
    const n = Math.max(0, Math.min(BUDGET_TOTAL, Number(v) || 0));
    update((s) => ({ ...s, spend: { ...s.spend, [k]: n } }));
  };

  const actions: string[] = [];
  if (input.registrations === 0) actions.push('No registrations yet — run the Demo Controls or complete a registration to populate metrics.');
  if (m.shareRate !== null && m.shareRate < 0.4) actions.push('Share rate is below 40% — test a more prominent post-registration sharing prompt (Experiment 2).');
  const weakest = [...m.channelRows].sort((a, b) => (a.pctOfTarget ?? 0) - (b.pctOfTarget ?? 0))[0];
  actions.push(`Lowest progress vs target: ${weakest.label}. Review its message and distribution before releasing contingency budget.`);
  if (m.unattributed > 0) actions.push(`${m.unattributed} registration(s) have no channel tag — use ?ch= links (e.g. ?ch=ambassador) for every outreach post.`);
  actions.push('Hold the ₹700 contingency until Day 4, then allocate it to the channel with the best registrations per rupee or per hour of effort.');

  return (
    <div className="container-x">
      <PageHeader eyebrow="Growth analytics" title="Campaign dashboard" tag={<span className="tag-demo">Demo dashboard</span>}>
        Track progress toward 500 registrations. Nothing here is a real campaign result.
      </PageHeader>

      {/* Legend + source toggle */}
      <div className="card mb-6 flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs muted">
          <span className="flex items-center gap-2"><span className="tag-plan">Planning target</span> assumption to validate</span>
          <span className="flex items-center gap-2"><span className="tag-synth">Synthetic sample</span> illustrative, invented data</span>
          <span className="flex items-center gap-2"><span className="tag-local">Local demo activity</span> actions in this browser only</span>
        </div>
        <div className="inline-flex rounded-xl border border-white/10 bg-ink-950/70 p-1" role="tablist" aria-label="Data source">
          {(['local', 'synthetic'] as Source[]).map((s) => (
            <button
              key={s}
              id={`dash-source-${s}`}
              role="tab"
              aria-selected={source === s}
              onClick={() => setSource(s)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${source === s ? 'bg-lime-400 text-ink-950' : 'text-slate-300 hover:text-white'}`}
            >
              {s === 'local' ? 'Local demo activity' : 'Synthetic sample'}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-white">Registrations toward target</h2>
            <SourceTag source={source} />
          </div>
          <p className="mt-4 text-5xl font-extrabold tracking-tight text-white">
            {input.registrations}<span className="text-2xl font-semibold text-slate-500"> / {TARGET_TOTAL}</span>
          </p>
          <div className="mt-4"><ProgressBar value={m.progress} label="Registrations toward 500" /></div>
          <p className="mt-2 text-sm muted">{(m.progress * 100).toFixed(1)}% of planning target · {m.remainingToTarget} to go</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Mini label="Referred registrations" value={input.referred} />
            <Mini label="Registrants who shared" value={input.sharers} />
            <Mini label="Unattributed channel" value={m.unattributed} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Visit → registration" value={fmtPct(m.visitToReg)} accent />
          <Stat label="Generator → registration" value={fmtPct(m.generatorToReg)} accent hint="Registrants with an idea ÷ generator sessions" />
          <Stat label="Referral share rate" value={fmtPct(m.shareRate)} hint="Sharers ÷ registrants" />
          <Stat label="Referred per registrant" value={fmtNum(m.referredPerRegistrant)} hint="Every registrant is eligible to refer" />
        </div>
      </section>

      {/* Channels */}
      <section className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-white">Registrations by channel</h2>
            <div className="flex gap-2"><span className="tag-plan">Target</span><SourceTag source={source} /></div>
          </div>
          <p className="mt-1 text-xs muted">One primary acquisition channel per registration. Referral attribution is tracked separately.</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} barGap={4}>
                <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,.03)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Target" fill="#38bdf8" fillOpacity={0.35} radius={[6, 6, 0, 0]} />
                <Bar dataKey={actualKey} radius={[6, 6, 0, 0]}>
                  {CHANNELS.map((c) => <Cell key={c.id} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-white">Channel progress</h2>
          <ul className="mt-5 space-y-5">
            {m.channelRows.map((c) => (
              <li key={c.id}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-slate-300">{c.label}</span>
                  <span className="font-mono text-slate-400">{c.actual}/{c.target}</span>
                </div>
                <ProgressBar value={c.pctOfTarget ?? 0} color={c.color} label={`${c.label} progress`} />
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs muted">Targets sum to {CHANNELS.reduce((a, c) => a + c.target, 0)} — planning assumptions, not forecasts.</p>
        </div>
      </section>

      {/* Funnel */}
      <section className="mt-6 card p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-white">Growth funnel</h2>
          <SourceTag source={source} />
        </div>
        <ol className="mt-5 space-y-3">
          {funnel.map((f, i) => {
            const prev = i > 1 ? funnel[i - 1].value : null;
            const step = f.value !== null && prev ? f.value / prev : null;
            return (
              <li key={f.label} className="grid items-center gap-2 sm:grid-cols-[230px_1fr_120px]">
                <div>
                  <p className="text-sm font-medium text-white"><span className="mr-2 font-mono text-slate-500">{i + 1}</span>{f.label}</p>
                  <p className="text-xs text-slate-500">{f.note}</p>
                </div>
                <div className="h-8 rounded-lg bg-white/[0.03]">
                  {f.value !== null && (
                    <div
                      className="flex h-full items-center rounded-lg bg-gradient-to-r from-lime-400/70 to-emerald-400/50 px-3 text-xs font-bold text-ink-950 transition-[width] duration-700"
                      style={{ width: `${Math.max(f.value / funnelMax, f.value ? 0.06 : 0) * 100}%` }}
                    >
                      {f.value > 0 ? f.value : ''}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 sm:text-right">
                  {f.value === null ? 'Not tracked' : f.value === 0 ? '0' : i > 1 ? `${fmtPct(step, 0)} of prev.` : '—'}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Budget */}
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between"><h2 className="font-semibold text-white">Budget allocation</h2><span className="tag-plan">Plan</span></div>
          <div className="mt-2 grid items-center gap-4 sm:grid-cols-[180px_1fr]">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={BUDGET_LINES.map((b) => ({ name: b.label, value: b.amount }))} dataKey="value" innerRadius={48} outerRadius={78} paddingAngle={3} stroke="none">
                    {BUDGET_LINES.map((b) => <Cell key={b.id} fill={b.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `₹${v}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3">
              {BUDGET_LINES.map((b) => (
                <li key={b.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: b.color }} />
                  <div className="flex-1">
                    <div className="flex justify-between gap-2"><span className="text-slate-200">{b.label}</span><span className="font-mono text-white">₹{b.amount}</span></div>
                    <p className="text-xs muted">{b.note}</p>
                  </div>
                </li>
              ))}
              <li className="flex justify-between border-t border-white/10 pt-2 text-sm font-semibold"><span>Total</span><span className="font-mono">₹{BUDGET_TOTAL}</span></li>
            </ul>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between"><h2 className="font-semibold text-white">Spend & remaining budget</h2><SourceTag source={source} /></div>
          {source === 'local' ? (
            <>
              <p className="mt-1 text-xs muted">Enter hypothetical spend to test cost-per-registration. Starts at ₹0 — no money has been spent.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {BUDGET_LINES.map((b) => (
                  <div key={b.id}>
                    <label htmlFor={`spend-${b.id}`} className="text-xs text-slate-400">{b.label}</label>
                    <input id={`spend-${b.id}`} type="number" min={0} max={b.amount * 2} className="input mt-1 !py-2" value={state.spend[b.id]} onChange={(e) => setSpend(b.id, e.target.value)} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-1 text-xs muted">Synthetic spend figures — illustrative only.</p>
          )}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Mini label="Spent" value={fmtINR(m.totalSpend)} />
            <Mini label="Remaining" value={<span className={m.remainingBudget < 0 ? 'text-rose-300' : ''}>{fmtINR(m.remainingBudget)}</span>} />
            <Mini label="Cost / registration" value={fmtINR(m.costPerReg)} />
          </div>
          <div className="mt-4"><ProgressBar value={m.totalSpend / BUDGET_TOTAL} color={m.remainingBudget < 0 ? '#fb7185' : '#a3e635'} label="Budget used" /></div>
          {m.remainingBudget < 0 && <p className="mt-2 text-xs text-rose-300">Spend exceeds the ₹2,000 budget.</p>}
        </div>
      </section>

      {/* Timeline + actions */}
      <section className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold text-white"><CalendarDays size={17} className="text-lime-400" /> Seven-day campaign timeline</h2><span className="tag-plan">Proposed</span></div>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {TIMELINE.map((t) => (
              <li key={t.day} className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-lime-400/10 font-mono text-sm font-bold text-lime-300">D{t.day}</span>
                <div><p className="text-sm font-semibold text-white">{t.title}</p><p className="text-xs muted leading-relaxed">{t.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-semibold text-white"><ListChecks size={17} className="text-lime-400" /> Recommended next actions</h2>
            <ul className="mt-4 space-y-3">
              {actions.map((a) => <li key={a} className="flex gap-2.5 text-sm text-slate-300"><ArrowRight size={15} className="mt-0.5 shrink-0 text-lime-400" />{a}</li>)}
            </ul>
          </div>
          <button onClick={() => navigate('experiments')} className="card card-hover flex w-full items-center gap-3 p-5 text-left">
            <FlaskConical size={20} className="text-lime-400" />
            <div className="flex-1"><p className="font-semibold text-white">Three proposed growth experiments</p><p className="text-xs muted">Message positioning · Referral activation · Channel efficiency</p></div>
            <ArrowRight size={16} className="text-slate-400" />
          </button>
        </div>
      </section>

      <p className="mt-6 flex items-start gap-2 text-xs muted"><Info size={14} className="mt-0.5 shrink-0" />
        No personal registrant information is displayed. Local demo data lives only in this browser and is not a shared database or external analytics.
      </p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
