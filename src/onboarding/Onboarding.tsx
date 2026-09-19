import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Cpu, Sparkles } from 'lucide-react';
import { Mascot, type MascotMood } from '../components/Mascot';
import { Flag } from '../components/Flag';
import { useDestination } from '../context/destination';
import { DESTINATIONS, DESTINATION_ORDER, type DestinationId } from '../data/destinations';
import { UNIVERSITIES } from '../data/universities';
import { BUDGET, ENGLISH_LIMITS, FIELD_LABEL, FOCUS_OPTIONS, GPA_LIMITS, type EnglishTest, type GpaScale, type Profile } from '../lib/profile';
import { useMediaQuery } from '../lib/useMediaQuery';
import { trackEvent } from '../lib/analytics';
import { PAGES } from '../lib/links';
import { ChoiceCard, Chip, FieldError, Label } from './controls';
import { STEPS, draftFromProfile, parseNumber, toProfile, validateStep, type Draft, type Errors } from './validation';

interface OnboardingProps {
  initial: Profile | null;
  onComplete: (p: Profile) => void;
}

const INTRO: string[] = [
  "Hi, I'm Tori! Where would you love to study? Pick one place or several.",
  "Let's build your dream profile together! What's your focus?",
  'Now your grades and tests. Only the average grade is required.',
  "Let's talk budget. I'll point out scholarships that could help.",
  'Last one! When would you like to start?',
];

