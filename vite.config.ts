import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

/*
 * BASE_PATH and SITE_URL are set automatically by the GitHub Pages workflow
 * (.github/workflows/deploy.yml). Locally they default to "/" and localhost.
 */
const base = process.env.BASE_PATH ?? '/';
const siteRoot = (process.env.SITE_URL ?? 'http://localhost:4173').replace(/\/$/, '');
const siteUrl = siteRoot + base.replace(/\/$/, '');

// Every real page of the site. 404.html is deliberately left out of the sitemap.
const PAGES = {
  main: 'index.html',
  privacy: 'privacy/index.html',
  terms: 'terms/index.html',
  refund: 'refund/index.html',
  credits: 'credits/index.html',
  notFound: '404.html',
};
const SITEMAP_PATHS = ['/', '/privacy/', '/terms/', '/refund/', '/credits/'];
const LAST_MODIFIED = '2026-09-19';

// Content Security Policy for the built site. Only our own files load, plus the
// cookieless GoatCounter pixel (and only after the visitor allows analytics).
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.goatcounter.com",
  "font-src 'self'",
  "connect-src 'self' https://*.goatcounter.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

function siteMetaPlugin(): Plugin {
  return {
    name: 'satori-site-meta',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        let out = html.replaceAll('__SITE__', siteUrl).replaceAll('__BASE__', base);
        // The security policy is only added to the production build: the dev server
        // injects inline styles and scripts for hot reload, which a strict policy blocks.
        if (ctx.server === undefined) {
          out = out.replace(
            '<meta charset="UTF-8" />',
            `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
          );
        }
        return out;
      },
    },
    generateBundle() {
      const urls = SITEMAP_PATHS.map(
        (p) => `  <url>\n    <loc>${siteUrl}${p}</loc>\n    <lastmod>${LAST_MODIFIED}</lastmod>\n  </url>`,
      ).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
    },
  };
}

// Makes `npm run preview` behave like GitHub Pages: unknown paths get 404.html with status 404.
function githubPages404Plugin(): Plugin {
  return {
    name: 'satori-preview-404',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const outDir = path.resolve(server.config.build.outDir);
        let url = decodeURIComponent((req.url ?? '/').split('?')[0]!.split('#')[0]!);
        if (url.startsWith(base)) url = '/' + url.slice(base.length);
        const target = path.join(outDir, url);
        const exists = (fs.existsSync(target) && fs.statSync(target).isFile()) || fs.existsSync(path.join(target, 'index.html'));
        if (exists) return next();
        const page = path.join(outDir, '404.html');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.existsSync(page) ? fs.readFileSync(page) : 'Not found');
      });
    },
  };
}

export default defineConfig({
  base,
  appType: 'mpa',
  plugins: [react(), tailwindcss(), siteMetaPlugin(), githubPages404Plugin()],
  build: {
    target: 'es2022',
    // Fonts stay separate files (never inlined as data: URLs) so the strict font-src 'self' policy holds.
    assetsInlineLimit: (file: string) => (/\.(woff2?|ttf|otf)$/.test(file) ? false : undefined),
    rollupOptions: {
      input: Object.fromEntries(Object.entries(PAGES).map(([k, v]) => [k, path.resolve(process.cwd(), v)])),
    },
  },
});
