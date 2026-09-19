import { lazy, Suspense, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { DestinationProvider } from './context/destination';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { ProModal } from './components/ProModal';
import { SideRails } from './components/SideRails';
import { Hero } from './landing/Hero';
import { Features } from './landing/Features';
import { Destinations } from './landing/Destinations';
import { Method } from './landing/Method';
import { Pricing } from './landing/Pricing';
import { Faq, FinalCta } from './landing/Faq';
import { isProfile, type Profile } from './lib/profile';
import { KEYS, readJson, removeKey, writeJson } from './lib/storage';
import { trackPageview } from './lib/analytics';
import { PAGES } from './lib/links';

// Loaded only when someone opens them, which keeps the first page load small.
const Onboarding = lazy(() => import('./onboarding/Onboarding').then((m) => ({ default: m.Onboarding })));
const Dashboard = lazy(() => import('./dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));

function ViewLoading() {
  return (
    <main id="main" className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6" aria-busy="true">
      <div className="glass h-72 animate-pulse rounded-3xl" />
      <p className="sr-only">Loading</p>
    </main>
  );
}

type View = 'landing' | 'start' | 'route';

function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

function loadProfile(): Profile | null {
  const p = readJson<unknown>(KEYS.profile);
  return isProfile(p) ? p : null;
}

export function App() {
  const hash = useHash();
  const [profile, setProfile] = useState<Profile | null>(loadProfile);
  const view: View = hash === '#start' ? 'start' : hash === '#route' && profile ? 'route' : hash === '#route' ? 'start' : 'landing';

  // "#route" without saved answers goes to the questionnaire instead.
  useEffect(() => {
    if (hash === '#route' && !profile) window.history.replaceState(null, '', '#start');
  }, [hash, profile]);

  // New view: count it (only with consent) and start at the top, or jump to a landing section.
  useEffect(() => {
    trackPageview();
    if (view !== 'landing') {
      window.scrollTo({ top: 0 });
      return;
    }
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, [view]);

  return (
    <DestinationProvider>
      <MotionConfig reducedMotion="user">
        <Header
          showSectionLinks={view === 'landing'}
          hideCta={view !== 'landing'}
          ctaLabel={profile ? 'My route' : 'Build my route'}
          ctaHref={profile ? PAGES.route : PAGES.start}
        />

        {view === 'landing' && (
          <main id="main">
            <Hero />
            <Features />
            <Destinations />
            <Method />
            <Pricing />
            <Faq />
            <FinalCta />
          </main>
        )}

        <Suspense fallback={<ViewLoading />}>
        {view === 'start' && (
          <Onboarding
            initial={profile}
            onComplete={(p) => {
              writeJson(KEYS.profile, p);
              setProfile(p);
              window.location.hash = '#route';
            }}
          />
        )}

        {view === 'route' && profile && (
          <Dashboard
            profile={profile}
            onEdit={() => {
              window.location.hash = '#start';
            }}
            onStartOver={() => {
              removeKey(KEYS.profile);
              removeKey(KEYS.checklist);
              setProfile(null);
              window.location.hash = '#start';
            }}
          />
        )}
        </Suspense>

        <Footer />
        <CookieBanner />
        <ProModal />
        <SideRails />
      </MotionConfig>
    </DestinationProvider>
  );
}
