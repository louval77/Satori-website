import { Reveal } from '../components/Reveal';
import { SITE } from '../config';
import { RATES_DATE, RATES_SOURCE } from '../data/rates';
import { FACTOR_LABEL, WEIGHTS, type FactorKey } from '../lib/scoring';

const EXPLAIN: Record<FactorKey, string> = {
  language: 'Your IELTS, TOEFL, HSK or TOPIK result compared with the minimum each programme publishes.',
  budget: 'Published yearly tuition, converted to US dollars, compared with the budget you enter.',
  scholarship: 'Counts only if you need funding. Scholarships every admitted student gets rank highest.',
  academic: 'Your grades as a percentage. We have no admission statistics, so the rule is the same for every university.',
  timing: 'Whether an application window for your start year is open, ahead of you, or already closed.',
};

export function Method() {
  const keys = Object.keys(WEIGHTS) as FactorKey[];
  return (
    <section id="how" aria-labelledby="how-title" className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="how-title" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            A forecast you can check
          </h2>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-mist">
            The fit score is a forecast, not your chance of admission. No public data can predict an offer from these
            universities. It shows how closely your profile matches what each one publishes.
          </p>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-dusk">
            University facts were read on official websites on {SITE.dataCheckedOn}. Prices use {RATES_SOURCE} from{' '}
            {RATES_DATE}. Always confirm on the official page before you apply.
          </p>
        </Reveal>

        <ol className="space-y-3">
          {keys.map((k, i) => (
            <Reveal key={k} delay={i * 0.05} as="li" className="glass flex items-start gap-5 rounded-3xl p-5 sm:p-6">
                <span className="font-display text-4xl font-bold leading-none tabular-nums" style={{ color: 'var(--accent-a)' }}>
                  {WEIGHTS[k]}
                </span>
                <div>
                  <h3 className="font-semibold text-ink">
                    {FACTOR_LABEL[k]} <span className="text-sm font-medium text-dusk">({WEIGHTS[k]} points)</span>
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-mist">{EXPLAIN[k]}</p>
                </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
