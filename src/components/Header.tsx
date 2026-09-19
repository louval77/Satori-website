import { ArrowRight, Crown } from 'lucide-react';
import { PAGES } from '../lib/links';
import { usePlan } from '../lib/plan';
import { trackEvent } from '../lib/analytics';
import { DestinationSwitcher } from './DestinationSwitcher';
import { Logo } from './Logo';

interface HeaderProps {
  /** Landing page shows in-page section links. */
  showSectionLinks?: boolean;
  /** Hide the call to action while the questionnaire is open. */
  hideCta?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

const SECTION_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export function Header({ showSectionLinks = false, hideCta = false, ctaLabel = 'Build my route', ctaHref = PAGES.start }: HeaderProps) {
  const plan = usePlan();
  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          // The app uses the URL hash for its views, so move focus without changing the hash.
          e.preventDefault();
          const main = document.getElementById('main');
          if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus();
          }
        }}
        className="sr-only-focusable fixed left-4 top-3 z-50 rounded-full bg-gold px-4 py-2 text-sm font-bold text-wine-900"
      >
        Skip to main content
      </a>
      <header className="no-print sticky top-0 z-40 border-b border-white/[0.06] bg-wine-900/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6">
          <a href={PAGES.home} className="shrink-0 rounded-xl" aria-label="SATORI Personal Admission Route, home">
            <Logo />
          </a>

          {showSectionLinks && (
            <nav aria-label="Sections" className="hidden items-center gap-0.5 xl:flex">
              {SECTION_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-mist transition-colors hover:text-ink">
                  {l.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <DestinationSwitcher />
            </div>
            {plan === 'pro' && (
              <span className="hidden items-center gap-1 rounded-full border border-gold/40 px-2.5 py-1 text-xs font-bold text-gold sm:inline-flex">
                <Crown size={14} strokeWidth={2} aria-hidden="true" /> Pro
              </span>
            )}
            {!hideCta && (
              <a href={ctaHref} className="btn-primary px-4 py-2 text-sm" onClick={() => trackEvent('cta-header')}>
                {ctaLabel}
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
        <div className="flex overflow-x-auto px-4 pb-2.5 md:hidden">
          <div className="mx-auto w-max">
            <DestinationSwitcher compact />
          </div>
        </div>
      </header>
    </>
  );
}
