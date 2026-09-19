import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, CheckCircle2, Circle, ExternalLink, FileText, Languages, Plane, RotateCcw, Send, Wallet } from 'lucide-react';
import { MILESTONES, type MilestoneId, type Task } from '../lib/roadmap';
import { EXTERNAL } from '../lib/links';

const ICONS: Record<MilestoneId, typeof FileText> = {
  documents: FileText,
  language: Languages,
  applications: Send,
  scholarships: Wallet,
  visa: Plane,
};

interface RoadmapProps {
  tasks: Task[];
  done: Record<string, boolean>;
  onToggle: (id: string, value: boolean) => void;
  onReset: () => void;
}

type NodeStatus = 'done' | 'current' | 'upcoming';

export function Timeline({ tasks, done }: Pick<RoadmapProps, 'tasks' | 'done'>) {
  const reduce = useReducedMotion();
  const stats = MILESTONES.map((m) => {
    const list = tasks.filter((t) => t.milestone === m.id);
    const completed = list.filter((t) => done[t.id]).length;
    return { ...m, list, completed, total: list.length };
  });
  const firstOpen = stats.findIndex((s) => s.completed < s.total);
  const statusOf = (i: number): NodeStatus => (stats[i]!.total > 0 && stats[i]!.completed === stats[i]!.total ? 'done' : i === firstOpen ? 'current' : 'upcoming');
  const [selected, setSelected] = useState<MilestoneId>(stats[firstOpen === -1 ? 0 : firstOpen]!.id);
  const doneCount = stats.filter((_, i) => statusOf(i) === 'done').length;
  const active = stats.find((s) => s.id === selected)!;

  return (
    <section aria-labelledby="plan-title" className="mt-16">
      <h2 id="plan-title" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Action plan
      </h2>
      <p className="mt-2 text-mist">Five milestones. Select one to see its tasks; tick them in the checklist below.</p>

      <div className="glass mt-6 rounded-3xl p-5 sm:p-7">
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="absolute top-6 right-[10%] left-[10%] hidden h-0.5 bg-white/12 md:block" aria-hidden="true">
            <motion.div
              className="h-full bg-gold"
              initial={false}
              animate={{ width: `${(doneCount / (MILESTONES.length - 1)) * 100}%` }}
              transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ maxWidth: '100%' }}
            />
          </div>
          <ol className="relative grid gap-3 md:grid-cols-5 md:gap-2">
            {stats.map((s, i) => {
              const Icon = ICONS[s.id];
              const status = statusOf(i);
              const isSel = s.id === selected;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(s.id)}
                    aria-pressed={isSel}
                    aria-controls="milestone-panel"
                    className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors md:flex-col md:text-center ${
                      isSel ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <span
                      className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                        status === 'done'
                          ? 'border-gold bg-gold text-wine-900'
                          : status === 'current'
                            ? 'border-gold bg-wine-800 text-gold'
                            : 'border-white/20 bg-wine-900 text-dusk'
                      }`}
                    >
                      {status === 'done' ? <Check size={20} strokeWidth={3} aria-hidden="true" /> : <Icon size={20} strokeWidth={1.75} aria-hidden="true" />}
                      {status === 'current' && !reduce && (
                        <motion.span
                          className="absolute inset-0 rounded-full border-2 border-gold"
                          animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">{s.title}</span>
                      <span className="block text-xs text-dusk">
                        {s.completed} of {s.total} done
                        <span className="sr-only"> ({status === 'done' ? 'completed' : status === 'current' ? 'current milestone' : 'upcoming'})</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <motion.div
          id="milestone-panel"
          key={selected}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-2xl border border-white/10 bg-wine-950/35 p-5"
          aria-live="polite"
        >
          <h3 className="font-semibold text-ink">{active.title}</h3>
          <p className="mt-1 text-sm text-dusk">{active.summary}</p>
          <ul className="mt-4 space-y-3">
            {active.list.map((t) => (
              <li key={t.id} className="flex gap-3 text-sm">
                {done[t.id] ? (
                  <CheckCircle2 className="mt-0.5 shrink-0 text-ok" size={17} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Circle className="mt-0.5 shrink-0 text-dusk" size={17} strokeWidth={2} aria-hidden="true" />
                )}
                <div>
                  <p className={`font-semibold ${done[t.id] ? 'text-dusk line-through' : 'text-ink'}`}>
                    <span className="sr-only">{done[t.id] ? 'Done: ' : 'To do: '}</span>
                    {t.title}
                  </p>
                  {t.detail && <p className="mt-0.5 text-mist">{t.detail}</p>}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

export function Checklist({ tasks, done, onToggle, onReset }: RoadmapProps) {
  const reduce = useReducedMotion();
  const completed = tasks.filter((t) => done[t.id]).length;
  const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const groups = useMemo(() => MILESTONES.map((m) => ({ ...m, list: tasks.filter((t) => t.milestone === m.id) })).filter((g) => g.list.length), [tasks]);

  return (
    <section aria-labelledby="checklist-title" className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="checklist-title" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Step-by-step checklist
          </h2>
          <p className="mt-2 font-semibold text-gold-soft" aria-live="polite" data-testid="checklist-progress">
            {completed} of {tasks.length} tasks completed
          </p>
        </div>
        <button type="button" onClick={onReset} className="btn-ghost no-print px-4 py-2 text-sm" disabled={completed === 0}>
          <RotateCcw size={15} strokeWidth={2} aria-hidden="true" /> Clear ticks
        </button>
      </div>

      <div
        className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Checklist progress"
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #FFE08A, var(--accent-a))' }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {groups.map((g) => (
          <fieldset key={g.id} className="glass rounded-3xl p-5 sm:p-6">
            <legend className="sr-only">{g.title}</legend>
            <h3 className="font-display text-lg font-semibold" aria-hidden="true">
              {g.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {g.list.map((t) => {
                const checked = Boolean(done[t.id]);
                return (
                  <li key={t.id}>
                    <label className="flex cursor-pointer gap-3 rounded-2xl p-2 transition-colors hover:bg-white/[0.04]">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={checked}
                        onChange={(e) => onToggle(t.id, e.target.checked)}
                        aria-describedby={t.detail ? `task-${t.id}-detail` : undefined}
                      />
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold ${
                          checked ? 'border-gold bg-gold text-wine-900' : 'border-white/35'
                        }`}
                      >
                        {checked && <Check size={13} strokeWidth={3.2} />}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm font-semibold ${checked ? 'text-dusk line-through' : 'text-ink'}`}>{t.title}</span>
                        {t.detail && (
                          <span id={`task-${t.id}-detail`} className="mt-0.5 block text-sm text-mist">
                            {t.detail}
                          </span>
                        )}
                      </span>
                    </label>
                    {t.url && (
                      <a
                        href={t.url}
                        {...EXTERNAL}
                        className="ml-10 inline-flex items-center gap-1 text-xs font-semibold text-gold-soft underline underline-offset-2"
                      >
                        Official page <ExternalLink size={12} aria-hidden="true" />
                        <span className="sr-only">for {t.title} (opens in a new tab)</span>
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
