import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface ChoiceProps {
  type: 'radio' | 'checkbox';
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onFocus?: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  describedBy?: string;
}

/**
 * A large selectable card. The real <input> stays in the DOM (visually hidden), so the
 * keyboard, screen readers and form semantics all work natively.
 */
export function ChoiceCard({ type, name, value, checked, onChange, onFocus, title, description, icon, describedBy }: ChoiceProps) {
  return (
    <label className="group relative block cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onFocus={onFocus}
        aria-describedby={describedBy}
        className="peer sr-only"
      />
      <div
        className={`flex h-full items-start gap-3 rounded-3xl border p-4 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold sm:p-5 ${
          checked ? 'border-gold/70 bg-gold/[0.09]' : 'border-white/12 bg-wine-950/35 hover:border-white/25'
        }`}
      >
        {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-ink">{title}</div>
          {description && <div className="mt-1 text-sm leading-relaxed text-mist">{description}</div>}
        </div>
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${type === 'radio' ? 'rounded-full' : 'rounded-md'} ${
            checked ? 'border-gold bg-gold text-wine-900' : 'border-white/35'
          }`}
        >
          {checked && <Check size={13} strokeWidth={3.2} />}
        </span>
      </div>
    </label>
  );
}

interface ChipProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  onFocus?: () => void;
  children: ReactNode;
  describedBy?: string;
}

export function Chip({ name, value, checked, onChange, onFocus, children, describedBy }: ChipProps) {
  return (
    <label className="relative cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} onFocus={onFocus} aria-describedby={describedBy} className="peer sr-only" />
      <span
        className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold ${
          checked ? 'border-gold bg-gold text-wine-900' : 'border-white/20 text-mist hover:border-white/40 hover:text-ink'
        }`}
      >
        {children}
      </span>
    </label>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-semibold text-danger">
      {message}
    </p>
  );
}

export function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-ink">
      {children}
      {optional && <span className="ml-1.5 font-medium text-dusk">(optional)</span>}
    </label>
  );
}
