import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Crown, Info, Lock, Pencil, Printer, Trash2 } from 'lucide-react';
import { PRICING, SITE } from '../config';
import { DESTINATIONS } from '../data/destinations';
import { formatUsd, RATES_DATE } from '../data/rates';
import { UNIVERSITIES } from '../data/universities';
import { openProModal } from '../components/ProModal';
import { Flag } from '../components/Flag';
import { FIELD_LABEL, HOUSING_PREFERENCE_LABEL, type Profile } from '../lib/profile';
import { buildTasks } from '../lib/roadmap';
import { hiddenByLanguage, rankUniversities, type Match } from '../lib/scoring';
import { usePlan } from '../lib/plan';
import { KEYS, readJson, writeJson } from '../lib/storage';
import { MatchCard, costSummary } from './MatchCard';
import { Checklist, Timeline } from './Roadmap';

interface DashboardProps {
  profile: Profile;
  onEdit: () => void;
  onStartOver: () => void;
}

const WINDOW_SHORT = { open: 'Open', upcoming: 'Ahead', closed: 'Closed', unpublished: 'Not published' } as const;

function CompareTable({ matches }: { matches: Match[] }) {
  return (
    <div className="glass mt-5 overflow-x-auto rounded-3xl" data-testid="compare-table">
      <table className="w-full min-w-[880px] text-left text-sm">
        <caption className="sr-only">All matching universities compared</caption>
        <thead>
          <tr className="border-b border-white/10 text-dusk">
            <th scope="col" className="px-5 py-3.5 font-semibold">Rank</th>
            <th scope="col" className="px-3 py-3.5 font-semibold">University</th>
            <th scope="col" className="px-3 py-3.5 font-semibold">Fit</th>
            <th scope="col" className="px-3 py-3.5 font-semibold">Tuition per year</th>
            <th scope="col" className="px-3 py-3.5 font-semibold">Teaching</th>
            <th scope="col" className="px-3 py-3.5 font-semibold">Window</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Housing</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m, i) => (
            <tr key={m.university.id} className="border-b border-white/[0.05] last:border-0">
              <td className="px-5 py-3 font-bold text-gold">#{i + 1}</td>
              <th scope="row" className="px-3 py-3 font-semibold text-ink">
                <span className="flex items-center gap-2">
                  <Flag id={m.university.destination} />
                  <a href={m.university.admissionsUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                    {m.university.shortName}
                    <span className="sr-only"> admissions page (opens in a new tab)</span>
                  </a>
                </span>
              </th>
              <td className="px-3 py-3 font-semibold tabular-nums">{m.score}%</td>
              <td className="px-3 py-3 text-mist">{costSummary(m).main}</td>
              <td className="px-3 py-3 text-mist">{m.option.teaching}</td>
              <td className="px-3 py-3 text-mist">{WINDOW_SHORT[m.windowStatus]}</td>
              <td className="px-5 py-3 text-mist">{m.housing?.summary ?? 'Not published'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Dashboard({ profile, onEdit, onStartOver }: DashboardProps) {
  const reduce = useReducedMotion();
  const plan = usePlan();
  const matches = useMemo(() => rankUniversities(profile), [profile]);
  const top = useMemo(() => matches.slice(0, PRICING.freeMatches), [matches]);
  const rest = matches.slice(PRICING.freeMatches);
  const hidden = useMemo(() => hiddenByLanguage(profile), [profile]);
  const tasks = useMemo(() => buildTasks(profile, top), [profile, top]);
  const [done, setDone] = useState<Record<string, boolean>>(() => readJson<Record<string, boolean>>(KEYS.checklist) ?? {});
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    document.title = 'Your admission route | SATORI';
    return () => {
      document.title = 'Personal Admission Route | SATORI';
    };
  }, []);

  const toggle = useCallback((id: string, value: boolean) => {
    setDone((prev) => {
      const next = { ...prev, [id]: value };
      if (!value) delete next[id];
      writeJson(KEYS.checklist, next);
      return next;
    });
  }, []);

  const clearTicks = useCallback(() => {
    setDone({});
    writeJson(KEYS.checklist, {});
  }, []);

  const summary = [
    FIELD_LABEL[profile.field] + (profile.focus ? `: ${profile.focus}` : ''),
    `Budget ${formatUsd(profile.budgetUsd)} a year`,
    `Start ${profile.targetYear}`,
    profile.teaching === 'open' ? 'Any teaching language' : 'English-taught only',
    `Housing: ${HOUSING_PREFERENCE_LABEL[profile.housing ?? 'unsure'].toLowerCase()}`,
  ];

  return (
    <main id="main" className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:py-12 print-dark-text">
      <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Your admission route</h1>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm" aria-label="Your answers">
              {profile.destinations.map((d) => (
                <li key={d} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-mist">
                  <Flag id={d} /> {DESTINATIONS[d].short}
                </li>
              ))}
              {summary.map((s) => (
                <li key={s} className="rounded-full border border-white/15 px-3 py-1 text-mist">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <button type="button" onClick={onEdit} className="btn-ghost px-4 py-2 text-sm">
              <Pencil size={15} strokeWidth={2} aria-hidden="true" /> Edit answers
            </button>
            <button type="button" onClick={() => window.print()} className="btn-ghost px-4 py-2 text-sm">
              <Printer size={15} strokeWidth={2} aria-hidden="true" /> Print or save PDF
            </button>
            {confirmReset ? (
              <span className="flex items-center gap-2 rounded-full border border-danger/50 px-2 py-1">
                <span className="pl-2 text-sm text-ink">Delete your answers and ticks?</span>
                <button type="button" onClick={onStartOver} className="rounded-full bg-danger px-3 py-1 text-sm font-bold text-wine-900">
                  Delete
                </button>
                <button type="button" onClick={() => setConfirmReset(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-mist hover:text-ink">
                  Cancel
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmReset(true)} className="btn-ghost px-4 py-2 text-sm">
                <Trash2 size={15} strokeWidth={2} aria-hidden="true" /> Start over
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 flex gap-3 rounded-2xl border border-white/10 bg-wine-950/40 px-4 py-3 text-sm text-mist">
          <Info className="mt-0.5 shrink-0 text-gold" size={17} strokeWidth={1.75} aria-hidden="true" />
          <span>
            Fit scores are a forecast of how well your profile matches published requirements. They are not a chance of
            admission. Facts checked on {SITE.dataCheckedOn}; dollar amounts use rates from {RATES_DATE}. Confirm everything
            on the official pages linked in each card.
          </span>
        </p>
      </motion.div>

      {/* Matches */}
      <section aria-labelledby="matches-title" className="mt-12">
        <h2 id="matches-title" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {top.length > 1 ? `Your top ${top.length} matches` : top.length === 1 ? 'Your match' : 'No matches yet'}
        </h2>

        {top.length === 0 ? (
          <div className="glass mt-5 rounded-3xl p-7">
            <p className="text-mist">
              None of the universities in our list teach this field in your chosen destinations with the teaching language you
              picked.
            </p>
            <button type="button" onClick={onEdit} className="btn-primary mt-5 px-5 py-2.5 text-sm">
              <Pencil size={15} strokeWidth={2} aria-hidden="true" /> Edit answers
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
            <MatchCard match={top[0]!} rank={1} featured />
            {top.length > 1 && (
              <div className="grid gap-5">
                {top.slice(1).map((m, i) => (
                  <MatchCard key={m.university.id} match={m} rank={i + 2} />
                ))}
              </div>
            )}
          </div>
        )}

        {hidden.length > 0 && (
          <p className="mt-5 text-sm text-dusk">
            Not shown because they teach this field in Chinese or Korean: {hidden.map((u) => u.shortName).join(', ')}. Choose
            &quot;Also Chinese- or Korean-taught&quot; in your answers to include them.
          </p>
        )}
      </section>

      {/* Pro: everything else */}
      {(rest.length > 0 || plan === 'pro') && top.length > 0 && (
        <section aria-labelledby="more-title" className="mt-12">
          <h2 id="more-title" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
            <Crown className="text-gold" size={22} strokeWidth={1.75} aria-hidden="true" />
            {plan === 'pro' ? 'All your matches compared' : `${rest.length} more ${rest.length === 1 ? 'match' : 'matches'} with Pro`}
          </h2>
          {plan === 'pro' ? (
            <CompareTable matches={matches} />
          ) : (
            <div className="glass mt-5 flex flex-col items-start gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <Lock className="mt-1 shrink-0 text-gold" size={22} strokeWidth={1.75} aria-hidden="true" />
                <p className="max-w-[56ch] text-mist">
                  Free shows your top {PRICING.freeMatches}. Pro ranks all {rest.length + top.length} universities that fit your
                  answers (out of {UNIVERSITIES.length} in our list) and compares cost, teaching language, application windows and
                  dorms side by side.
                </p>
              </div>
              <button type="button" onClick={() => openProModal('yearly')} className="btn-ghost shrink-0 border-gold/60 px-5 py-2.5 text-sm text-gold-soft">
                See Pro
              </button>
            </div>
          )}
        </section>
      )}

      {top.length > 0 && (
        <>
          <Timeline tasks={tasks} done={done} />
          <Checklist tasks={tasks} done={done} onToggle={toggle} onReset={clearTicks} />
        </>
      )}
    </main>
  );
}
