import { Mail } from 'lucide-react';
import { SITE } from '../config';
import { resetConsent } from '../lib/consent';
import { PAGES } from '../lib/links';
import { LogoMark } from './Logo';

export function Footer() {
  return (
    <footer className="no-print relative mt-24 border-t border-white/[0.07] bg-wine-950/60">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7" />
            <span className="font-display text-lg font-bold">SATORI</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-dusk">
            {SITE.product} is a hackathon project by team {SITE.team}, {SITE.legalStatus}, based in {SITE.country}. We are not
            affiliated with any university or government listed on this site.
          </p>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-gold-soft underline-offset-4 hover:underline"
          >
            <Mail size={16} strokeWidth={2} aria-hidden="true" />
            {SITE.contactEmail}
          </a>
        </div>

        <nav aria-label="Legal">
          <h2 className="text-sm font-bold text-ink">Legal</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="text-mist hover:text-ink" href={PAGES.privacy}>Privacy policy</a></li>
            <li><a className="text-mist hover:text-ink" href={PAGES.terms}>Terms and conditions</a></li>
            <li><a className="text-mist hover:text-ink" href={PAGES.refund}>Refund policy</a></li>
            <li>
              <button type="button" className="text-left text-mist hover:text-ink" onClick={resetConsent}>
                Privacy choices
              </button>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold text-ink">About the data</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="text-dusk">University facts checked on {SITE.dataCheckedOn}</li>
            <li><a className="text-mist hover:text-ink" href={PAGES.credits}>Photo and data credits</a></li>
            <li><a className="text-mist hover:text-ink" href={`${PAGES.home}#how`}>How the fit forecast works</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <p className="mx-auto max-w-[1120px] px-4 py-5 text-xs text-dusk sm:px-6">
          &copy; 2026 {SITE.team}. University names belong to their owners and are used only to identify them.
        </p>
      </div>
    </footer>
  );
}
