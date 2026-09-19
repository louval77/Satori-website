import { ArrowUpRight } from 'lucide-react';
import { useDestination } from '../context/destination';
import { DESTINATIONS, DESTINATION_ORDER, type DestinationId } from '../data/destinations';
import { UNIVERSITIES } from '../data/universities';
import { formatUsd, toUsd } from '../data/rates';
import credits from '../data/photo-credits.json';
import { Flag } from '../components/Flag';
import { Reveal } from '../components/Reveal';
import { imageUrl } from '../lib/links';

const ALT = Object.fromEntries(credits.map((c) => [c.id, c.alt]));

function tuitionRange(id: DestinationId): string {
  const values = UNIVERSITIES.filter((u) => u.destination === id)
    .flatMap((u) => [...(u.programs.engineering ?? []), ...(u.programs.business ?? [])])
    .map((o) => (o.tuition ? toUsd(o.tuition.amount * (o.tuition.per === 'semester' ? 2 : 1), o.tuition.currency) : null))
    .filter((v): v is number => v !== null);
  if (values.length === 0) return 'Not published';
  return `${formatUsd(Math.min(...values))} to ${formatUsd(Math.max(...values))}`;
}

export function Destinations() {
  const { dest, setDest } = useDestination();
  return (
    <section id="destinations" aria-labelledby="dest-title" className="py-16">
      <Reveal className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <h2 id="dest-title" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Four destinations, {UNIVERSITIES.length} universities
        </h2>
        <p className="mt-3 max-w-[60ch] text-mist">
          Tuition ranges are yearly, converted to US dollars at European Central Bank rates. Swipe or scroll to compare.
        </p>
      </Reveal>

      <ul
        className="mx-auto mt-8 flex max-w-[1120px] snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 [scrollbar-color:rgb(255_201_64/0.4)_transparent]"
        aria-label="Destinations"
      >
        {DESTINATION_ORDER.map((id) => {
          const d = DESTINATIONS[id];
          const count = UNIVERSITIES.filter((u) => u.destination === id).length;
          const active = id === dest;
          return (
            <li key={id} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
              <article className={`glass flex h-full flex-col overflow-hidden rounded-3xl ${active ? 'glass-accent' : ''}`}>
                <img
                  src={imageUrl(d.photos.right, 'sm')}
                  alt={ALT[d.photos.right] ?? ''}
                  width={720}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
                    <Flag id={id} className="h-4 w-[22px]" /> {d.name}
                  </h3>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-dusk">Universities</dt>
                      <dd className="font-semibold text-ink">{count}</dd>
                    </div>
                    <div>
                      <dt className="text-dusk">Tuition per year</dt>
                      <dd className="font-semibold text-ink">{tuitionRange(id)}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm leading-relaxed text-mist">{d.teachingNote}</p>
                  <p className="mt-3 text-sm text-mist">
                    <span className="font-semibold text-ink">Scholarship to know: </span>
                    {d.scholarship.name}
                  </p>
                  <div className="mt-auto pt-5">
                    <button
                      type="button"
                      onClick={() => {
                        setDest(id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      aria-pressed={active}
                      className="btn-ghost w-full px-4 py-2.5 text-sm"
                    >
                      {active ? `Showing ${d.short}` : `Show ${d.short}`}
                      <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
