import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { Crown, KeyRound, X } from 'lucide-react';
import { PRICING } from '../config';
import { leavePro, lockRemainingSeconds, tryDeveloperCode, usePlan } from '../lib/plan';
import { trackEvent } from '../lib/analytics';

type Billing = 'monthly' | 'yearly';

// Tiny store so any button on the page can open the dialog.
const listeners = new Set<() => void>();
let openState: { open: boolean; billing: Billing } = { open: false, billing: 'yearly' };
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
export function openProModal(billing: Billing = 'yearly'): void {
  openState = { open: true, billing };
  listeners.forEach((l) => l());
  trackEvent(`pro-interest-${billing}`);
}
function closeProModal(): void {
  openState = { ...openState, open: false };
  listeners.forEach((l) => l());
}

export function ProModal() {
  const state = useSyncExternalStore(subscribe, () => openState, () => openState);
  const plan = usePlan();
  const ref = useRef<HTMLDialogElement>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (state.open && !dialog.open) {
      setError(null);
      setSuccess(false);
      setCode('');
      dialog.showModal();
    }
    if (!state.open && dialog.open) dialog.close();
  }, [state.open]);

  const price = state.billing === 'yearly' ? `$${PRICING.yearly} a year` : `$${PRICING.monthly} a month`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setError('Enter the developer access code.');
      return;
    }
    setBusy(true);
    const result = await tryDeveloperCode(code);
    setBusy(false);
    if (result.ok) {
      setSuccess(true);
      setError(null);
      trackEvent('pro-unlocked-developer');
      return;
    }
    if (result.reason === 'locked') setError(`Too many attempts. Try again in ${result.waitSeconds ?? lockRemainingSeconds()} seconds.`);
    else if (result.reason === 'unsupported') setError('This browser cannot check the code. Open the site over HTTPS or on localhost.');
    else setError('That code is not correct.');
  }

  return (
    <dialog
      ref={ref}
      onClose={closeProModal}
      onClick={(e) => {
        if (e.target === ref.current) closeProModal();
      }}
      aria-labelledby="pro-title"
      className="m-auto w-[min(92vw,480px)] rounded-3xl border-0 bg-transparent p-0 text-ink backdrop:bg-wine-950/75 backdrop:backdrop-blur-sm"
    >
      <div className="glass glass-accent rounded-3xl p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Crown className="text-gold" size={22} strokeWidth={1.75} aria-hidden="true" />
            <h2 id="pro-title" className="font-display text-xl font-bold">
              {plan === 'pro' ? 'Pro is active' : `SATORI Pro, ${price}`}
            </h2>
          </div>
          <button type="button" onClick={closeProModal} className="btn-ghost h-9 w-9 shrink-0 p-0" aria-label="Close">
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {plan === 'pro' ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm leading-relaxed text-mist">
              {success ? 'Developer access accepted. ' : ''}Pro is unlocked on this device only. You can see every matching
              university and the full comparison on your dashboard.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primary px-5 py-2.5 text-sm" onClick={closeProModal}>
                Done
              </button>
              <button
                type="button"
                className="btn-ghost px-5 py-2.5 text-sm"
                onClick={() => {
                  leavePro();
                  closeProModal();
                }}
              >
                Switch back to Free
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Payments are not open yet. SATORI is a hackathon prototype, so we cannot take or store any payment details and
              nothing will be charged. The prices shown are planned prices.
            </p>

            <form onSubmit={onSubmit} className="mt-6 border-t border-white/10 pt-5" noValidate>
              <label htmlFor="dev-code" className="flex items-center gap-2 text-sm font-bold text-ink">
                <KeyRound size={16} strokeWidth={2} aria-hidden="true" /> Developer access code
              </label>
              <p id="dev-code-help" className="mt-1 text-xs text-dusk">
                For the SATORI team and competition judges. Unlocks Pro on this device.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  id="dev-code"
                  name="dev-code"
                  className="field-input font-mono uppercase tracking-wider"
                  autoComplete="off"
                  spellCheck={false}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'dev-code-help dev-code-error' : 'dev-code-help'}
                  placeholder="SATORI-XXXX-XXXX-XXXX-XXXX"
                />
                <button type="submit" className="btn-primary px-5 py-3 text-sm" disabled={busy}>
                  {busy ? 'Checking' : 'Unlock Pro'}
                </button>
              </div>
              {error && (
                <p id="dev-code-error" role="alert" className="mt-2 text-sm font-semibold text-danger">
                  {error}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
