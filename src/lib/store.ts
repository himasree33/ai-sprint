import type { Channel } from './campaign';
import { CHANNELS } from './campaign';

export type AcqChannel = Channel | 'unattributed';

export interface Registration {
  id: string;
  name: string;
  emailNorm: string;
  college: string;
  gradYear: number;
  interest?: string;
  code: string;
  referredBy?: string; // referral attribution (tracked separately from channel)
  channel: AcqChannel; // exactly one primary acquisition channel
  projectId?: string;
  synthetic: boolean; // true when created by Demo Controls
  createdAt: number;
}

export interface WorklogEntry {
  id: string;
  title: string;
  prompt: string;
  suggestion: string;
  changed: string;
  decision: string;
  learning: string;
}

export type ExperimentStatus = 'Proposed' | 'Ready to test' | 'Not started';

export interface ExperimentConfig {
  criterion: string;
  status: ExperimentStatus;
}

export interface AppState {
  version: 1;
  registrations: Registration[];
  visitSessions: number;
  generatorSessions: number;
  sharedCodes: string[];
  spend: { ambassador: number; creative: number; contingency: number };
  experiments: Record<string, ExperimentConfig>;
  worklog: WorklogEntry[];
  myCode?: string;
  lastProjectId?: string;
}

export const DEFAULT_WORKLOG: WorklogEntry[] = [
  {
    id: 'w1',
    title: 'Asset selection',
    prompt: 'What is an effective asset to promote a student AI workshop?',
    suggestion: 'Build a conventional landing page.',
    changed: 'Rejected a plain landing page as the primary asset because it gives students no value before registering.',
    decision:
      'Explore an interactive project generator and referral-sharing flow to give students value and encourage organic sharing.',
    learning: 'An asset that delivers value up front can double as the reason to share.',
  },
  {
    id: 'w2',
    title: 'Channel selection',
    prompt: 'How can a campaign aim for 500 registrations with ₹2,000?',
    suggestion: 'Spread the campaign across paid advertising, influencers, email, and social media.',
    changed: 'Rejected spreading ₹2,000 across many paid channels — the budget is too small for paid reach to matter.',
    decision: 'Prioritise college communities and referrals while keeping paid promotion limited and measurable.',
    learning: 'With a tiny budget, trust-based distribution matters more than paid reach.',
  },
  {
    id: 'w3',
    title: 'Technical scope',
    prompt: 'How can I automate referral tracking and campaign reporting?',
    suggestion: 'Build a complex backend with several integrations.',
    changed: 'Deferred the backend; the challenge needs a working demonstration, not production infrastructure.',
    decision: 'Start with a functional local prototype and add production infrastructure only when necessary.',
    learning: 'Scope to what proves the idea; document what production would need.',
  },
];

export const DEFAULT_EXPERIMENTS: Record<string, ExperimentConfig> = {
  positioning: { criterion: '20', status: 'Proposed' },
  referral: { criterion: '0.3', status: 'Proposed' },
  channel: { criterion: '15', status: 'Proposed' },
};

export function initialState(): AppState {
  return {
    version: 1,
    registrations: [],
    visitSessions: 0,
    generatorSessions: 0,
    sharedCodes: [],
    spend: { ambassador: 0, creative: 0, contingency: 0 },
    experiments: structuredClone(DEFAULT_EXPERIMENTS),
    worklog: structuredClone(DEFAULT_WORKLOG),
  };
}

/* ---------------- Email + validation ---------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Lowercase + trim; strips "+tags" and Gmail dots so aliases count as one person. */
export function normalizeEmail(email: string): string {
  const e = email.trim().toLowerCase();
  const at = e.lastIndexOf('@');
  if (at < 1) return e;
  let local = e.slice(0, at);
  let domain = e.slice(at + 1);
  local = local.split('+')[0];
  if (domain === 'googlemail.com') domain = 'gmail.com';
  if (domain === 'gmail.com') local = local.replace(/\./g, '');
  return `${local}@${domain}`;
}

export interface RegistrationInput {
  name: string;
  email: string;
  college: string;
  gradYear: string;
  interest?: string;
}

export type FieldErrors = Partial<Record<keyof RegistrationInput | 'form', string>>;

export const GRAD_YEARS = [2025, 2026, 2027, 2028];

export function validateRegistration(input: RegistrationInput): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.name.trim();
  if (!name) errors.name = 'Please enter your full name.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
  else if (name.length > 60) errors.name = 'Name must be 60 characters or fewer.';
  else if (!/^[\p{L} .'-]+$/u.test(name)) errors.name = 'Name can contain letters, spaces, dots, hyphens and apostrophes.';

  const email = input.email.trim();
  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > 100) errors.email = 'Email must be 100 characters or fewer.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

  const college = input.college.trim();
  if (!college) errors.college = 'Please enter your college or university.';
  else if (college.length < 2) errors.college = 'College name must be at least 2 characters.';
  else if (college.length > 100) errors.college = 'College name must be 100 characters or fewer.';

  const year = Number(input.gradYear);
  if (!input.gradYear) errors.gradYear = 'Please select your graduation year.';
  else if (!GRAD_YEARS.includes(year)) errors.gradYear = 'Please select a valid graduation year.';

  if (input.interest && input.interest.length > 60) errors.interest = 'Invalid area of interest.';
  return errors;
}

