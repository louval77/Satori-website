/** SATORI mark: two route nodes joined by a curved path, the same shape as the favicon. */
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill="#5B0E2D" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" fill="none" stroke="#FFC940" strokeOpacity="0.45" />
      <path d="M9 22.5c4.5 0 4-13 10-13 2.3 0 3.5 1.2 4 2.2" fill="none" stroke="#FFC940" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="9" cy="22.5" r="3" fill="#FFC940" />
      <circle cx="23.5" cy="11.5" r="3" fill="#FFF4E8" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-ink">SATORI</span>
        <span className="hidden text-[11px] font-medium text-dusk sm:block">Personal Admission Route</span>
      </span>
    </span>
  );
}
