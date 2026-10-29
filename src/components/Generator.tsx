import { useState, type ReactNode } from 'react';
import { ArrowRight, Check, Copy, Layers, Lightbulb, RefreshCw, Sparkles, Target, Wrench } from 'lucide-react';
import { useApp } from '../AppContext';
import {
  GOAL_LABELS, INTEREST_LABELS, LANG_LABELS, LEVEL_LABELS, getProject, projectToText, recommend,
  type Goal, type Interest, type Lang, type Level, type ProjectTemplate, type Selections,
} from '../lib/projects';

function OptionGroup<T extends string>({ name, label, options, value, onChange }: {
  name: string; label: string; options: Record<T, string>; value: T; onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(options) as T[]).map((k) => {
          const active = k === value;
          return (
            <label
              key={k}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-lime-400 ${
                active ? 'border-lime-400/60 bg-lime-400/10 text-lime-200' : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={k}
                checked={active}
                onChange={() => onChange(k)}
                className="sr-only"
                id={`gen-${name}-${k}`}
              />
              {options[k]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ProjectResult({ project, onAnother, compact }: { project: ProjectTemplate; onAnother?: () => void; compact?: boolean }) {
  const { navigate, copy } = useApp();
  return (
    <article key={project.id} className="card relative overflow-hidden p-6 sm:p-7 animate-fade-up" aria-live="polite">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip !border-lime-400/30 !text-lime-300"><Sparkles size={12} /> Your recommendation</span>
        <span className="chip">{project.difficulty}</span>
      </div>
      <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">{project.title}</h3>
      <p className="mt-2 muted leading-relaxed">{project.description}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Info icon={<Target size={15} />} title="Problem it solves">{project.problem}</Info>
        <Info icon={<Lightbulb size={15} />} title="Why it's useful">{project.why}</Info>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><Layers size={13} /> Suggested stack</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.stack.map((s) => <span key={s} className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-xs text-slate-200">{s}</span>)}
        </div>
      </div>

      {!compact && (
        <>
          <ol className="mt-6 space-y-3">
            {project.steps.map((st, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime-400/15 text-xs font-bold text-lime-300">{i + 1}</span>
                <span className="text-sm text-slate-300 leading-relaxed">{st}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info icon={<Wrench size={15} />} title="Possible extension">{project.extension}</Info>
            <Info icon={<Check size={15} />} title="What you could learn in 60 minutes">{project.workshopLearning}</Info>
          </div>
        </>
      )}

      <div className="mt-7 flex flex-wrap gap-2.5">
        <button id="gen-register" className="btn-primary" onClick={() => navigate('register')}>
          Register for the Workshop <ArrowRight size={16} />
        </button>
        {onAnother && (
          <button id="gen-another" className="btn-ghost" onClick={onAnother}>
            <RefreshCw size={15} /> Try Another Idea
          </button>
        )}
        <button id="gen-copy" className="btn-ghost" onClick={() => copy(projectToText(project), 'Project idea')}>
          <Copy size={15} /> Copy Project Idea
        </button>
      </div>
      <p className="mt-4 text-xs text-slate-500">Recommended from curated templates using rule-based matching — no external AI API is called.</p>
    </article>
  );
}

function Info({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-lime-400/90">{icon}{title}</p>
      <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">{children}</p>
    </div>
  );
}

export const DEFAULT_SELECTIONS: Selections = { interest: 'data', level: 'beginner', goal: 'portfolio', lang: 'python' };

export function Generator({ compact = false }: { compact?: boolean }) {
  const { state, update, recordGenerate } = useApp();
  const [sel, setSel] = useState<Selections>(DEFAULT_SELECTIONS);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<ProjectTemplate | undefined>(() => (compact ? undefined : getProject(state.lastProjectId)));

  const set = <K extends keyof Selections>(k: K, v: Selections[K]) => setSel((s) => ({ ...s, [k]: v }));

  const generate = (nextAttempt: number) => {
    const p = recommend(sel, nextAttempt);
    setAttempt(nextAttempt);
    setResult(p);
    recordGenerate();
    update((s) => ({ ...s, lastProjectId: p.id }));
  };

  return (
    <div className={`grid gap-6 ${compact ? 'lg:grid-cols-[1fr_1.15fr]' : 'lg:grid-cols-[0.9fr_1.1fr]'} items-start`}>
      <form
        className="card p-6 sm:p-7 space-y-6"
        onSubmit={(e) => { e.preventDefault(); generate(0); }}
        aria-label="Find your first AI project"
      >
        <OptionGroup name="interest" label="Area of interest" options={INTEREST_LABELS} value={sel.interest} onChange={(v: Interest) => set('interest', v)} />
        <OptionGroup name="level" label="Experience level" options={LEVEL_LABELS} value={sel.level} onChange={(v: Level) => set('level', v)} />
        <OptionGroup name="goal" label="Goal" options={GOAL_LABELS} value={sel.goal} onChange={(v: Goal) => set('goal', v)} />
        <OptionGroup name="lang" label="Preferred language" options={LANG_LABELS} value={sel.lang} onChange={(v: Lang) => set('lang', v)} />
        <button id="gen-submit" type="submit" className="btn-primary w-full !py-3">
          <Sparkles size={16} /> Generate My Project
        </button>
      </form>
      <div>
        {result ? (
          <ProjectResult project={result} compact={compact} onAnother={() => generate(attempt + 1)} />
        ) : (
          <div className="card grid min-h-[340px] place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-lime-400/30 bg-lime-400/10 text-lime-300">
                <Sparkles size={24} />
              </div>
              <p className="mt-4 font-semibold text-white">Your project idea will appear here</p>
              <p className="mt-1 text-sm muted max-w-xs">Pick your interests on the left and press <em>Generate My Project</em>.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
