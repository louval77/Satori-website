import { Check, FileText, Languages, Plane, Send, Wallet } from 'lucide-react';
import { FitRing } from '../components/FitRing';
import { Reveal } from '../components/Reveal';

const MINI_STEPS = [
  { icon: FileText, label: 'Documents' },
  { icon: Languages, label: 'Language tests' },
  { icon: Send, label: 'Applications' },
  { icon: Wallet, label: 'Scholarships' },
  { icon: Plane, label: 'Visa' },
];

/** "What you get": three real, miniature versions of the dashboard parts, clearly marked as examples. */
export function Features() {
  return (
    <section aria-labelledby="features-title" className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6">
      <Reveal>
        <h2 id="features-title" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          One route instead of fifty tabs
        </h2>
        <p className="mt-3 max-w-[60ch] text-mist">
          Your answers turn into three things you can act on today. Every figure links to the official page it came from.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_1fr] lg:grid-rows-2">
        <Reveal className="lg:row-span-2">
          <article className="glass glass-accent flex h-full flex-col rounded-3xl p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold">Top university matches</h3>
            <p className="mt-2 max-w-[48ch] text-mist">
              A fit forecast for each university, with the reasons behind it and what still stands between you and an offer.
            </p>
            <div className="mt-8 flex flex-1 flex-col justify-end gap-6 sm:flex-row sm:items-end">
              <FitRing score={82} size={132} label="example" />
              <ul className="flex-1 space-y-2.5 text-sm">
                {[
                  ['Language readiness', 35, 35],
                  ['Budget fit', 15, 25],
                  ['Scholarship support', 10, 15],
                  ['Academic record', 11, 15],
                  ['Timing', 10, 10],
                ].map(([label, pts, max]) => (
                  <li key={label as string} className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-2">
                    <span className="text-mist">{label}</span>
                    <span className="font-semibold tabular-nums text-ink">
                      {pts} / {max}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-5 text-xs text-dusk">Example breakdown. Your own numbers come from your answers.</p>
          </article>
        </Reveal>

        <Reveal delay={0.08}>
          <article
            className="glass relative h-full overflow-hidden rounded-3xl p-6 sm:p-7"
            style={{ background: 'linear-gradient(135deg, color-mix(in oklab, var(--accent-b) 22%, #3a0b1f), #2a0716 70%)' }}
          >
            <h3 className="font-display text-xl font-semibold">Action plan</h3>
            <p className="mt-2 text-sm text-mist">Five milestones with the real dates of your matches.</p>
            <ol className="mt-6 flex items-center justify-between gap-1">
              {MINI_STEPS.map(({ icon: Icon, label }, i) => (
                <li key={label} className="flex flex-1 items-center">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                      i < 2 ? 'border-gold bg-gold text-wine-900' : 'border-white/20 bg-wine-950/40 text-mist'
                    }`}
                    title={label}
                  >
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </span>
                  {i < MINI_STEPS.length - 1 && <span className={`mx-1 h-0.5 flex-1 ${i < 1 ? 'bg-gold' : 'bg-white/15'}`} />}
                </li>
              ))}
            </ol>
          </article>
        </Reveal>

        <Reveal delay={0.16}>
          <article className="glass h-full rounded-3xl p-6 sm:p-7">
            <h3 className="font-display text-xl font-semibold">Checklist that remembers</h3>
            <p className="mt-2 text-sm text-mist">Tick tasks as you go. Progress stays in this browser.</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                ['Request official transcripts', true],
                ['Book IELTS Academic', true],
                ['Check the Belt and Road Scholarship', false],
              ].map(([t, done]) => (
                <li key={t as string} className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      done ? 'border-gold bg-gold text-wine-900' : 'border-white/30'
                    }`}
                    aria-hidden="true"
                  >
                    {done ? <Check size={14} strokeWidth={3} /> : null}
                  </span>
                  <span className={done ? 'text-dusk line-through' : 'text-ink'}>{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-semibold text-gold-soft">Example: 2 of 3 tasks completed</p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
