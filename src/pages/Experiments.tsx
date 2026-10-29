import type { ReactNode } from 'react';
import { FlaskConical } from 'lucide-react';
import { useApp } from '../AppContext';
import { PageHeader } from '../components/Ui';
import type { ExperimentStatus } from '../lib/store';

export const EXPERIMENTS = [
  {
    id: 'positioning',
    n: 1,
    name: 'Message positioning',
    hypothesis: 'A project-focused invitation will generate a higher registration conversion rate than a generic workshop announcement.',
    design: 'Create two invitation messages — A: generic workshop announcement; B: “Find your first AI project, then build it in 60 minutes.” Distribute each to similar audiences under similar conditions using separate tracked links (?ch=…&v=A / v=B).',
    metric: 'Registrations ÷ tracked invitation visits, per variant.',
    criterionLabel: 'B beats A by at least (% relative lift)',
    unit: '%',
    decision: 'If B meets the threshold, use project-focused copy in all remaining outreach. Otherwise keep the simpler message and test a different angle.',
  },
  {
    id: 'referral',
    n: 2,
    name: 'Referral activation',
    hypothesis: 'A visible post-registration sharing prompt will increase referral-driven registrations.',
    design: 'Compare a standard confirmation screen (code shown, no prompt) with one containing a prominent “Invite your friends” card and one-tap WhatsApp share. Split registrants between the two experiences.',
    metric: 'Referred registrations per eligible registrant.',
    criterionLabel: 'Prominent prompt reaches at least (referred per registrant)',
    unit: '',
    decision: 'If met, keep the prominent prompt and shift ambassador talking points toward referrals. If not, test a different incentive or message.',
  },
  {
    id: 'channel',
    n: 3,
    name: 'Channel efficiency',
    hypothesis: 'Relevant college communities may generate more registrations per unit of effort or spending than broad, untargeted promotion.',
    design: 'Tag every outreach link with its channel. Log spend and outreach hours per channel. Compare attributed registrations, spend and effort across channels after Day 4.',
    metric: 'Registrations by channel; cost per registration where spend exists; registrations per hour of outreach effort.',
    criterionLabel: 'Best channel delivers at least (registrations per hour of effort)',
    unit: '',
    decision: 'Release the ₹700 contingency to the channel that clears the threshold; reduce effort on channels that do not.',
  },
] as const;

const STATUSES: ExperimentStatus[] = ['Proposed', 'Ready to test', 'Not started'];

export function Experiments() {
  const { state, update } = useApp();
  const setCfg = (id: string, patch: Partial<{ criterion: string; status: ExperimentStatus }>) =>
    update((s) => ({ ...s, experiments: { ...s.experiments, [id]: { ...s.experiments[id], ...patch } } }));

  return (
    <div className="container-x">
      <PageHeader eyebrow="Growth experiments" title="Three proposed experiments" tag={<span className="tag-plan">Proposed — not yet conducted</span>}>
        Each experiment tests one assumption behind the 500-registration model. Success criteria are configurable and saved locally.
      </PageHeader>
      <div className="grid gap-5 lg:grid-cols-3">
        {EXPERIMENTS.map((e) => {
          const cfg = state.experiments[e.id] ?? { criterion: '', status: 'Proposed' };
          return (
            <article key={e.id} className="card card-hover flex flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-400/10 text-lime-300"><FlaskConical size={19} /></span>
                <span className="chip">Experiment {e.n}</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">{e.name}</h2>
              <dl className="mt-4 flex-1 space-y-4 text-sm">
                <Row k="Hypothesis">{e.hypothesis}</Row>
                <Row k="Test design">{e.design}</Row>
                <Row k="Primary metric">{e.metric}</Row>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-lime-400/90">Success criterion</dt>
                  <dd className="mt-1.5">
                    <label htmlFor={`exp-${e.id}-criterion`} className="block text-xs text-slate-400">{e.criterionLabel}</label>
                    <div className="mt-1 flex items-center gap-2">
                      <input id={`exp-${e.id}-criterion`} type="number" step="any" min={0} className="input !py-2 max-w-[120px]" value={cfg.criterion} onChange={(ev) => setCfg(e.id, { criterion: ev.target.value })} />
                      {e.unit && <span className="text-slate-400">{e.unit}</span>}
                    </div>
                  </dd>
                </div>
                <Row k="Decision">{e.decision}</Row>
              </dl>
              <div className="mt-5 border-t border-white/[0.06] pt-4">
                <label htmlFor={`exp-${e.id}-status`} className="text-xs uppercase tracking-wider text-slate-500">Status</label>
                <select id={`exp-${e.id}-status`} className="input mt-1 !py-2" value={cfg.status} onChange={(ev) => setCfg(e.id, { status: ev.target.value as ExperimentStatus })}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-sm muted">These experiments are designs only. No results exist yet; statuses deliberately exclude “completed”.</p>
    </div>
  );
}

function Row({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-lime-400/90">{k}</dt>
      <dd className="mt-1 text-slate-300 leading-relaxed">{children}</dd>
    </div>
  );
}
