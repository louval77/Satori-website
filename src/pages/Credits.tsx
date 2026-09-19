import credits from '../data/photo-credits.json';
import { DESTINATIONS, DESTINATION_ORDER } from '../data/destinations';
import { UNIVERSITIES, DATA_CHECKED_ON } from '../data/universities';
import { HOUSING } from '../data/housing';
import { RATES_DATE, RATES_SOURCE, RATES_URL } from '../data/rates';
import { BASE, EXTERNAL, imageUrl } from '../lib/links';
import { CN_ADDRESS_REGISTRATION_URL } from '../lib/roadmap';

function sourcesFor(id: string): string[] {
  const u = UNIVERSITIES.find((x) => x.id === id)!;
  const urls = new Set<string>([u.admissionsUrl, u.windowsSourceUrl]);
  for (const o of [...(u.programs.engineering ?? []), ...(u.programs.business ?? [])]) {
    urls.add(o.tuitionSourceUrl);
    if (o.english) urls.add(o.english.sourceUrl);
    if (o.local) urls.add(o.local.sourceUrl);
  }
  u.scholarships.forEach((s) => urls.add(s.url));
  if (HOUSING[id]) urls.add(HOUSING[id].sourceUrl);
  return [...urls];
}

export function Credits() {
  return (
    <>
      <h2>Photos</h2>
      <p>
        All photos come from Wikimedia Commons under open licences. We cropped, resized and compressed them for the web; the
        originals are unchanged on Commons.
      </p>
      <ul className="!list-none !pl-0">
        {credits.map((c) => (
          <li key={c.id} className="flex gap-4 py-2">
            <img src={imageUrl(c.id, 'sm')} alt={c.alt} width={96} height={64} loading="lazy" className="h-16 w-24 shrink-0 rounded-xl object-cover" />
            <span>
              <a href={c.sourceUrl} {...EXTERNAL}>
                {c.title}
              </a>{' '}
              by {c.author}.{' '}
              {c.licenseUrl ? (
                <a href={c.licenseUrl} {...EXTERNAL}>
                  {c.license}
                </a>
              ) : (
                c.license
              )}
              .
            </span>
          </li>
        ))}
      </ul>

      <h2>Mascot, icons and fonts</h2>
      <ul>
        <li>Tori the mascot and the SATORI logo were drawn for this project.</li>
        <li>
          Flags:{' '}
          <a href="https://github.com/lipis/flag-icons" {...EXTERNAL}>
            flag-icons
          </a>{' '}
          (MIT licence).
        </li>
        <li>
          Icons:{' '}
          <a href="https://lucide.dev/" {...EXTERNAL}>
            Lucide
          </a>{' '}
          (ISC licence).
        </li>
        <li>Fonts: Bricolage Grotesque and Manrope (SIL Open Font License), served from this site via Fontsource.</li>
        <li>Code libraries: React, Motion and Tailwind CSS (MIT licence).</li>
        <li>
          Full licence texts: <a href={`${BASE}third-party-licenses.txt`}>third-party-licenses.txt</a>
        </li>
      </ul>

      <h2>University data sources</h2>
      <p>Read on official websites on {DATA_CHECKED_ON}.</p>
      {UNIVERSITIES.map((u) => (
        <div key={u.id}>
          <h3>{u.name}</h3>
          <ul>
            {sourcesFor(u.id).map((url) => (
              <li key={url} className="break-all">
                <a href={url} {...EXTERNAL}>
                  {url.replace(/^https?:\/\//, '')}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Government, visa and exchange-rate sources</h2>
      <ul>
        {DESTINATION_ORDER.flatMap((id) => {
          const d = DESTINATIONS[id];
          return [
            <li key={`${id}-s`}>
              {d.name}, {d.scholarship.name}:{' '}
              <a href={d.scholarship.url} {...EXTERNAL} className="break-all">
                {d.scholarship.url.replace(/^https?:\/\//, '')}
              </a>
            </li>,
            <li key={`${id}-v`}>
              {d.name}, {d.visa.urlLabel}:{' '}
              <a href={d.visa.url} {...EXTERNAL} className="break-all">
                {d.visa.url.replace(/^https?:\/\//, '')}
              </a>
            </li>,
          ];
        })}
        <li>
          Mainland China, address registration (Exit and Entry Administration Law, Article 39):{' '}
          <a href={CN_ADDRESS_REGISTRATION_URL} {...EXTERNAL} className="break-all">
            {CN_ADDRESS_REGISTRATION_URL.replace(/^https?:\/\//, '')}
          </a>
        </li>
        <li>
          {RATES_SOURCE}, {RATES_DATE}:{' '}
          <a href={RATES_URL} {...EXTERNAL}>
            ecb.europa.eu
          </a>
        </li>
      </ul>
    </>
  );
}
