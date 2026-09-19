import { AlertTriangle, CalendarClock, CheckCircle2, ExternalLink, GraduationCap, Languages, Wallet } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FitRing } from '../components/FitRing';
import { Flag } from '../components/Flag';
import { DESTINATIONS } from '../data/destinations';
import { formatMoney, formatUsd } from '../data/rates';
import { EXTERNAL } from '../lib/links';
import { FACTOR_LABEL, type Match, type WindowStatus } from '../lib/scoring';

const STATUS_LABEL: Record<WindowStatus, string> = {
  open: 'Applications open',
  upcoming: 'Next window ahead',
  closed: 'Window closed',
  unpublished: 'Dates not published yet',
};

function languageSummary(m: Match): string {
  const o = m.option;
  if (o.local) {
    const alt = o.eitherLanguage && o.english?.ielts ? ` or IELTS ${o.english.ielts}` : '';
    return `${o.local.test} ${o.local.level}${alt}`;
  }
  const e = o.english;
  if (!e) return 'English test: see guide';
  if (e.kind === 'unspecified') return 'English test, no published minimum';
  const parts = [e.ielts !== undefined ? `IELTS ${e.ielts}` : null, e.toefl6 !== undefined ? `TOEFL ${e.toefl6}` : e.toefl120 !== undefined ? `TOEFL ${e.toefl120}` : null].filter(Boolean);
  return `${parts.join(' / ')}${e.kind === 'typical' ? ' (typical)' : ' minimum'}`;
}

export function costSummary(m: Match): { main: string; sub: string } {
  const t = m.option.tuition;
  if (!t) {
    if (m.option.coveredForAll) return { main: 'Tuition fully waived', sub: m.option.tuitionNote ?? '' };
    return { main: 'Not published', sub: m.option.tuitionNote ?? 'See the official fee page' };
  }
  const local = `${formatMoney(t.amount, t.currency)} per ${t.per}`;
  return {
    main:
      m.tuitionUsdYear === null
        ? local
        : m.option.coveredForAll
          ? `about ${formatUsd(m.tuitionUsdYear)} a year, covered by scholarship`
          : `about ${formatUsd(m.tuitionUsdYear)} a year`,
    sub: `${local}. ${t.basis}.`,
  };
}

