import { BUDGET_TOTAL, CHANNELS, SYNTHETIC, TARGET_TOTAL, type Channel } from './campaign';
import type { AppState } from './store';

export interface MetricsInput {
  visits: number;
  generatorSessions: number;
  registrations: number;
  registrationsWithIdea: number;
  sharers: number;
  referred: number;
  byChannel: Record<Channel | 'unattributed', number>;
  spend: { ambassador: number; creative: number; contingency: number };
}

/** Returns null when the denominator is zero (UI shows "Not enough data"). */
export function ratio(num: number, den: number): number | null {
  if (!den || den <= 0 || !Number.isFinite(num)) return null;
  return num / den;
}

export function fromState(s: AppState): MetricsInput {
  const byChannel = { ambassador: 0, whatsapp: 0, social: 0, community: 0, unattributed: 0 };
  for (const r of s.registrations) byChannel[r.channel] += 1;
  return {
    visits: s.visitSessions,
    generatorSessions: s.generatorSessions,
    registrations: s.registrations.length,
    registrationsWithIdea: s.registrations.filter((r) => r.projectId).length,
    sharers: s.sharedCodes.length,
    referred: s.registrations.filter((r) => r.referredBy).length,
    byChannel,
    spend: s.spend,
  };
}

export function fromSynthetic(): MetricsInput {
  return {
    visits: SYNTHETIC.visits,
    generatorSessions: SYNTHETIC.generatorSessions,
    registrations: SYNTHETIC.registrations,
    registrationsWithIdea: SYNTHETIC.registrationsWithIdea,
    sharers: SYNTHETIC.sharers,
    referred: SYNTHETIC.referred,
    byChannel: { ...SYNTHETIC.byChannel, unattributed: 0 },
    spend: SYNTHETIC.spend,
  };
}

export function computeMetrics(m: MetricsInput) {
  const totalSpend = m.spend.ambassador + m.spend.creative + m.spend.contingency;
  return {
    progress: Math.min(1, m.registrations / TARGET_TOTAL),
    remainingToTarget: Math.max(0, TARGET_TOTAL - m.registrations),
    visitToReg: ratio(m.registrations, m.visits),
    generatorToReg: ratio(m.registrationsWithIdea, m.generatorSessions),
    shareRate: ratio(m.sharers, m.registrations),
    referredPerRegistrant: ratio(m.referred, m.registrations), // every registrant has a code, so all are eligible
    totalSpend,
    remainingBudget: BUDGET_TOTAL - totalSpend,
    costPerReg: totalSpend > 0 ? ratio(totalSpend, m.registrations) : null,
    channelRows: CHANNELS.map((c) => ({
      ...c,
      actual: m.byChannel[c.id],
      pctOfTarget: ratio(m.byChannel[c.id], c.target),
    })),
    unattributed: m.byChannel.unattributed,
  };
}

export const fmtPct = (v: number | null, digits = 1) => (v === null ? 'Not enough data' : `${(v * 100).toFixed(digits)}%`);
export const fmtNum = (v: number | null, digits = 2) => (v === null ? 'Not enough data' : v.toFixed(digits));
export const fmtINR = (v: number | null) =>
  v === null ? 'Not enough data' : `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
