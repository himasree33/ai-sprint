import { Megaphone, MessageCircle, Target, Users, Wallet, Calculator, CalendarDays, Lightbulb, Printer } from 'lucide-react';
import { PageHeader, SectionHeader } from '../components/Ui';
import { BUDGET_LINES, BUDGET_TOTAL, CHANNELS, TARGET_TOTAL, TIMELINE } from '../lib/campaign';

const CHANNEL_WHY: Record<string, { icon: typeof Users; why: string }> = {
  ambassador: { icon: Users, why: 'Trusted peers inside each college reach final-year students directly at near-zero cost. Most of the budget goes here as small, performance-linked incentives.' },
  whatsapp: { icon: MessageCircle, why: 'Class and hostel groups are where students already talk. Every registrant becomes a distributor via their referral link — free, and compounding.' },
  social: { icon: Megaphone, why: 'Short project demos on LinkedIn and Instagram build credibility and give ambassadors something to share. Organic only — no paid boost by default.' },
  community: { icon: Target, why: 'Coding clubs, Discord servers and department groups are highly relevant. Direct, personal outreach costs time, not money.' },
};

export function Playbook() {
  return (
    <div className="container-x">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader eyebrow="Strategy" title="Growth Playbook" tag={<span className="tag-plan">Plan — estimates to validate</span>}>
          How we would aim for 500 registrations in 7 days with ₹2,000. Every number below is a planning assumption.
        </PageHeader>
        <a className="btn-ghost mb-10" href="/growth-plan.html" target="_blank" rel="noopener" id="playbook-print">
          <Printer size={15} /> Printable growth plan
        </a>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow">Target audience</p>
          <p className="mt-3 text-slate-200 leading-relaxed">
            Final-year engineering students in India who want practical AI skills, portfolio projects, and greater confidence
            discussing projects during internship and placement interviews.
          </p>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2"><p className="eyebrow">Student insight</p><span className="tag-plan">Hypothesis</span></div>
          <p className="mt-3 text-slate-200 leading-relaxed">
            Some students may be interested in AI but hesitate because they think they need advanced coding skills, expensive
            tools, or weeks of preparation.
          </p>
          <p className="mt-3 flex gap-2 text-sm muted"><Lightbulb size={15} className="mt-0.5 shrink-0 text-lime-400" />
            To validate: compare conversion of “no experience needed” vs generic copy (Experiment 1) and note common objections from ambassadors.</p>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader eyebrow="Channel strategy" title="Four channels, prioritised for a ₹2,000 budget">
          ₹2,000 buys almost no meaningful paid reach. So the plan leans on trust and existing student networks, where cost is mostly effort — and spends money only where it unlocks distribution.
        </SectionHeader>
        <div className="grid gap-4 md:grid-cols-2">
          {CHANNELS.map((c, i) => {
            const { icon: Icon, why } = CHANNEL_WHY[c.id];
            return (
              <div key={c.id} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${c.color}1a`, color: c.color }}><Icon size={19} /></span>
                  <div className="flex-1"><p className="text-xs text-slate-500">Priority {i + 1}</p><h3 className="font-semibold text-white">{c.label}</h3></div>
                  <span className="font-mono text-lg font-bold" style={{ color: c.color }}>{c.target}</span>
                </div>
                <p className="mt-3 text-sm muted leading-relaxed">{why}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white"><Calculator size={18} className="text-lime-400" /> Registration model</h2>
          <p className="mt-1 text-sm muted">Estimates to validate — not forecasts.</p>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {CHANNELS.map((c) => (
                <tr key={c.id} className="border-b border-white/[0.06]">
                  <td className="py-2.5 text-slate-300">{c.label}</td>
                  <td className="py-2.5 text-right font-mono text-white">{c.target}</td>
                  <td className="py-2.5 pl-3 text-right text-xs text-slate-500">{((c.target / TARGET_TOTAL) * 100).toFixed(0)}%</td>
                </tr>
              ))}
              <tr><td className="pt-3 font-semibold text-white">Total</td><td className="pt-3 text-right font-mono font-bold text-lime-300">{CHANNELS.reduce((a, c) => a + c.target, 0)}</td><td /></tr>
            </tbody>
          </table>
          <p className="mt-4 text-xs muted">Example check: 220 ambassador registrations ≈ 11 ambassadors × 20 registrations each. 150 referrals ≈ 0.43 referred registrations per non-referred registrant (150 ÷ 350).</p>
        </div>
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white"><Wallet size={18} className="text-lime-400" /> ₹{BUDGET_TOTAL.toLocaleString('en-IN')} budget</h2>
          <ul className="mt-4 space-y-4">
            {BUDGET_LINES.map((b) => (
              <li key={b.id}>
                <div className="flex justify-between text-sm"><span className="text-slate-200">{b.label}</span><span className="font-mono text-white">₹{b.amount}</span></div>
                <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.06]"><div className="h-full rounded-full" style={{ width: `${(b.amount / BUDGET_TOTAL) * 100}%`, background: b.color }} /></div>
                <p className="mt-1 text-xs muted">{b.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm muted">Free distribution and student communities get priority because they scale with effort, not money. Cash is reserved for incentives that reward verified outcomes.</p>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader eyebrow="Seven-day plan" title="Proposed actions, day by day" tag={<span className="tag-plan">Not executed</span>} />
        <ol className="relative grid gap-3 border-l border-white/10 pl-6 md:grid-cols-1">
          {TIMELINE.map((t) => (
            <li key={t.day} className="relative">
              <span className="absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-ink-950 bg-lime-400" />
              <div className="card p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-white"><CalendarDays size={14} className="text-lime-400" /> Day {t.day} · {t.title}</p>
                <p className="mt-1 text-sm muted">{t.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
