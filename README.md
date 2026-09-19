# SATORI · Personal Admission Route

A website that turns a student's grades, English score, budget and goals into a personal, step-by-step plan for bachelor's admission in **Mainland China, Hong Kong SAR, South Korea and Japan**: matched universities, real application dates and a checklist.

Built by team SATORI (Kazakhstan) for Case 02: University Admissions in East Asia.

---

## 1. Open the site on your own computer (easiest way)

1. Install **Node.js LTS** from <https://nodejs.org> if it is not installed yet (this computer already has it).
2. Open this folder and **double-click `START-SITE.bat`**.
3. Wait for the black window to finish (the first start takes about a minute). Your browser opens the site at **http://localhost:4173**.
4. Keep the black window open while you use the site. Close it to stop.

<details>
<summary>The same thing with typed commands</summary>

Open a terminal in this folder and run:

```bash
npm install
npm run build
npm run preview
```

Then open http://localhost:4173. For live editing while you change code, use `npm run dev` instead.
</details>

## 2. Put the site online for everyone (GitHub Pages, free)

You only do steps 1 to 5 once.

1. Create a free account at <https://github.com> (skip if you have one).
2. Install **GitHub Desktop** from <https://desktop.github.com> and sign in with that account.
3. In GitHub Desktop: **File > Add local repository**, choose this folder (`Desktop\personal-admission-route`). It says the folder is not a repository yet: click **create a repository**, keep the name `personal-admission-route`, and click **Create repository**. (Private files such as `DEVELOPER-ACCESS.txt` are excluded automatically by `.gitignore`.)
4. Click **Publish repository**. **Untick** "Keep this code private" (GitHub Pages is free for public repositories), then click **Publish repository**.
5. On github.com, open your new repository, then **Settings > Pages > Build and deployment > Source** and choose **GitHub Actions**.
6. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to show a green tick (about 2 minutes). If it ran before step 5 and failed, click it and choose **Re-run all jobs**.

After that, whenever you change something: in GitHub Desktop write a short summary, click **Commit to main**, then **Push origin**. The site updates itself in about 2 minutes.

Your address will be: `https://YOUR-GITHUB-NAME.github.io/personal-admission-route/`

- HTTPS is on automatically for `github.io` addresses. If you later connect your own domain, tick **Enforce HTTPS** on the same Pages settings screen.
- The sitemap, `robots.txt`, page links and social previews use the correct address automatically.

## 3. Turn on visitor statistics (optional, 2 minutes)

The site uses **GoatCounter**: free for non-commercial projects, no cookies, no personal data.

1. Sign up at <https://www.goatcounter.com/signup> and pick a code, for example `satori-route`.
2. Open `src/config.ts` and put the code between the quotes: `const GOATCOUNTER_CODE = 'satori-route';`
3. Publish again (push). Visits are only counted for people who click **Allow analytics** in the privacy banner.

## 4. Pro plan and the free developer access

- **Free** shows the top 3 universities, the action plan and the checklist.
- **Pro** ($29/month or $119/year, planned) shows every matching university and a comparison table.
- Payments are **switched off**: the site never asks for card details. Buttons explain this honestly.
- **Developer access (free Pro for the team):** the private code is in `DEVELOPER-ACCESS.txt` in this folder. Type it into the Pro window ("Developer access code") to unlock Pro on that browser. You can give it to the judges.
- To create a new code: `node scripts/new-dev-code.mjs`, then publish again.

**Honest limits:** Pro is unlocked inside the browser, so a technical person could bypass it. That is fine for a demo, but before charging real money you need a payment provider (for example Stripe or Paddle) plus a small server that checks subscriptions. GitHub Pages cannot run a server and its rules do not allow sites mainly used for selling. See section 7.

## 5. Update university information

All facts live in `src/data/universities.ts`, each with a link to the official page it came from and the date it was checked (19 September 2026). To update:

1. Open the official page (the `sourceUrl` next to the number).
2. Change the number or date in the file.
3. Change `dataCheckedOn` in `src/config.ts`.
4. Publish again.

Exchange rates are in `src/data/rates.ts` (European Central Bank reference rates).

## 6. Automated checks

```bash
npx playwright install chromium   # first time only
npm test
```

66 checks run in a real browser, on desktop and phone sizes: the full questionnaire with its error messages, keyboard-only use, saved checklist, Pro unlock and lockout, accessibility (axe-core, WCAG 2.2 AA), page titles and descriptions, sitemap and robots.txt, the custom 404 page, every internal link, every official university link, cookie consent and analytics, the security policy, no leaked secrets, no sideways scrolling on phones and page speed.

## 7. Things to do before a real public launch

- **Payments:** GitHub Pages is not allowed for sites mainly used for selling. Move to a host with server functions (Vercel, Netlify or Cloudflare) and add a payment provider.
- **Kazakhstan law:** once you store user accounts or payments, personal data of Kazakhstan citizens must be kept on servers in Kazakhstan (Law "On Personal Data and Their Protection"), and consumer information should be available in Kazakh and Russian. Ask a lawyer before taking money.
- **Minors:** many applicants are under 18. Paid plans must be bought by a parent or guardian.
- **Data freshness:** fees and deadlines change every year. Re-check the official pages before each intake.
- **GoatCounter** is free for non-commercial use only. A paid product needs its paid plan or another cookieless tool.

## Project map

| Path | What it is |
| --- | --- |
| `src/data/universities.ts` | The 14 universities, with sources |
| `src/lib/scoring.ts` | How the fit forecast is calculated (explained on the site) |
| `src/lib/roadmap.ts` | Action plan and checklist tasks |
| `src/landing/`, `src/onboarding/`, `src/dashboard/` | Home page, questionnaire, results |
| `src/pages/` | Privacy, terms, refund, credits, 404 |
| `src/config.ts` | Team details, prices, analytics, developer access |
| `public/images/` | Compressed photos (credits on the Credits page) |
| `tests/` | Playwright checks |
| `.github/workflows/` | Automatic publishing to GitHub Pages |