export function Onboarding({ initial, onComplete }: OnboardingProps) {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { setDest } = useDestination();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [draft, setDraft] = useState<Draft>(() => draftFromProfile(initial));
  const [errors, setErrors] = useState<Errors>({});
  const [mascot, setMascot] = useState<{ message: string; mood: MascotMood; pulse: number }>({ message: INTRO[0]!, mood: 'idle', pulse: 0 });
  const [generating, setGenerating] = useState(false);
  const firstRender = useRef(true);
  const focusHeading = useRef(true);
  // Each step heading receives focus when it appears (after the exit animation of the previous step).
  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && focusHeading.current) {
      focusHeading.current = false;
      el.focus({ preventScroll: true });
    }
  }, []);

  const say = (message: string, mood: MascotMood, bounce = true) =>
    setMascot((m) => ({ message, mood, pulse: bounce ? m.pulse + 1 : m.pulse }));

  // On every step change: queue focus for the new heading, scroll up and let Tori introduce the step.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    focusHeading.current = true;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    say(INTRO[step]!, step === 1 ? 'think' : 'idle', false);
  }, [step]);

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const showHsk = draft.teaching === 'open' && draft.destinations.includes('CN');
  const showTopik = draft.teaching === 'open' && draft.destinations.includes('KR');

  function cheerIfValid(key: 'gpa' | 'englishScore' | 'sat') {
    const e = validateStep(2, draft);
    if (!e[key] && draft[key].trim()) say("You're doing great! Keep it up! 🌟", 'happy');
  }

  function next(e: FormEvent) {
    e.preventDefault();
    const found = validateStep(step, draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      say('Almost there! One answer needs a quick fix.', 'oops');
      // Focus the first field with a problem.
      const firstKey = Object.keys(found)[0];
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
        (el?.querySelector<HTMLElement>('input, select, textarea') ?? el)?.focus();
      });
      return;
    }
    setErrors({});
    if (step < STEPS.length - 1) {
      setDir(1);
      setStep((s) => s + 1);
      return;
    }
    // Finished: short, honest "working" moment, then show the roadmap.
    const profile = toProfile(draft);
    setGenerating(true);
    say('All set! Generating your personalized admission roadmap now...', 'cheer');
    trackEvent('roadmap-generated');
    window.setTimeout(() => onComplete(profile), reduce ? 250 : 1400);
  }

  function back() {
    setErrors({});
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  }

  const eligibleCount = useMemo(
    () => UNIVERSITIES.filter((u) => draft.destinations.includes(u.destination) && (!draft.field || u.programs[draft.field])).length,
    [draft.destinations, draft.field],
  );

  const errId = (k: keyof Draft) => `err-${k}`;
  const invalid = (k: keyof Draft) => (errors[k] ? 'true' : 'false');

  return (
    <main id="main" className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {isDesktop ? (
          <aside className="sticky top-28 self-start" aria-label="Guide">
            <Mascot {...mascot} layout="stack" />
          </aside>
        ) : null}

        <div className="min-w-0">
          {!isDesktop && (
            <div className="mb-5">
              <Mascot {...mascot} layout="inline" />
            </div>
          )}

          {/* Progress */}
          <nav aria-label="Questionnaire progress" className="mb-5">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-semibold sm:text-sm">
              {STEPS.map((label, i) => (
                <li key={label} aria-current={i === step ? 'step' : undefined} className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                      i < step ? 'border-gold bg-gold text-wine-900' : i === step ? 'border-gold text-gold' : 'border-white/20 text-dusk'
                    }`}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className={i === step ? 'text-ink' : 'hidden text-dusk sm:inline'}>{label}</span>
                  {i < STEPS.length - 1 && <span className="hidden h-px w-5 bg-white/15 sm:block" aria-hidden="true" />}
                </li>
              ))}
            </ol>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #FFE08A, var(--accent-a))' }}
                animate={{ width: `${((step + (generating ? 1 : 0)) / STEPS.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
            <p className="sr-only">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </p>
          </nav>

          <form onSubmit={next} noValidate className="glass rounded-3xl p-5 sm:p-8" aria-labelledby="step-title">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 28 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -28 * dir }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 id="step-title" ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold tracking-tight outline-none sm:text-3xl">
                  {['Where do you want to study?', 'What do you want to study?', 'Your grades and tests', 'Budget and funding', 'When do you want to start?'][step]}
                </h1>

                {/* Step 1: destinations and teaching language */}
                {step === 0 && (
                  <div className="mt-6 space-y-7">
                    <fieldset data-field="destinations" aria-describedby={errors.destinations ? errId('destinations') : undefined}>
                      <legend className="mb-3 text-sm font-bold text-ink">Destinations (choose one or more)</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {DESTINATION_ORDER.map((id) => {
                          const d = DESTINATIONS[id];
                          const checked = draft.destinations.includes(id);
                          return (
                            <ChoiceCard
                              key={id}
                              type="checkbox"
                              name="destinations"
                              value={id}
                              checked={checked}
                              onChange={(on) => {
                                const next: DestinationId[] = on ? [...draft.destinations, id] : draft.destinations.filter((x) => x !== id);
                                update('destinations', next);
                                if (on) {
                                  setDest(id);
                                  say(`${d.short}, great pick! Add more places if you like.`, 'happy');
                                }
                              }}
                              icon={<Flag id={id} className="h-4 w-[22px]" />}
                              title={d.name}
                              description={d.teachingNote}
                            />
                          );
                        })}
                      </div>
                      <FieldError id={errId('destinations')} message={errors.destinations} />
                    </fieldset>

                    <fieldset>
                      <legend className="mb-3 text-sm font-bold text-ink">Teaching language</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <ChoiceCard
                          type="radio"
                          name="teaching"
                          value="english-only"
                          checked={draft.teaching === 'english-only'}
                          onChange={() => update('teaching', 'english-only')}
                          title="English-taught only"
                          description="Includes Kyoto iUP, which adds Japanese lessons from the start."
                        />
                        <ChoiceCard
                          type="radio"
                          name="teaching"
                          value="open"
                          checked={draft.teaching === 'open'}
                          onChange={() => update('teaching', 'open')}
                          title="Also Chinese- or Korean-taught"
                          description="Adds programmes that need HSK or TOPIK."
                        />
                      </div>
                    </fieldset>
                  </div>
                )}

                {/* Step 2: field and focus */}
                {step === 1 && (
                  <div className="mt-6 space-y-7">
                    <fieldset data-field="field" aria-describedby={errors.field ? errId('field') : undefined}>
                      <legend className="mb-3 text-sm font-bold text-ink">Field</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(['engineering', 'business'] as const).map((f) => (
                          <ChoiceCard
                            key={f}
                            type="radio"
                            name="field"
                            value={f}
                            checked={draft.field === f}
                            onFocus={() => mascot.message !== INTRO[1] && say(INTRO[1]!, 'think', false)}
                            onChange={() => {
                              setDraft((d) => ({ ...d, field: f, focus: FOCUS_OPTIONS[f].includes(d.focus) ? d.focus : '' }));
                              setErrors((e) => ({ ...e, field: undefined }));
                              say("Excellent choice! Let's find where it fits best.", 'cheer');
                            }}
                            icon={
                              f === 'engineering' ? (
                                <Cpu className="text-gold" size={22} strokeWidth={1.75} aria-hidden="true" />
                              ) : (
                                <BriefcaseBusiness className="text-gold" size={22} strokeWidth={1.75} aria-hidden="true" />
                              )
                            }
                            title={FIELD_LABEL[f]}
                            description={FOCUS_OPTIONS[f].join(', ')}
                          />
                        ))}
                      </div>
                      <FieldError id={errId('field')} message={errors.field} />
                    </fieldset>

                    {draft.field && (
                      <fieldset data-field="focus" aria-describedby={errors.focus ? errId('focus') : undefined}>
                        <legend className="mb-3 text-sm font-bold text-ink">Focus area</legend>
                        <div className="flex flex-wrap gap-2">
                          {FOCUS_OPTIONS[draft.field].map((f) => (
                            <Chip key={f} name="focus" value={f} checked={draft.focus === f} onChange={() => update('focus', f)}>
                              {f}
                            </Chip>
                          ))}
                        </div>
                        <FieldError id={errId('focus')} message={errors.focus} />
                      </fieldset>
                    )}
                    <p className="text-sm text-dusk">
                      {eligibleCount} {eligibleCount === 1 ? 'university offers' : 'universities offer'} this field in your chosen
                      destinations.
                    </p>
                  </div>
                )}

                {/* Step 3: grades and tests */}
                {step === 2 && (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="gpaScale">Grading scale</Label>
                      <select
                        id="gpaScale"
                        className="field-input"
                        value={draft.gpaScale}
                        onChange={(e) => update('gpaScale', e.target.value as GpaScale)}
                      >
                        {(Object.keys(GPA_LIMITS) as GpaScale[]).map((s) => (
                          <option key={s} value={s}>
                            {GPA_LIMITS[s].label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div data-field="gpa">
                      <Label htmlFor="gpa">Average grade</Label>
                      <input
                        id="gpa"
                        className="field-input"
                        inputMode="decimal"
                        autoComplete="off"
                        value={draft.gpa}
                        onChange={(e) => update('gpa', e.target.value)}
                        onBlur={() => cheerIfValid('gpa')}
                        aria-invalid={invalid('gpa')}
                        aria-describedby={`gpa-help${errors.gpa ? ` ${errId('gpa')}` : ''}`}
                        placeholder={draft.gpaScale === '100' ? 'e.g. 91' : draft.gpaScale === '4' ? 'e.g. 3.7' : 'e.g. 4.6'}
                        required
                      />
                      <p id="gpa-help" className="mt-1.5 text-xs text-dusk">
                        From {GPA_LIMITS[draft.gpaScale].min} to {GPA_LIMITS[draft.gpaScale].max}.
                      </p>
                      <FieldError id={errId('gpa')} message={errors.gpa} />
                    </div>

                    <div>
                      <Label htmlFor="englishTest">English test</Label>
                      <select
                        id="englishTest"
                        className="field-input"
                        value={draft.englishTest}
                        onChange={(e) => {
                          update('englishTest', e.target.value as EnglishTest);
                          update('englishScore', '');
                        }}
                      >
                        <option value="none">No test yet</option>
                        {(Object.keys(ENGLISH_LIMITS) as Exclude<EnglishTest, 'none'>[]).map((t) => (
                          <option key={t} value={t}>
                            {ENGLISH_LIMITS[t].label}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1.5 text-xs text-dusk">TOEFL tests taken from 21 January 2026 use the 1 to 6 scale.</p>
                    </div>
                    {draft.englishTest !== 'none' ? (
                      <div data-field="englishScore">
                        <Label htmlFor="englishScore">English score</Label>
                        <input
                          id="englishScore"
                          className="field-input"
                          inputMode="decimal"
                          autoComplete="off"
                          value={draft.englishScore}
                          onChange={(e) => update('englishScore', e.target.value)}
                          onBlur={() => cheerIfValid('englishScore')}
                          aria-invalid={invalid('englishScore')}
                          aria-describedby={errors.englishScore ? errId('englishScore') : undefined}
                          placeholder={draft.englishTest === 'ielts' ? 'e.g. 6.5' : draft.englishTest === 'toefl120' ? 'e.g. 90' : 'e.g. 4.5'}
                          required
                        />
                        <FieldError id={errId('englishScore')} message={errors.englishScore} />
                      </div>
                    ) : (
                      <p className="self-end text-sm text-dusk sm:pb-3">No problem. Your route will include booking a test.</p>
                    )}

                    <div data-field="sat">
                      <Label htmlFor="sat" optional>
                        SAT total
                      </Label>
                      <input
                        id="sat"
                        className="field-input"
                        inputMode="numeric"
                        autoComplete="off"
                        value={draft.sat}
                        onChange={(e) => update('sat', e.target.value)}
                        onBlur={() => cheerIfValid('sat')}
                        aria-invalid={invalid('sat')}
                        aria-describedby={errors.sat ? errId('sat') : undefined}
                        placeholder="e.g. 1420"
                      />
                      <FieldError id={errId('sat')} message={errors.sat} />
                    </div>

                    {showHsk && (
                      <div>
                        <Label htmlFor="hsk">HSK level (Chinese)</Label>
                        <select id="hsk" className="field-input" value={draft.hsk} onChange={(e) => update('hsk', e.target.value)}>
                          <option value="0">No HSK yet</option>
                          {[1, 2, 3, 4, 5, 6].map((l) => (
                            <option key={l} value={String(l)}>
                              HSK {l}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {showTopik && (
                      <div>
                        <Label htmlFor="topik">TOPIK level (Korean)</Label>
                        <select id="topik" className="field-input" value={draft.topik} onChange={(e) => update('topik', e.target.value)}>
                          <option value="0">No TOPIK yet</option>
                          {[1, 2, 3, 4, 5, 6].map((l) => (
                            <option key={l} value={String(l)}>
                              TOPIK {l}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: budget */}
                {step === 3 && (
                  <div className="mt-6 space-y-7">
                    <div>
                      <Label htmlFor="budget">Tuition budget per year (US dollars)</Label>
                      <div className="flex items-center gap-4">
                        <input
                          id="budget"
                          type="range"
                          className="range"
                          min={BUDGET.min}
                          max={BUDGET.max}
                          step={BUDGET.step}
                          value={draft.budgetUsd}
                          onChange={(e) => update('budgetUsd', Number(e.target.value))}
                          aria-valuetext={`${draft.budgetUsd.toLocaleString('en-US')} US dollars per year`}
                          aria-describedby="budget-help"
                        />
                        <output htmlFor="budget" className="w-28 shrink-0 text-right font-display text-2xl font-bold tabular-nums">
                          ${draft.budgetUsd.toLocaleString('en-US')}
                        </output>
                      </div>
                      <p id="budget-help" className="mt-2 text-sm text-dusk">
                        Tuition only. Housing and living costs come on top; each university card shows its own estimate when one
                        is published.
                      </p>
                    </div>

                    <fieldset data-field="scholarship" aria-describedby={errors.scholarship ? errId('scholarship') : undefined}>
                      <legend className="mb-3 text-sm font-bold text-ink">Do you need a scholarship to study abroad?</legend>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {(
                          [
                            ['yes', 'Yes, I need one'],
                            ['maybe', 'It would help'],
                            ['no', 'No, we can pay'],
                          ] as const
                        ).map(([v, t]) => (
                          <ChoiceCard
                            key={v}
                            type="radio"
                            name="scholarship"
                            value={v}
                            checked={draft.scholarship === v}
                            onChange={() => {
                              update('scholarship', v);
                              say(v === 'no' ? 'Got it. I will focus on fit and dates.' : 'Noted! I will rank scholarships higher for you.', 'happy');
                            }}
                            title={t}
                          />
                        ))}
                      </div>
                      <FieldError id={errId('scholarship')} message={errors.scholarship} />
                    </fieldset>
                  </div>
                )}

                {/* Step 5: start date and review */}
                {step === 4 && (
                  <div className="mt-6 space-y-7">
                    <fieldset data-field="targetYear" aria-describedby={errors.targetYear ? errId('targetYear') : undefined}>
                      <legend className="mb-3 text-sm font-bold text-ink">Start year</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <ChoiceCard
                          type="radio"
                          name="targetYear"
                          value="2027"
                          checked={draft.targetYear === '2027'}
                          onChange={() => update('targetYear', '2027')}
                          title="2027"
                          description="Many applications for 2027 open between August 2026 and January 2027."
                        />
                        <ChoiceCard
                          type="radio"
                          name="targetYear"
                          value="2028"
                          checked={draft.targetYear === '2028'}
                          onChange={() => update('targetYear', '2028')}
                          title="2028"
                          description="More time for tests. Most 2028 dates are not published yet."
                        />
                      </div>
                      <FieldError id={errId('targetYear')} message={errors.targetYear} />
                    </fieldset>

                    <div className="rounded-3xl border border-white/10 bg-wine-950/35 p-5">
                      <h2 className="text-sm font-bold text-ink">Your answers</h2>
                      <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                        <div className="flex gap-2">
                          <dt className="text-dusk">Destinations:</dt>
                          <dd>{draft.destinations.map((d) => DESTINATIONS[d].short).join(', ')}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-dusk">Field:</dt>
                          <dd>
                            {draft.field ? FIELD_LABEL[draft.field] : ''}, {draft.focus}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-dusk">Grade:</dt>
                          <dd>
                            {parseNumber(draft.gpa)} ({GPA_LIMITS[draft.gpaScale].label})
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-dusk">English:</dt>
                          <dd>{draft.englishTest === 'none' ? 'No test yet' : `${ENGLISH_LIMITS[draft.englishTest].label.split(',')[0]} ${draft.englishScore}`}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-dusk">Budget:</dt>
                          <dd>${draft.budgetUsd.toLocaleString('en-US')} a year</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-dusk">Teaching:</dt>
                          <dd>{draft.teaching === 'open' ? 'Any language' : 'English only'}</dd>
                        </div>
                      </dl>
                    </div>
                    <p className="text-sm text-dusk">
                      Your answers are saved only in this browser, never sent to us. See the{' '}
                      <a className="font-semibold text-gold-soft underline underline-offset-2" href={PAGES.privacy}>
                        privacy policy
                      </a>
                      .
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
              {step > 0 ? (
                <button type="button" onClick={back} className="btn-ghost px-5 py-3 text-sm" disabled={generating}>
                  <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> Back
                </button>
              ) : (
                <a href={PAGES.home} className="btn-ghost px-5 py-3 text-sm">
                  <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> Home
                </a>
              )}
              <button type="submit" className="btn-primary px-6 py-3 text-sm" disabled={generating}>
                {step === STEPS.length - 1 ? (
                  <>
                    {generating ? 'Building your route' : 'Build my route'}
                    <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Continue <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
