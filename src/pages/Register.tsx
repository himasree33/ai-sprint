import { useState, type FormEvent } from 'react';
import { CheckCircle2, Copy, Link2, MessageCircle, Sparkles, UserPlus, Users } from 'lucide-react';
import { useApp } from '../AppContext';
import { DemoBanner, PageHeader } from '../components/Ui';
import { whatsappUrl } from '../lib/campaign';
import { INTEREST_LABELS, getProject } from '../lib/projects';
import {
  GRAD_YEARS, findByCode, referralCount, referralLink, register,
  type FieldErrors, type RegistrationInput,
} from '../lib/store';

const EMPTY: RegistrationInput = { name: '', email: '', college: '', gradYear: '', interest: '' };

export function ReferralShare({ code }: { code: string }) {
  const { copy, share, baseUrl, state } = useApp();
  const link = referralLink(code, baseUrl);
  const count = referralCount(state, code);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-ink-950/60 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Your referral code</p>
          <p id="ref-code" className="mt-1 font-mono text-lg font-semibold text-lime-300">{code}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-ink-950/60 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Friends registered via your link</p>
          <p className="mt-1 text-lg font-semibold text-white">{count}</p>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-ink-950/60 p-3">
        <label htmlFor="ref-link" className="text-xs uppercase tracking-wider text-slate-500">Referral link</label>
        <input id="ref-link" readOnly value={link} onFocus={(e) => e.currentTarget.select()} className="mt-1 w-full bg-transparent font-mono text-sm text-slate-200 outline-none" />
      </div>
      <div className="flex flex-wrap gap-2.5">
        <a
          id="ref-whatsapp"
          className="btn-wa"
          href={whatsappUrl(link)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => share(code)}
        >
          <MessageCircle size={16} /> Share on WhatsApp
        </a>
        <button id="ref-copy-link" className="btn-ghost" onClick={() => { share(code); copy(link, 'Referral link'); }}>
          <Link2 size={15} /> Copy referral link
        </button>
        <button id="ref-copy-code" className="btn-ghost" onClick={() => copy(code, 'Referral code')}>
          <Copy size={15} /> Copy code
        </button>
      </div>
      <p className="text-xs text-slate-500">
        WhatsApp opens with a pre-filled message. Nothing is sent automatically — you choose whether to send it.
      </p>
    </div>
  );
}

