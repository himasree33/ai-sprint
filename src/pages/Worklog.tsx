import { Copy, Download, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { PageHeader } from '../components/Ui';
import { DEFAULT_WORKLOG, type WorklogEntry } from '../lib/store';

const FIELDS: { k: keyof WorklogEntry; label: string }[] = [
  { k: 'prompt', label: 'Prompt' },
  { k: 'suggestion', label: 'AI suggestion' },
  { k: 'changed', label: 'What I changed or rejected' },
  { k: 'decision', label: 'Final decision' },
  { k: 'learning', label: 'Learning' },
];

export function worklogToMarkdown(entries: WorklogEntry[]): string {
  return [
    '# AI Worklog — AI Sprint',
    '',
    '> DRAFT EXAMPLES — REPLACE WITH ACTUAL BUILD NOTES.',
    '',
    ...entries.flatMap((e, i) => [
      `## Entry ${i + 1}: ${e.title}`,
      '',
      ...FIELDS.map((f) => `**${f.label}:** ${e[f.k] || '_(empty)_'}`).flatMap((l) => [l, '']),
    ]),
  ].join('\n');
}

export function Worklog() {
  const { state, update, copy, toast } = useApp();
  const entries = state.worklog;
  const set = (id: string, k: keyof WorklogEntry, v: string) =>
    update((s) => ({ ...s, worklog: s.worklog.map((e) => (e.id === id ? { ...e, [k]: v } : e)) }));

  const download = () => {
    const blob = new Blob([worklogToMarkdown(entries)], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-worklog.md';
    a.click();
    URL.revokeObjectURL(url);
    toast('ai-worklog.md downloaded');
  };

  return (
    <div className="container-x max-w-4xl">
      <PageHeader eyebrow="Process" title="AI Worklog">
        A record of how AI was used while building — prompts, suggestions, and the human decisions on top. Edits save automatically in this browser.
      </PageHeader>
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] px-4 py-3 text-sm text-amber-100">
        <span className="tag-demo shrink-0">Draft</span>
        <span><strong>DRAFT EXAMPLES — REPLACE WITH ACTUAL BUILD NOTES.</strong> These illustrative entries are not records of real AI conversations.</span>
      </div>
      <div className="mb-6 flex flex-wrap gap-2.5">
        <button id="wl-copy" className="btn-primary" onClick={() => copy(worklogToMarkdown(entries), 'Worklog Markdown')}><Copy size={15} /> Copy as Markdown</button>
        <button id="wl-download" className="btn-ghost" onClick={download}><Download size={15} /> Export .md</button>
        <button id="wl-add" className="btn-ghost" onClick={() => update((s) => ({ ...s, worklog: [...s.worklog, { id: `w${Date.now()}`, title: 'New entry', prompt: '', suggestion: '', changed: '', decision: '', learning: '' }] }))}><Plus size={15} /> Add entry</button>
        <button id="wl-restore" className="btn-ghost" onClick={() => { if (confirm('Restore the three example entries? Your edits will be lost.')) update((s) => ({ ...s, worklog: structuredClone(DEFAULT_WORKLOG) })); }}><RotateCcw size={15} /> Restore examples</button>
      </div>
      <div className="space-y-5">
        {entries.map((e, i) => (
          <article key={e.id} className="card p-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-lime-400">#{i + 1}</span>
              <label htmlFor={`wl-${e.id}-title`} className="sr-only">Entry title</label>
              <input id={`wl-${e.id}-title`} className="flex-1 bg-transparent text-lg font-bold text-white outline-none focus:underline decoration-lime-400/50 underline-offset-4" value={e.title} maxLength={80} onChange={(ev) => set(e.id, 'title', ev.target.value)} />
              <button aria-label={`Delete entry ${i + 1}`} className="btn-ghost !p-2" onClick={() => update((s) => ({ ...s, worklog: s.worklog.filter((x) => x.id !== e.id) }))}><Trash2 size={15} /></button>
            </div>
            <div className="mt-4 grid gap-4">
              {FIELDS.map((f) => (
                <div key={f.k}>
                  <label htmlFor={`wl-${e.id}-${f.k}`} className="label !text-xs uppercase tracking-wider !text-slate-500">{f.label}</label>
                  <textarea id={`wl-${e.id}-${f.k}`} rows={2} maxLength={1000} className="input resize-y" value={e[f.k]} onChange={(ev) => set(e.id, f.k, ev.target.value)} />
                </div>
              ))}
            </div>
          </article>
        ))}
        {entries.length === 0 && <p className="card p-8 text-center muted">No entries. Add one or restore the examples.</p>}
      </div>
    </div>
  );
}
