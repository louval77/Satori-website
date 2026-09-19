import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SITE } from '../config';
import { PAGES } from '../lib/links';

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: 'Is the fit score my chance of getting in?',
    a: 'No. It is a forecast of how well your profile matches what each university publishes about language, cost, scholarships and dates. Admission decisions depend on many things we cannot see, such as essays, interviews and the other applicants.',
  },
  {
    q: 'Where does the university information come from?',
    a: `From the universities' and governments' official websites, read on ${SITE.dataCheckedOn}. Each figure on your dashboard links to its source. Fees and dates change every year, so confirm on the official page before you apply.`,
  },
  {
    q: 'Will I get a place in a dormitory?',
    a: 'It depends on the university. Some guarantee a room in the first year (for example HKUST, APU and Kyoto iUP), others give priority or have limited places. Each university card shows its housing rules, the published cost and a link to its housing page, and your checklist tells you when to apply for a room.',
  },
  {
    q: 'Do you store my answers?',
    a: (
      <>
        Only in your own browser, so you can come back to your route. We have no accounts and no database, and your answers are
        never sent to us. The "Start over" button on your dashboard deletes them. Details are in the{' '}
        <a className="font-semibold text-gold-soft underline underline-offset-2" href={PAGES.privacy}>
          privacy policy
        </a>
        .
      </>
    ),
  },
  {
    q: 'Can I buy Pro?',
    a: 'Not yet. SATORI is a hackathon prototype, so payments are switched off and we never ask for card details. The prices shown are the planned prices.',
  },
  {
    q: 'I am under 18. Can I use SATORI?',
    a: 'Yes. We collect no personal data, so you can use the free route safely. Please plan your applications together with a parent or guardian. If paid plans launch later, a parent or guardian will need to buy them for anyone under 18.',
  },
  {
    q: 'Are you connected to these universities?',
    a: 'No. SATORI is an independent student project. University names are used only to identify them, and we receive nothing from any university for being listed.',
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Reveal>
        <h2 id="faq-title" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Questions, answered honestly
        </h2>
      </Reveal>
      <div className="mt-8 space-y-3">
        {FAQ.map((item, i) => (
          <Reveal key={item.q} delay={i * 0.04}>
            <details className="glass group rounded-3xl px-5 py-4 open:pb-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="shrink-0 text-gold transition-transform group-open:rotate-180" size={20} strokeWidth={2} aria-hidden="true" />
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-mist">{item.a}</div>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6">
      <Reveal>
        <div
          className="glass glass-accent flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:p-10 md:flex-row md:items-center"
          style={{ background: 'linear-gradient(120deg, color-mix(in oklab, var(--accent-b) 20%, #3a0b1f), #2a0716 65%)' }}
        >
          <div>
            <h2 id="final-title" className="font-display text-2xl font-bold sm:text-3xl">
              Five questions. One clear route.
            </h2>
            <p className="mt-2 text-mist">No account, no email, nothing to install.</p>
          </div>
          <a href={PAGES.start} className="btn-primary px-7 py-3.5 text-base">
            Build my route
          </a>
        </div>
      </Reveal>
    </section>
  );
}