export function Register() {
  const { state, update, pendingRef, pendingChannel, navigate } = useApp();
  const [form, setForm] = useState<RegistrationInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [note, setNote] = useState<string>();
  const [showForm, setShowForm] = useState(false);

  const mine = findByCode(state, state.myCode);
  const referrer = findByCode(state, pendingRef);
  const project = getProject(state.lastProjectId);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const res = register(state, form, { ref: pendingRef, channel: pendingChannel, projectId: state.lastProjectId });
    if (!res.ok) {
      setErrors(res.errors);
      const first = Object.keys(res.errors)[0];
      document.getElementById(`reg-${first}`)?.focus();
      return;
    }
    update(() => ({ ...res.state, myCode: res.registration.code }));
    setNote(res.referralNote);
    setErrors({});
    setForm(EMPTY);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const field = (k: keyof RegistrationInput) => ({
    id: `reg-${k}`,
    name: k,
    value: form[k] ?? '',
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `reg-${k}-err` : undefined,
    className: `input ${errors[k] ? 'input-error' : ''}`,
    onChange: (e: { target: { value: string } }) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    },
  });
  const err = (k: keyof RegistrationInput) =>
    errors[k] ? <p id={`reg-${k}-err`} className="mt-1.5 text-xs text-rose-300">{errors[k]}</p> : null;

  return (
    <div className="container-x max-w-4xl">
      <PageHeader eyebrow="Registration" title={mine && !showForm ? "You're in." : 'Register for free'}>
        {mine && !showForm
          ? 'Your demo registration is saved in this browser. Now invite a friend — learning is easier together.'
          : 'Save your seat for "Build Your First AI Project in 60 Minutes". It takes under a minute.'}
      </PageHeader>

      <DemoBanner>
        <strong>DEMO MODE — This prototype does not submit registrations to NxtWave.</strong> Data stays in this browser's
        LocalStorage only and is not a shared database.
      </DemoBanner>

      {mine && !showForm ? (
        <section className="mt-6 space-y-6 animate-fade-up" aria-labelledby="confirm-title">
          <div className="card relative overflow-hidden p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lime-400/15 blur-3xl" />
            <div className="flex items-start gap-4">
              <CheckCircle2 size={30} className="shrink-0 text-lime-400" />
              <div>
                <h2 id="confirm-title" className="text-xl font-bold text-white">Thanks, {mine.name.split(' ')[0]}! Your demo registration is confirmed.</h2>
                <p className="mt-1 text-sm muted">
                  {mine.referredBy ? `Referred by code ${mine.referredBy}. ` : ''}
                  In a live campaign, workshop details would follow by email. This prototype sends nothing.
                </p>
                {note && <p className="mt-2 text-sm text-amber-200">{note}</p>}
              </div>
            </div>
          </div>

          {project && (
            <div className="card p-6">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-lime-400"><Sparkles size={13} /> Your selected project idea</p>
              <p className="mt-2 text-lg font-semibold text-white">{project.title}</p>
              <p className="mt-1 text-sm muted">{project.description}</p>
            </div>
          )}

          <div className="card p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-lime-400/10 text-lime-300"><Users size={19} /></div>
              <div>
                <h2 className="text-lg font-bold text-white">Invite your friends</h2>
                <p className="text-sm muted">Know someone curious about AI? Send them your link — they can explore a project idea first.</p>
              </div>
            </div>
            <ReferralShare code={mine.code} />
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button id="reg-another" className="btn-ghost" onClick={() => setShowForm(true)}><UserPlus size={15} /> Register another person (demo)</button>
            <button className="btn-ghost" onClick={() => navigate('dashboard')}>View demo dashboard</button>
          </div>
        </section>
      ) : (
        <form noValidate onSubmit={submit} className="card mt-6 grid gap-5 p-6 sm:grid-cols-2 sm:p-8" aria-label="Workshop registration">
          {pendingRef && (
            <div className={`sm:col-span-2 rounded-xl border px-4 py-3 text-sm ${referrer ? 'border-lime-400/30 bg-lime-400/[0.06] text-lime-100' : 'border-white/10 bg-white/[0.03] text-slate-300'}`}>
              {referrer
                ? <>You were invited with referral code <span className="font-mono font-semibold">{pendingRef}</span>. Your registration will be attributed to it.</>
                : <>Referral code <span className="font-mono">{pendingRef}</span> isn't recognised in this demo. You can still register normally — without referral attribution.</>}
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="label" htmlFor="reg-name">Full name *</label>
            <input {...field('name')} autoComplete="name" maxLength={60} placeholder="e.g. Priya Sharma" />
            {err('name')}
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="reg-email">Email address *</label>
            <input {...field('email')} type="email" autoComplete="email" maxLength={100} placeholder="you@example.com" />
            {err('email')}
          </div>
          <div>
            <label className="label" htmlFor="reg-college">College or university *</label>
            <input {...field('college')} autoComplete="organization" maxLength={100} placeholder="Your college" />
            {err('college')}
          </div>
          <div>
            <label className="label" htmlFor="reg-gradYear">Graduation year *</label>
            <select {...field('gradYear')}>
              <option value="">Select year</option>
              {GRAD_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            {err('gradYear')}
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="reg-interest">Area of interest <span className="text-slate-500">(optional)</span></label>
            <select {...field('interest')}>
              <option value="">Prefer not to say</option>
              {Object.values(INTEREST_LABELS).map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          {project && (
            <p className="sm:col-span-2 text-sm muted">
              Project idea attached: <span className="text-slate-200">{project.title}</span>
            </p>
          )}
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button id="reg-submit" type="submit" className="btn-primary !px-6 !py-3">Register for Free</button>
            {mine && <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Back to my confirmation</button>}
          </div>
          <p className="sm:col-span-2 text-xs text-slate-500">
            We only ask for what's needed — no phone number. Registrant details are never shown on the dashboard.
          </p>
        </form>
      )}
    </div>
  );
}
