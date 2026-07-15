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

Serve the generated `dist/` directory with the same kind of plain static file
server used in a self-hosted deployment:

```bash
npm run serve:static
```

Open `http://localhost:8080` from the host machine. The local static server
binds to `0.0.0.0:8080` by default and serves only files from `dist/`.

For a final smoke test before uploading, confirm:

- `index.html` loads without console errors.
- The score display and canvas are visible.
- Arrow keys or WASD move the snake.
- A wall collision shows the game-over overlay.
- Pressing any key after game over restarts the game.

## Self-Hosted Directory Deploy

Copy the full contents of `dist/` to the web root used by the static host:

```bash
rsync -av --delete dist/ /var/www/snake/
```

Any static file server can serve the directory. The Vite config uses relative
asset paths (`base: './'`), so the bundle can be hosted at a domain root or
inside a subdirectory without rewriting generated JavaScript and CSS URLs.

Example minimal static host commands:

```bash
cd /var/www/snake
python3 -m http.server 8080 --bind 0.0.0.0
```

or configure nginx, Caddy, Apache, or another static host to serve that
directory directly.

## Server Notes

- Serve `index.html` as the default document.
- Serve files under `assets/` with long-lived cache headers when possible.
- Do not deploy `node_modules/`, source files, local environment files, or the
  repository metadata directory.
- If future routing adds browser-managed paths, configure the static host to
  fall back to `index.html` for unknown routes.
