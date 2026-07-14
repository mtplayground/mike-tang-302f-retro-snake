# Static Deployment

This project produces a static Vite bundle that can be served from a plain
directory. It does not require Docker, a Node server, server-side rendering, or
a CI/CD pipeline.

## Build

Install dependencies and create the production bundle:

```bash
npm ci
npm run build
```

The deployable files are written to `dist/`.

## Verify Locally

Preview the generated static bundle on `0.0.0.0:8080`:

```bash
npm run preview
```

Open `http://localhost:8080` from the host machine.

## Self-Hosted Directory Deploy

Copy the full contents of `dist/` to the web root used by the static host:

```bash
rsync -av --delete dist/ /var/www/snake/
```

Any static file server can serve the directory. The Vite config uses relative
asset paths (`base: './'`), so the bundle can be hosted at a domain root or
inside a subdirectory without rewriting generated JavaScript and CSS URLs.

## Server Notes

- Serve `index.html` as the default document.
- Serve files under `assets/` with long-lived cache headers when possible.
- Do not deploy `node_modules/`, source files, local environment files, or the
  repository metadata directory.
- If future routing adds browser-managed paths, configure the static host to
  fall back to `index.html` for unknown routes.
