// Flag images come from the MIT-licensed "flag-icons" package, bundled locally.
// Emoji flags are not used because Windows shows them as plain letters.
import cn from 'flag-icons/flags/4x3/cn.svg';
import hk from 'flag-icons/flags/4x3/hk.svg';
import kr from 'flag-icons/flags/4x3/kr.svg';
import jp from 'flag-icons/flags/4x3/jp.svg';
import { DESTINATIONS, type DestinationId } from '../data/destinations';

const SRC = { cn, hk, kr, jp } as const;

interface FlagProps {
  id: DestinationId;
  className?: string;
  /** Flags next to a visible place name are decorative, so alt text stays empty by default. */
  labelled?: boolean;
}

export function Flag({ id, className = 'h-3.5 w-[18px]', labelled = false }: FlagProps) {
  const d = DESTINATIONS[id];
  return (
    <img
      src={SRC[d.flag]}
      alt={labelled ? `Flag of ${d.name}` : ''}
      width={18}
      height={14}
      className={`inline-block shrink-0 rounded-[3px] object-cover ring-1 ring-white/20 ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
