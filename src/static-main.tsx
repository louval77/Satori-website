/*
 * Entry for the standalone pages (privacy, terms, refund, credits and 404).
 * Each HTML file sets data-page on #root to choose its content.
 */
import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight } from 'lucide-react';
import './styles.css';
import { StaticLayout } from './pages/StaticLayout';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Refund } from './pages/Refund';
import { Credits } from './pages/Credits';
import { PAGES } from './lib/links';
import { trackPageview } from './lib/analytics';

function NotFound() {
  return (
    <>
      <p>This page does not exist. The link may be old or mistyped.</p>
      <p className="!mt-6">
        <a href={PAGES.home} className="btn-primary px-6 py-3 text-sm !text-wine-900 !no-underline">
          Back to the homepage <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </a>
      </p>
      <p className="!mt-6">
        You might be looking for the <a href={PAGES.privacy}>privacy policy</a>, <a href={PAGES.terms}>terms</a> or{' '}
        <a href={PAGES.credits}>credits</a>.
      </p>
    </>
  );
}

const PAGES_BY_KEY: Record<string, { title: string; body: ReactNode; updated?: boolean }> = {
  privacy: { title: 'Privacy policy', body: <Privacy /> },
  terms: { title: 'Terms and conditions', body: <Terms /> },
  refund: { title: 'Refund policy', body: <Refund /> },
  credits: { title: 'Photo and data credits', body: <Credits /> },
  notFound: { title: 'Page not found', body: <NotFound />, updated: false },
};

const root = document.getElementById('root');
if (root) {
  const page = PAGES_BY_KEY[root.dataset.page ?? ''] ?? PAGES_BY_KEY.notFound!;
  trackPageview();
  createRoot(root).render(
    <StrictMode>
      <StaticLayout title={page.title} updated={page.updated ?? true}>
        {page.body}
      </StaticLayout>
    </StrictMode>,
  );
}
