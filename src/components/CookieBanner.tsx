import { AnimatePresence, motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { setConsent, useConsent } from '../lib/consent';
import { PAGES } from '../lib/links';
import { trackPageview } from '../lib/analytics';

/**
 * Consent banner. The site sets no cookies; the only optional thing is anonymous,
 * cookieless visit counting. Both choices are equally easy, and nothing is sent
 * before the visitor decides.
 */
export function CookieBanner() {
  const consent = useConsent();
  return (
    <AnimatePresence>
      {consent === null && (
        <motion.section
          role="region"
          aria-label="Privacy choices"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="no-print fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md"
          data-testid="cookie-banner"
        >
          <div className="glass rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-gold" size={22} strokeWidth={1.75} aria-hidden="true" />
              <div>
                <h2 className="font-display text-base font-semibold">No cookies here</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">
                  Your answers stay in this browser. With your permission we count visits anonymously with GoatCounter, which
                  uses no cookies. <a href={PAGES.privacy} className="font-semibold text-gold-soft underline underline-offset-2">Privacy policy</a>
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" className="btn-ghost px-4 py-2.5 text-sm" onClick={() => setConsent('denied')}>
                Decline
              </button>
              <button
                type="button"
                className="btn-ghost px-4 py-2.5 text-sm"
                onClick={() => {
                  setConsent('granted');
                  trackPageview();
                }}
              >
                Allow analytics
              </button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
