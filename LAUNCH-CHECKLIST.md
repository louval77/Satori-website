# Launch checklist (34 items)

Status on 19 September 2026. "Tested" means an automated Playwright check covers it (`npm test`).

| # | Item | Status | How |
| --- | --- | --- | --- |
| 1 | Privacy policy page | Done | `/privacy/`: no accounts, no cookies, browser storage, GoatCounter, GitHub Pages logs, Kazakhstan personal data law, minors |
| 2 | Terms and conditions page | Done | `/terms/`: forecast is not a promise, no affiliation, planned prices, Kazakhstan law |
| 3 | Secrets off the frontend | Done, tested | No API keys exist. The developer code is stored only as a salted SHA-256 hash; the real code is in the git-ignored `DEVELOPER-ACCESS.txt`. A test scans the published files for secrets |
| 4 | Force HTTPS | Done | GitHub Pages serves `github.io` over HTTPS automatically; pages also carry `upgrade-insecure-requests`. For a custom domain tick "Enforce HTTPS" |
| 5 | Cookie consent banner | Done, tested | Equal "Decline" and "Allow analytics" buttons; "Privacy choices" in the footer reopens it |
| 6 | Meta titles and descriptions | Done, tested | Unique title (60 characters or fewer) and description (160 or fewer) per page, canonical links, JSON-LD |
| 7 | Social preview image | Done, tested | `public/og-image.jpg` (1200x630, 77 KB), Open Graph and Twitter tags |
| 8 | Favicon | Done, tested | SVG, 32px PNG and Apple touch icon |
| 9 | Sitemap and robots.txt | Done, tested | Generated on every build with the real address |
| 10 | Alt text on images | Done, tested | Every photo has descriptive alt text; flags next to a name are decorative (empty alt, per WCAG) |
| 11 | Compress images | Done | 18 MB of originals down to about 2.6 MB of WebP in three sizes; phones never download the side photos |
| 12 | Page load speed | Done | Lighthouse: desktop 100, mobile 96 (LCP 2.6 s on simulated slow 4G). A test keeps LCP under 2.5 s and CLS under 0.1 on normal connections |
| 13 | Colour contrast | Done, tested | axe-core WCAG AA contrast checks pass; neon country colours are used for glows only |
| 14 | Mobile friendly | Done, tested | Phone layouts for every section; test for no sideways scrolling on every page |
| 15 | Custom 404 page | Done, tested | `404.html` with status 404 and a way home |
| 16 | Fix broken links | Done, tested | Internal links crawled; all 61 official source links answered |
| 17 | Form validation | Done, tested | Every step checks its answers with clear messages next to the field |
| 18 | Spam protection | Done | No form sends data anywhere, so there is nothing to spam. The developer code form locks for 60 seconds after 5 wrong tries |
| 19 | Analytics | Ready | GoatCounter (cookieless). Add your code in `src/config.ts` to switch it on |
| 20 | One clear call to action | Done, tested | "Build my route" is the only gold button on the home page |
| 21 | Check cookie consent | Done, tested | Tests prove nothing is sent before consent or after "Decline", and the site sets no cookies |
| 22 | Refund | Done | `/refund/`: no payments today, scam warning, rules will be published before any payment |
| 23 | Only connect necessary data | Done | No accounts, no database, no email. Answers stay in the browser; analytics never includes answers (tested) |
| 24 | Check analytics tracking | Done, tested | Test intercepts GoatCounter requests and checks their contents |
| 25 | Check 3rd party embeds | Done, tested | None: fonts, icons and photos are self-hosted; test fails if any outside file loads |
| 26 | Accessible site | Done, tested | axe-core on every page and view, Lighthouse accessibility 100, skip link, focus management, screen reader messages, reduced motion |
| 27 | Keyboard friendly forms | Done, tested | Native inputs, Tab/Space/Enter work, focus moves to errors and new steps, Escape closes the Pro window |
| 28 | Clear button labels | Done, tested | Test checks every button and link has a name |
| 29 | Remove fake reviews | Done | There are no testimonials, ratings or user counts |
| 30 | Remove unsupported claims | Done | Fit score labelled a forecast, not a chance; example numbers labelled "example"; no "best" or "number one" claims |
| 31 | Real business details | Done | Team SATORI, Kazakhstan, alimzhanaxmetov83@gmail.com, stated as a student team, not a company |
| 32 | Copyright of images | Done | Wikimedia Commons photos under CC BY, CC BY-SA, CC0 or public domain, credited on `/credits/`; original mascot and logo; licence texts in `third-party-licenses.txt` |
| 33 | Local laws | Done for the prototype | Privacy and terms reference Kazakhstan law; see README section 7 before taking payments |
| 34 | Other risks | Listed | README section 7 and the final report |
