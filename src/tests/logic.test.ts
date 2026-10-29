import { describe, expect, it } from 'vitest';
import {
  initialState, isWellFormedCode, markShared, normalizeEmail, parseCampaignParams, referralCount,
  referralLink, register, validateRegistration, type AppState,
} from '../lib/store';
import { PROJECTS, recommend, rankProjects } from '../lib/projects';
import { computeMetrics, fmtPct, fromState, fromSynthetic, ratio } from '../lib/metrics';
import { CHANNELS, BUDGET_LINES, TARGET_TOTAL, BUDGET_TOTAL, whatsappUrl } from '../lib/campaign';

const A = { name: 'Asha Rao', email: 'asha.rao@gmail.com', college: 'ABC Engineering College', gradYear: '2026' };
const B = { name: 'Ben Thomas', email: 'ben@example.com', college: 'XYZ Institute', gradYear: '2026' };

function withA(): { s: AppState; code: string } {
  const r = register(initialState(), A);
  if (!r.ok) throw new Error('setup failed');
  return { s: r.state, code: r.registration.code };
}

describe('planning numbers', () => {
  it('channel targets sum to 500 and budget to 2000', () => {
    expect(CHANNELS.reduce((a, c) => a + c.target, 0)).toBe(TARGET_TOTAL);
    expect(BUDGET_LINES.reduce((a, b) => a + b.amount, 0)).toBe(BUDGET_TOTAL);
  });
});

describe('project generator', () => {
  it('is deterministic and changes with selections', () => {
    const s1 = { interest: 'data', level: 'beginner', goal: 'portfolio', lang: 'python' } as const;
    const s2 = { interest: 'web', level: 'comfortable', goal: 'internship', lang: 'javascript' } as const;
    expect(recommend(s1).id).toBe(recommend(s1).id);
    expect(recommend(s1).id).not.toBe(recommend(s2).id);
    expect(recommend(s1).id).toBe('placement-insights');
  });
  it('try another cycles through distinct ideas', () => {
    const s = { interest: 'ml', level: 'basic', goal: 'explore', lang: 'any' } as const;
    const ids = new Set([0, 1, 2, 3].map((n) => recommend(s, n).id));
    expect(ids.size).toBe(4);
    expect(recommend(s, 4).id).toBe(recommend(s, 0).id);
  });
  it('never recommends intermediate projects first to complete beginners', () => {
    for (const interest of ['data', 'ml', 'web', 'automation'] as const) {
      expect(rankProjects({ interest, level: 'beginner', goal: 'explore', lang: 'any' })[0].difficulty).not.toBe('Intermediate');
    }
  });
  it('every template has 3 steps and full content', () => {
    for (const p of PROJECTS) {
      expect(p.steps).toHaveLength(3);
      expect(p.title && p.problem && p.why && p.extension && p.workshopLearning).toBeTruthy();
    }
  });
});

describe('validation', () => {
  it('requires fields and checks email + lengths', () => {
    const e = validateRegistration({ name: '', email: 'bad', college: '', gradYear: '' });
    expect(Object.keys(e).sort()).toEqual(['college', 'email', 'gradYear', 'name']);
    expect(validateRegistration({ ...A, name: 'x'.repeat(61) }).name).toBeTruthy();
    expect(validateRegistration({ ...A, gradYear: '1999' }).gradYear).toBeTruthy();
    expect(validateRegistration(A)).toEqual({});
  });
});

describe('email normalisation & duplicates', () => {
  it('normalises case, gmail dots and plus tags', () => {
    expect(normalizeEmail('  Asha.Rao+test@GMAIL.com ')).toBe('asharao@gmail.com');
    expect(normalizeEmail('x+y@example.com')).toBe('x@example.com');
  });
  it('blocks duplicate emails', () => {
    const { s } = withA();
    const r = register(s, { ...B, email: 'ASHARAO@gmail.com' });
    expect(r.ok).toBe(false);
  });
});

