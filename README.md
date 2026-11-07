# Division of the North East — Order of the Red Cross of Constantine

Static website for the Division of the North East, built with [Astro](https://astro.build/), authored in Markdown, edited via [Decap CMS](https://decapcms.org/), and deployed to GitHub Pages.

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
| Officers  | `src/content/officers/` | `office`             |
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

Visit `https://rccnortheast.org.uk/admin/` and sign in with GitHub. Decap CMS provides a form-based editor for News, Events, Conclaves, the Divisional Executive, the Divisional Officers and the static Pages. Saving an entry creates a Pull Request (or commits directly, depending on workflow setting), which GitHub Actions then deploys.

To enable GitHub sign-in for Decap, deploy a small OAuth bridge (see "OAuth setup" below) and update `src/admin-config.yml` with its URL.

## Images

Site images live in `public/img/`. The Header logo is rendered from `public/img/logo.png`.

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
2. If using the custom domain `rccnortheast.org.uk`, the `public/CNAME` file in this repo will set it automatically. Confirm DNS:
   - `A` records pointing apex to GitHub Pages IPs (185.199.108.153, .109.153, .110.153, .111.153), or
   - `CNAME` for `www` pointing to `<owner>.github.io`.
3. Tick **Enforce HTTPS** once the certificate is issued.

## OAuth setup for Decap (one-time)

Decap CMS uses a tiny OAuth proxy to broker GitHub sign-in for editors. The simplest options:

- **Cloudflare Workers** — deploy [`decap-proxy`](https://github.com/sterlingwes/decap-proxy) (zero-cost on the free tier).
- **Vercel** — deploy [`netlify-cms-oauth-provider-node`](https://github.com/vencax/netlify-cms-github-oauth-provider).

Then in **GitHub → Settings → Developer settings → OAuth Apps** create an app:

- Homepage URL: `https://rccnortheast.org.uk`
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
│   ├── admin/             # Decap CMS shell (index.html only; config is generated)
│   ├── img/               # static images (header logo, etc.)
│   ├── CNAME              # custom domain
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── admin-config.yml   # Decap CMS config source (served via /admin/config.yml)
│   ├── components/        # Header, Footer
│   ├── config/site.json   # site title, nav, contact email
│   ├── content/           # Markdown content collections
│   ├── layouts/           # BaseLayout, MarkdownPageLayout
│   ├── pages/             # routes (incl. admin/config.yml.ts dev/prod toggle)
│   └── styles/global.css
└── .github/workflows/     # build + deploy pipelines
```

## Editing the site

- **Change the title, tagline or nav links:** `src/config/site.json`.
- **Change a static page (History, Downloads):** edit the matching file in `src/content/pages/`.
- **Add a Conclave / Executive member / Officer / News item / Event:** add a Markdown file to the relevant folder, or use `/admin/`.
- **Edit the navigation, including the Division dropdown:** the `nav` array in `src/config/site.json` accepts `{ label, href }` for top-level links and `{ label, children: [...] }` for grouped submenus.
- **Tweak colours / typography:** `src/styles/global.css`.

## Licence

Content © Division of the North East, Red Cross of Constantine. Source code MIT-licensed.

## Domains

- **Live site:** `https://rccnortheast.org.uk` (set in `public/CNAME`, `astro.config.mjs` and the repo's Pages settings).
- **Old domain:** `northumberlandrcc.org.uk` is no longer served by this repo. A top-level redirect on its DNS (Cloudflare) sends visitors to `https://rccnortheast.org.uk`.

## Meetings Diary

The yearly diary lives in `src/content/diary/<year>.yaml` (editable under **Meetings Diary** in `/admin/`). Each entry has a `date`, optional `time`, `meeting`, `conclave` (the Conclave page slug), `where` and `type` (`meeting`, `enthronement`, `visit` or `annual`). The diary feeds `/diary/`, the "Next Conclave meetings" block on the homepage and each Conclave page. The site rebuilds daily so those lists stay current.
