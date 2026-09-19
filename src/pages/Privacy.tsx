import { SITE } from '../config';
import { EXTERNAL, PAGES } from '../lib/links';

export function Privacy() {
  return (
    <>
      <p>
        This policy explains what happens to information when you use {SITE.product} ("SATORI", "we"). The short version: we
        have no accounts, no database and no cookies. Your answers stay in your own browser.
      </p>

      <h2>Who we are</h2>
      <p>
        SATORI is {SITE.legalStatus}, based in {SITE.country}. You can reach us at{' '}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>

      <h2>What stays in your browser</h2>
      <p>
        To let you come back to your route, the site saves the following in your browser's local storage. This data never
        leaves your device and we cannot see it:
      </p>
      <ul>
        <li>your questionnaire answers (destinations, field, grades, test scores, budget, start year);</li>
        <li>which checklist tasks you ticked;</li>
        <li>the destination you last selected for photos and colours;</li>
        <li>your analytics choice (allowed or declined);</li>
        <li>whether Pro was unlocked on this device with a developer code, and a counter of wrong code attempts.</li>
      </ul>
      <p>
        You can delete your answers and ticks at any time with "Start over" on your dashboard, or delete everything by clearing
        this site's data in your browser settings. We do not ask for your name, email, phone number or any document.
      </p>

      <h2>Cookies</h2>
      <p>The site does not set any cookies, and there is no advertising or cross-site tracking.</p>

      <h2>Analytics (only if you allow it)</h2>
      <p>
        If you click "Allow analytics", we count visits with{' '}
        <a href="https://www.goatcounter.com/" {...EXTERNAL}>
          GoatCounter
        </a>
        , a privacy-friendly service that uses no cookies. Each count sends the page address, page title, the referring site,
        your screen size and named button events (for example "roadmap generated"). Your questionnaire answers are never sent.
        GoatCounter derives your browser, operating system and approximate location from the request. According to its{' '}
        <a href="https://www.goatcounter.com/help/privacy" {...EXTERNAL}>
          privacy policy
        </a>
        , GoatCounter does not store IP addresses or the full browser identifier and keeps its data on servers in Finland and
        Germany. If you click "Decline", nothing is sent. You can change your choice at any time with "Privacy choices" at the
        bottom of every page.
      </p>

      <h2>Hosting</h2>
      <p>
        The site is hosted on GitHub Pages by GitHub, Inc. (United States). GitHub states that when a GitHub Pages site is
        visited, the visitor's IP address is logged and stored for security purposes. We do not receive these logs. See the{' '}
        <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" {...EXTERNAL}>
          GitHub General Privacy Statement
        </a>
        .
      </p>

      <h2>Fonts, images and other files</h2>
      <p>
        All fonts, icons and photos are stored on the site itself. No third-party scripts, embeds or font services are loaded.
        Links to universities and governments open their own websites, which have their own privacy policies.
      </p>

      <h2>Students under 18</h2>
      <p>
        SATORI is made for students preparing for university, including those under 18. Because we do not collect personal
        data, you can use it without sharing anything about yourself. We encourage younger students to plan applications with a
        parent or guardian.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the Law of the Republic of Kazakhstan "On Personal Data and Their Protection" (No. 94-V of 21 May 2013), and
        similar laws in other countries, you have the right to know whether we hold your personal data and to ask for it to be
        corrected or deleted. We do not hold personal data on any server. Write to us if you have questions and we will
        answer.
      </p>

      <h2>Security</h2>
      <p>
        The site is only served over HTTPS and uses a strict Content Security Policy, so it can only load its own files and,
        with your consent, the GoatCounter counter.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, we will update the date at the top of this page. If we ever start collecting personal data,
        for example for paid plans, we will explain it here before it happens. See also our <a href={PAGES.terms}>terms</a>.
      </p>
    </>
  );
}
