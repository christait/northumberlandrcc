# Northumberland Division — Order of the Red Cross of Constantine

Static website for the Northumberland Division, built with [Astro](https://astro.build/), authored in Markdown, edited via [Decap CMS](https://decapcms.org/), and deployed to GitHub Pages.

## How content gets onto the site

There are two ways to publish:

### 1. Drop a Markdown file into GitHub

Add a `.md` file to one of the content folders below and merge to `main`. GitHub Actions will rebuild and redeploy automatically.

| Section   | Folder                  | Required frontmatter |
| --------- | ----------------------- | -------------------- |
| News      | `src/content/news/`     | `title`, `date`      |
| Events    | `src/content/events/`   | `title`, `date`      |
| Conclaves | `src/content/conclaves/`| `name`               |
| Executive | `src/content/executive/`| `name`, `rank`, `role` |
| Pages     | `src/content/pages/`    | `title`              |

A minimal news article looks like:

```markdown
---
title: A new notice
date: 2026-05-10
summary: One-sentence teaser shown on listing pages.
---

Body in **Markdown**.
```

### 2. Use the friendly editor at `/admin/`

Visit `https://northumberlandrcc.org.uk/admin/` and sign in with GitHub. Decap CMS provides a form-based editor for News, Events, Conclaves, the Divisional Executive and the static Pages. Saving an entry creates a Pull Request (or commits directly, depending on workflow setting), which GitHub Actions then deploys.

To enable GitHub sign-in for Decap, deploy a small OAuth bridge (see "OAuth setup" below) and update `src/admin-config.yml` with its URL.

## Images

Site images live in `public/img/`. The Header logo is rendered from `public/img/logo.svg`.

To pull (or refresh) images from the existing WordPress site, run:

```bash
npm run fetch:images
```

This downloads everything listed in `scripts/fetch-images.mjs` to `public/img/`. After running it, commit the new files. The script must be run somewhere with open internet (e.g. a Codespace or your laptop).

## Preview in GitHub Codespaces (no local install required)

1. On the repo page in GitHub, click **Code → Codespaces → Create codespace on `main`**.
2. Wait for the container to build — `npm install` runs automatically.
3. In the Codespace terminal, run:
   ```bash
   npm run dev
   ```
4. Codespaces detects port 4321 and pops up a **"Open in Browser"** notification — click it to view the live preview at a temporary HTTPS URL.

Edits to Markdown content or `.astro` files hot-reload instantly.

## Local development

Requirements: Node 20+ (see `.nvmrc`).

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # preview the production build
```

To work on Decap CMS locally without GitHub sign-in, run `decap-server` alongside the Astro dev server:

```bash
npx decap-server   # starts the local proxy on :8081
npm run dev        # serves the admin at http://localhost:4321/admin/
```

`local_backend: true` is appended to `/admin/config.yml` automatically when `npm run dev` is running (via `src/pages/admin/config.yml.ts`), so edits write straight to your working tree without GitHub auth. Production builds omit the flag.

## Deployment

`/.github/workflows/deploy.yml` builds the site on every push to `main` and publishes it via the official `actions/deploy-pages` flow.

### One-time GitHub Pages setup

1. Repo **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. If using the custom domain `northumberlandrcc.org.uk`, the `public/CNAME` file in this repo will set it automatically. Confirm DNS:
   - `A` records pointing apex to GitHub Pages IPs (185.199.108.153, .109.153, .110.153, .111.153), or
   - `CNAME` for `www` pointing to `<owner>.github.io`.
3. Tick **Enforce HTTPS** once the certificate is issued.

## OAuth setup for Decap (one-time)

Decap CMS uses a tiny OAuth proxy to broker GitHub sign-in for editors. The simplest options:

- **Cloudflare Workers** — deploy [`decap-proxy`](https://github.com/sterlingwes/decap-proxy) (zero-cost on the free tier).
- **Vercel** — deploy [`netlify-cms-oauth-provider-node`](https://github.com/vencax/netlify-cms-github-oauth-provider).

Then in **GitHub → Settings → Developer settings → OAuth Apps** create an app:

- Homepage URL: `https://northumberlandrcc.org.uk`
- Authorization callback URL: `https://<your-proxy-host>/callback`

Set the resulting client ID/secret as environment variables in your proxy, then update `src/admin-config.yml`:

```yaml
backend:
  name: github
  repo: christait/northumberlandrcc
  branch: main
  base_url: https://<your-proxy-host>
  auth_endpoint: auth
```

## Project layout

```
.
├── astro.config.mjs
├── public/
│   ├── admin/             # Decap CMS (form editor)
│   ├── CNAME              # custom domain
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/        # Header, Footer
│   ├── config/site.json   # site title, nav, contact email
│   ├── content/           # Markdown content collections
│   ├── layouts/           # BaseLayout, MarkdownPageLayout
│   ├── pages/             # routes
│   └── styles/global.css
└── .github/workflows/     # build + deploy pipelines
```

## Editing the site

- **Change the title, tagline or nav links:** `src/config/site.json`.
- **Change a static page (History, Downloads):** edit the matching file in `src/content/pages/`.
- **Add a Conclave / Executive member / News item / Event:** add a Markdown file to the relevant folder, or use `/admin/`.
- **Tweak colours / typography:** `src/styles/global.css`.

## Licence

Content © Northumberland Division of the Red Cross of Constantine. Source code MIT-licensed.