/* ---------------- Referral codes ---------------- */

const CODE_RE = /^AISPRINT-[A-Z]{2}\d{3}$/;
const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

export function isWellFormedCode(code: string | null | undefined): code is string {
  return !!code && CODE_RE.test(code);
}

function randInt(max: number): number {
  const buf = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buf);
  return buf[0] % max;
}

export function generateCode(existing: Set<string>): string {
  for (let i = 0; i < 1000; i++) {
    const code = `AISPRINT-${LETTERS[randInt(LETTERS.length)]}${LETTERS[randInt(LETTERS.length)]}${String(randInt(1000)).padStart(3, '0')}`;
    if (!existing.has(code)) return code;
  }
  throw new Error('Could not generate a unique referral code');
}

export function findByCode(state: AppState, code: string | undefined): Registration | undefined {
  if (!isWellFormedCode(code)) return undefined;
  return state.registrations.find((r) => r.code === code);
}

export function referralLink(code: string, base: string): string {
  const url = new URL(base);
  url.search = '';
  url.hash = '';
  url.searchParams.set('ref', code);
  return url.toString();
}

/** Parses ?ref= and ?ch= from a URL search string. */
export function parseCampaignParams(search: string): { ref?: string; channel?: Channel } {
  const p = new URLSearchParams(search);
  const rawRef = p.get('ref')?.trim().toUpperCase();
  const rawCh = p.get('ch')?.trim().toLowerCase();
  return {
    ref: isWellFormedCode(rawRef) ? rawRef : undefined,
    channel: CHANNELS.some((c) => c.id === rawCh) ? (rawCh as Channel) : undefined,
  };
}

/* ---------------- Registration ---------------- */

export interface RegisterContext {
  ref?: string;
  channel?: Channel;
  projectId?: string;
  synthetic?: boolean;
  now?: number;
}

export type RegisterResult =
  | { ok: true; state: AppState; registration: Registration; referralNote?: string }
  | { ok: false; errors: FieldErrors };

export function register(state: AppState, input: RegistrationInput, ctx: RegisterContext = {}): RegisterResult {
  const errors = validateRegistration(input);
  if (Object.keys(errors).length) return { ok: false, errors };

  const emailNorm = normalizeEmail(input.email);
  const referrer = findByCode(state, ctx.ref);

  if (referrer && referrer.emailNorm === emailNorm) {
    return { ok: false, errors: { email: 'You cannot use your own referral link to register again.' } };
  }
  if (state.registrations.some((r) => r.emailNorm === emailNorm)) {
    return { ok: false, errors: { email: 'This email is already registered in this demo.' } };
  }

  let referralNote: string | undefined;
  if (ctx.ref && !referrer) referralNote = 'The referral code was not recognised, so this registration has no referral attribution.';

  const channel: AcqChannel = ctx.channel ?? (referrer ? 'whatsapp' : 'unattributed');
  const registration: Registration = {
    id: `r_${(ctx.now ?? Date.now()).toString(36)}_${randInt(1e6)}`,
    name: input.name.trim(),
    emailNorm,
    college: input.college.trim(),
    gradYear: Number(input.gradYear),
    interest: input.interest || undefined,
    code: generateCode(new Set(state.registrations.map((r) => r.code))),
    referredBy: referrer?.code,
    channel,
    projectId: ctx.projectId,
    synthetic: !!ctx.synthetic,
    createdAt: ctx.now ?? Date.now(),
  };
  return {
    ok: true,
    registration,
    referralNote,
    state: { ...state, registrations: [...state.registrations, registration] },
  };
}

export function referralCount(state: AppState, code: string): number {
  return state.registrations.filter((r) => r.referredBy === code).length;
}

export function markShared(state: AppState, code: string): AppState {
  if (state.sharedCodes.includes(code) || !findByCode(state, code)) return state;
  return { ...state, sharedCodes: [...state.sharedCodes, code] };
}

/* ---------------- Persistence ---------------- */

const KEY = 'ai-sprint-demo-v1';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as AppState;
    if (parsed?.version !== 1 || !Array.isArray(parsed.registrations)) return initialState();
    return { ...initialState(), ...parsed };
  } catch {
    return initialState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable (private mode) — demo continues in memory */
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.clear();
  } catch {
    /* ignore */
  }
}
