import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { DestinationProvider } from '../context/destination';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CookieBanner } from '../components/CookieBanner';
import { SideRails } from '../components/SideRails';
import { SITE } from '../config';

export function StaticLayout({ title, updated = true, children }: { title: string; updated?: boolean; children: ReactNode }) {
  return (
    <DestinationProvider>
      <MotionConfig reducedMotion="user">
        <Header />
        <main id="main" className="mx-auto max-w-[860px] px-4 py-10 sm:px-6 lg:py-14">
          <article className="glass rounded-3xl p-6 sm:p-10 print-dark-text">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            {updated && <p className="mt-2 text-sm text-dusk">Last updated {SITE.lastUpdated}</p>}
            <div className="prose-legal mt-6">{children}</div>
          </article>
        </main>
        <Footer />
        <CookieBanner />
        <SideRails />
      </MotionConfig>
    </DestinationProvider>
  );
}