export function MatchCard({ match, rank, featured = false }: { match: Match; rank: number; featured?: boolean }) {
  const reduce = useReducedMotion();
  const u = match.university;
  const d = DESTINATIONS[u.destination];
  const cost = costSummary(match);
  const fundedAll = u.scholarships.find((s) => s.kind === 'automatic-all');

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: rank * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`glass ${featured ? 'glass-accent' : ''} flex h-full flex-col rounded-3xl p-5 sm:p-6`}
      aria-labelledby={`match-${u.id}`}
      data-testid="match-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm text-dusk">
            <span className="font-bold text-gold">#{rank}</span>
            <Flag id={u.destination} /> {u.city}, {d.name}
            <span className="ml-auto shrink-0 whitespace-nowrap rounded-full border border-gold/50 px-2.5 py-0.5 text-xs font-bold text-gold sm:hidden">
              {match.score}% fit forecast
            </span>
          </p>
          <h3 id={`match-${u.id}`} className={`mt-1.5 font-display font-bold leading-tight ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
            {u.name}
          </h3>
          <p className="mt-1.5 text-sm text-mist">{match.option.label}</p>
        </div>
        <div className="hidden sm:block" aria-hidden="true">
          <FitRing score={match.score} size={featured ? 104 : 84} label="fit forecast" />
        </div>
      </div>

      <dl className={`mt-5 grid gap-3 text-sm ${featured ? 'sm:grid-cols-3' : ''}`}>
        <div>
          <dt className="flex items-center gap-2 text-dusk">
            <Wallet className="shrink-0 text-gold" size={16} strokeWidth={1.75} aria-hidden="true" /> Estimated tuition
          </dt>
          <dd className="pl-6 font-semibold text-ink">{cost.main}</dd>
          {featured && <dd className="pl-6 text-xs text-dusk">{cost.sub}</dd>}
        </div>
        <div>
          <dt className="flex items-center gap-2 text-dusk">
            <Languages className="shrink-0 text-gold" size={16} strokeWidth={1.75} aria-hidden="true" /> Language requirement
          </dt>
          <dd className="pl-6 font-semibold text-ink">{languageSummary(match)}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-2 text-dusk">
            <CalendarClock className="shrink-0 text-gold" size={16} strokeWidth={1.75} aria-hidden="true" /> Application window
          </dt>
          <dd className="pl-6 font-semibold text-ink">{STATUS_LABEL[match.windowStatus]}</dd>
        </div>
      </dl>

      {fundedAll && (
        <p className="mt-4 flex gap-2 rounded-2xl border border-ok/30 bg-ok/[0.07] px-3 py-2 text-sm text-ink">
          <GraduationCap className="mt-0.5 shrink-0 text-ok" size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>
            <strong>{fundedAll.name}:</strong> {fundedAll.coverage}.
          </span>
        </p>
      )}

      <div className="mt-5">
        <h4 className="text-sm font-bold text-ink">Why this university fits your profile</h4>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(featured ? match.reasons : match.reasons.slice(0, 2)).map((r) => (
            <li key={r} className="flex gap-2 text-mist">
              <CheckCircle2 className="mt-0.5 shrink-0 text-ok" size={15} strokeWidth={2} aria-hidden="true" />
              {r}
            </li>
          ))}
          {match.reasons.length === 0 && <li className="text-mist">Few factors match strongly yet; see what to work on below.</li>}
        </ul>
      </div>

      {match.gaps.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-bold text-ink">What to work on</h4>
          <ul className="mt-2 space-y-1.5 text-sm">
            {(featured ? match.gaps : match.gaps.slice(0, 2)).map((g) => (
              <li key={g} className="flex gap-2 text-mist">
                <AlertTriangle className="mt-0.5 shrink-0 text-gold" size={15} strokeWidth={2} aria-hidden="true" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      <details open={featured} className="group mt-5 rounded-2xl border border-white/10 bg-wine-950/30 px-4 py-3">
        <summary className="cursor-pointer list-none rounded-lg text-sm font-semibold text-gold-soft [&::-webkit-details-marker]:hidden">
          Score breakdown and sources
        </summary>
        <ul className="mt-3 space-y-2.5 text-sm">
          {match.factors.map((f) => (
            <li key={f.key}>
              <div className="flex justify-between gap-3">
                <span className="text-mist">{FACTOR_LABEL[f.key]}</span>
                <span className="font-semibold tabular-nums">
                  {f.points} / {f.max}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                <div className="h-full rounded-full bg-gold" style={{ width: `${(f.points / f.max) * 100}%` }} />
              </div>
              <p className="mt-1 text-xs text-dusk">{f.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-dusk">{match.windowText}</p>
        {u.living && <p className="mt-2 text-xs text-dusk">{u.living.text}</p>}
        {u.requirements?.map((r) => (
          <p key={r} className="mt-2 text-xs text-dusk">
            {r}
          </p>
        ))}
        {u.note && <p className="mt-2 text-xs text-dusk">{u.note}</p>}
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold">
          <li>
            <a href={u.admissionsUrl} {...EXTERNAL} className="inline-flex items-center gap-1 text-gold-soft underline underline-offset-2">
              Admissions page <ExternalLink size={12} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={match.option.tuitionSourceUrl} {...EXTERNAL} className="inline-flex items-center gap-1 text-gold-soft underline underline-offset-2">
              Fee source <ExternalLink size={12} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          {(match.option.english?.sourceUrl ?? match.option.local?.sourceUrl) && (
            <li>
              <a
                href={(match.option.local?.sourceUrl ?? match.option.english?.sourceUrl)!}
                {...EXTERNAL}
                className="inline-flex items-center gap-1 text-gold-soft underline underline-offset-2"
              >
                Language source <ExternalLink size={12} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          )}
          <li>
            <a href={u.windowsSourceUrl} {...EXTERNAL} className="inline-flex items-center gap-1 text-gold-soft underline underline-offset-2">
              Dates source <ExternalLink size={12} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </details>
    </motion.article>
  );
}
