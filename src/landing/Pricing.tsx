import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Crown } from 'lucide-react';
import { PRICING } from '../config';
import { UNIVERSITIES } from '../data/universities';
import { openProModal } from '../components/ProModal';
import { Reveal } from '../components/Reveal';
import { PAGES } from '../lib/links';
import { usePlan } from '../lib/plan';

type Billing = 'monthly' | 'yearly';

const FREE = [
  `Your top ${PRICING.freeMatches} university matches with reasons`,
  'Five-step action plan with real dates',
  'Checklist that saves your progress',
  'Official source link for every figure',
];
const PRO = [
  `Every matching university ranked (up to ${UNIVERSITIES.length})`,
  'Side-by-side comparison of cost, language and deadlines',
  'Everything in Free',
];

export function Pricing() {
  const [billing, setBilling] = useState<Billing>('yearly');
  const plan = usePlan();
  const yearlySaving = PRICING.monthly * 12 - PRICING.yearly;
  const perMonth = (PRICING.yearly / 12).toFixed(2);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6">
      <Reveal className="text-center">
        <h2 id="pricing-title" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Start free. Go Pro for the full list.
        </h2>
        <p className="mx-auto mt-3 max-w-[56ch] text-mist">
          Payments are not open yet: SATORI is a hackathon prototype and cannot charge you. Prices below are planned.
        </p>
      </Reveal>

      <Reveal className="mt-8 flex justify-center">
        <fieldset>
          <legend className="sr-only">Billing period</legend>
          <div className="flex rounded-full border border-white/10 bg-wine-950/50 p-1">
            {(['monthly', 'yearly'] as Billing[]).map((b) => (
              <label key={b} className={`relative cursor-pointer rounded-full px-5 py-2 text-sm font-semibold ${billing === b ? 'text-wine-900' : 'text-mist'}`}>
                <input type="radio" name="billing" value={b} checked={billing === b} onChange={() => setBilling(b)} className="peer sr-only" />
                {billing === b && (
                  <motion.span layoutId="billing-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="pointer-events-none absolute inset-0 rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold" />
                <span className="relative">{b === 'monthly' ? 'Monthly' : 'Yearly'}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </Reveal>

      <div className="mx-auto mt-8 grid max-w-3xl gap-5 md:grid-cols-2">
        <Reveal>
          <article className="glass flex h-full flex-col rounded-3xl p-7">
            <h3 className="font-display text-xl font-semibold">Free</h3>
            <p className="mt-3">
              <span className="font-display text-4xl font-bold">$0</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {FREE.map((f) => (
                <li key={f} className="flex gap-3 text-mist">
                  <Check className="mt-0.5 shrink-0 text-gold" size={16} strokeWidth={2.5} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <a href={PAGES.start} className="btn-ghost mt-8 px-5 py-3 text-sm">
              Build my route
            </a>
          </article>
        </Reveal>

        <Reveal delay={0.08}>
          <article className="glass glass-accent relative flex h-full flex-col rounded-3xl p-7">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Crown className="text-gold" size={20} strokeWidth={1.75} aria-hidden="true" /> Pro
            </h3>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold">${billing === 'yearly' ? PRICING.yearly : PRICING.monthly}</span>
              <span className="text-sm text-dusk">{billing === 'yearly' ? 'per year' : 'per month'}</span>
            </p>
            <p className="mt-1 min-h-10 text-sm font-semibold text-gold-soft">
              {billing === 'yearly' ? `About $${perMonth} a month, $${yearlySaving} less than paying monthly for a year.` : 'Planned monthly price.'}
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {PRO.map((f) => (
                <li key={f} className="flex gap-3 text-mist">
                  <Check className="mt-0.5 shrink-0 text-gold" size={16} strokeWidth={2.5} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => openProModal(billing)} className="btn-ghost mt-8 border-gold/60 px-5 py-3 text-sm text-gold-soft">
              {plan === 'pro' ? 'Pro is active' : 'Choose Pro'}
            </button>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
