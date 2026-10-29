import { useState } from 'react';
import { ArrowRight, BookOpen, Briefcase, ChevronDown, Clock, Compass, GraduationCap, Laptop, Share2, Sparkles, UserPlus, Wallet } from 'lucide-react';
import { useApp } from '../AppContext';
import { Generator } from '../components/Generator';
import { SectionHeader } from '../components/Ui';
import { WORKSHOP_TITLE } from '../lib/campaign';

const BENEFITS = [
  { icon: Compass, title: 'Start from zero', text: 'Designed for beginners. You do not need prior AI or machine-learning experience to follow along.' },
  { icon: Laptop, title: 'Build, not just watch', text: 'The workshop is framed around building a small AI project, so you leave with something concrete to explore further.' },
  { icon: Briefcase, title: 'A project to talk about', text: 'A first project gives you something specific to discuss when internship and placement conversations come up.' },
  { icon: Wallet, title: 'Free and online', text: 'No fee and no travel. Join from your laptop wherever you are.' },
];

const STEPS = [
  { icon: Sparkles, title: 'Find your idea', text: 'Answer four quick questions and get a beginner-friendly AI project matched to you.' },
  { icon: UserPlus, title: 'Register free', text: 'Save your spot for the 60-minute workshop with just your name, email, college and graduation year.' },
  { icon: Share2, title: 'Bring a friend', text: 'Get a personal referral link and share it on WhatsApp — learning is easier together.' },
];

const FAQS = [
  { q: 'Do I need to know AI or machine learning already?', a: 'No. The workshop is aimed at final-year engineering students and beginners. Basic familiarity with a computer is enough to start; some coding experience helps you go further.' },
  { q: 'How much does it cost?', a: 'The workshop is free and online.' },
  { q: 'How long is it?', a: '60 minutes.' },
  { q: 'When is the workshop?', a: 'Date and time details have not been announced in this prototype. In a live campaign they would be shared with registered students.' },
  { q: 'Is the project generator real AI?', a: 'No — and we say so openly. It recommends from a curated set of project templates using transparent rule-based matching. It works offline and needs no API key.' },
  { q: 'Does this site actually register me with NxtWave?', a: 'No. This is a demo prototype built for a growth challenge. Registrations are stored only in your browser’s LocalStorage and are never sent anywhere.' },
];

function HeroVisual() {
  return (
    <div className="relative animate-fade-up" style={{ animationDelay: '120ms' }} aria-hidden="true">
      <div className="absolute -inset-6 rounded-[2rem] bg-lime-400/10 blur-3xl" />
      <div className="card relative overflow-hidden p-5 shadow-2xl">
        <div className="flex items-center gap-1.5 pb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-lime-400/70" />
          <span className="ml-3 font-mono text-[11px] text-slate-500">find-my-project</span>
        </div>
        <div className="space-y-2 font-mono text-[12.5px]">
          <p><span className="text-slate-500">interest</span> <span className="text-lime-300">→ Data Analytics</span></p>
          <p><span className="text-slate-500">level</span> <span className="text-lime-300">→ Complete beginner</span></p>
          <p><span className="text-slate-500">goal</span> <span className="text-lime-300">→ Portfolio project</span></p>
        </div>
        <div className="mt-5 rounded-xl border border-lime-400/25 bg-gradient-to-br from-lime-400/[0.09] to-transparent p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-lime-400">Recommended</p>
          <p className="mt-1 font-semibold text-white">Student Placement Insights Dashboard</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['Python', 'pandas', 'Colab'].map((t) => <span key={t} className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-slate-300">{t}</span>)}
          </div>
          <div className="mt-4 space-y-1.5">
            {[0.9, 0.7, 0.45].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-4 text-[10px] text-slate-500">{i + 1}</span>
                <div className="h-1.5 rounded-full bg-lime-400/60" style={{ width: `${w * 100}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const { navigate, pendingRef } = useApp();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="container-x relative grid items-center gap-14 pt-16 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
          <div className="animate-fade-up">
            {pendingRef && (
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-medium text-lime-200">
                A friend invited you · code {pendingRef}
              </p>
            )}
            <p className="chip"><span className="h-1.5 w-1.5 rounded-full bg-lime-400" /> Free online workshop · 60 minutes</p>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your First AI Project <span className="bg-gradient-to-r from-lime-300 to-emerald-300 bg-clip-text text-transparent">Starts Here.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed muted">
              You don't need to be an AI expert to get started. Explore beginner-friendly project ideas and discover what
              you could build in just 60 minutes.
            </p>
            <p className="mt-3 text-sm font-medium text-slate-300">Explore an idea. Build your confidence. Bring your friends.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button id="hero-find" className="btn-primary !px-5 !py-3 text-base" onClick={() => navigate('home', 'generator')}>
                <Sparkles size={18} /> Find My Project Idea
              </button>
              <button id="hero-register" className="btn-ghost !px-5 !py-3 text-base" onClick={() => navigate('register')}>
                Register for Free <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <HeroVisual />
        </div>

        {/* Workshop facts */}
        <div className="container-x relative pb-8">
          <dl className="card grid divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {[
              { icon: BookOpen, k: 'Workshop', v: WORKSHOP_TITLE },
              { icon: Wallet, k: 'Format', v: 'Free · Online' },
              { icon: GraduationCap, k: 'For', v: 'Final-year engineering students & beginners' },
              { icon: Clock, k: 'Duration', v: '60 minutes' },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k} className="flex gap-3 p-5">
                <Icon size={18} className="mt-0.5 shrink-0 text-lime-400" />
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-500">{k}</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="container-x scroll-mt-20 py-20">
        <SectionHeader eyebrow="Why join" title="Built for students taking their first step into AI" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card card-hover p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-lime-400/10 text-lime-300"><Icon size={19} /></div>
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm muted leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GENERATOR PREVIEW */}
      <section id="generator" className="container-x scroll-mt-20 py-20">
        <SectionHeader eyebrow="Find Your First AI Project" title="What could you build in 60 minutes?">
          Choose what interests you. We'll match you with a beginner-friendly project.{' '}
          <button className="text-lime-300 underline-offset-4 hover:underline" onClick={() => navigate('generate')}>
            Open the full generator →
          </button>
        </SectionHeader>
        <Generator compact />
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="container-x scroll-mt-20 py-20">
        <SectionHeader eyebrow="How it works" title="Three steps. About two minutes." />
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="card relative p-6">
              <span className="absolute right-5 top-4 font-mono text-5xl font-bold text-white/[0.04]">0{i + 1}</span>
              <Icon size={22} className="text-lime-400" />
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm muted leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="container-x py-12">
        <div className="relative overflow-hidden rounded-3xl border border-lime-400/20 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-10 sm:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime-400/15 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="h2">Save your seat. It's free.</h2>
            <p className="mt-4 text-lg muted">Register in under a minute, then invite a friend with your personal link.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button id="cta-register" className="btn-primary !px-5 !py-3" onClick={() => navigate('register')}>Register for Free <ArrowRight size={17} /></button>
              <button id="cta-find" className="btn-ghost !px-5 !py-3" onClick={() => navigate('generate')}>Find My Project Idea</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-x scroll-mt-20 py-20">
        <SectionHeader eyebrow="FAQ" title="Questions, answered honestly" />
        <div className="max-w-3xl space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="card overflow-hidden">
                <button
                  id={`faq-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-white"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {f.q}
                  <ChevronDown size={18} className={`shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p id={`faq-panel-${i}`} className="px-5 pb-5 text-sm muted leading-relaxed animate-fade-up">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