describe('referrals', () => {
  it('generates well-formed unique codes', () => {
    const { code } = withA();
    expect(isWellFormedCode(code)).toBe(true);
    expect(code).toMatch(/^AISPRINT-[A-Z]{2}\d{3}$/);
  });
  it('builds and parses referral links', () => {
    const link = referralLink('AISPRINT-AB123', 'https://x.app/?foo=1#/register');
    expect(link).toBe('https://x.app/?ref=AISPRINT-AB123');
    expect(parseCampaignParams('?ref=aisprint-ab123&ch=ambassador')).toEqual({ ref: 'AISPRINT-AB123', channel: 'ambassador' });
    expect(parseCampaignParams('?ref=<script>&ch=evil')).toEqual({ ref: undefined, channel: undefined });
  });
  it('attributes a valid referral exactly once', () => {
    const { s, code } = withA();
    const r = register(s, B, { ref: code });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.registration.referredBy).toBe(code);
    expect(r.registration.channel).toBe('whatsapp');
    expect(referralCount(r.state, code)).toBe(1);
    const again = register(r.state, B, { ref: code });
    expect(again.ok).toBe(false);
    expect(referralCount(r.state, code)).toBe(1);
  });
  it('prevents self-referral (including email aliases)', () => {
    const { s, code } = withA();
    const r = register(s, { ...A, email: 'asharao+2@gmail.com' }, { ref: code });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toMatch(/own referral/);
  });
  it('allows registration without attribution for unknown codes', () => {
    const r = register(initialState(), B, { ref: 'AISPRINT-ZZ999' });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.registration.referredBy).toBeUndefined();
      expect(r.registration.channel).toBe('unattributed');
      expect(r.referralNote).toBeTruthy();
    }
  });
  it('explicit channel wins over referral default', () => {
    const { s, code } = withA();
    const r = register(s, B, { ref: code, channel: 'community' });
    expect(r.ok && r.registration.channel).toBe('community');
  });
  it('WhatsApp URL contains encoded message and link', () => {
    const url = whatsappUrl('https://x.app/?ref=AISPRINT-AB123');
    expect(url.startsWith('https://wa.me/?text=')).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toContain('https://x.app/?ref=AISPRINT-AB123');
  });
});

describe('metrics', () => {
  it('returns null (Not enough data) for zero denominators', () => {
    const m = computeMetrics(fromState(initialState()));
    expect(m.visitToReg).toBeNull();
    expect(m.shareRate).toBeNull();
    expect(m.costPerReg).toBeNull();
    expect(fmtPct(null)).toBe('Not enough data');
    expect(ratio(1, 0)).toBeNull();
  });
  it('computes local metrics correctly', () => {
    const { s, code } = withA();
    const r = register({ ...s, visitSessions: 4, generatorSessions: 2 }, B, { ref: code, projectId: 'x' });
    if (!r.ok) throw new Error();
    const st = markShared({ ...r.state, spend: { ambassador: 100, creative: 0, contingency: 0 } }, code);
    const m = computeMetrics(fromState(st));
    expect(m.visitToReg).toBe(0.5);
    expect(m.generatorToReg).toBe(0.5);
    expect(m.shareRate).toBe(0.5);
    expect(m.referredPerRegistrant).toBe(0.5);
    expect(m.costPerReg).toBe(50);
    expect(m.remainingBudget).toBe(1900);
  });
  it('markShared ignores unknown or repeated codes', () => {
    const { s, code } = withA();
    expect(markShared(markShared(s, code), code).sharedCodes).toEqual([code]);
    expect(markShared(s, 'AISPRINT-QQ000').sharedCodes).toEqual([]);
  });
  it('synthetic channels sum to synthetic registrations', () => {
    const syn = fromSynthetic();
    expect(Object.values(syn.byChannel).reduce((a, b) => a + b, 0)).toBe(syn.registrations);
  });
});
