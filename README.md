# Form Builder — B2B SaaS Concept

A three-panel form builder interface (field library · canvas · settings) with
real drag-and-drop powered by the native HTML5 Drag and Drop API. Built with
React, Vite, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Deploy to Vercel — get a shareable link

The fastest route (about a minute, no dashboard needed):

```bash
cd form-builder-app
npx vercel          # first run opens a browser to log in / sign up — free
npx vercel --prod   # promotes it to a production URL you can share
```

Vercel auto-detects this as a Vite app:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

When it finishes, the CLI prints a live URL like
`https://form-builder-app-xxxx.vercel.app` — that is the link to share.

### Alternative: deploy from the Vercel dashboard

1. Push this `form-builder-app` folder to a GitHub repository.
2. Go to https://vercel.com/new and import that repository.
3. Keep the auto-detected Vite settings and click **Deploy**.
