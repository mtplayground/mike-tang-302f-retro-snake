#!/usr/bin/env node
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';

const DEFAULT_PORT = 8080;
const root = resolve(process.argv[2] ?? 'dist');
const host = process.env.HOST ?? '0.0.0.0';
const port = parsePort(process.env.PORT ?? process.argv[3]);

if (!existsSync(root)) {
  console.error(`Static root does not exist: ${root}`);
  process.exit(1);
}

const server = createServer(async (request, response) => {
  if (!request.url || (request.method !== 'GET' && request.method !== 'HEAD')) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method Not Allowed');
    return;
  }

  const filePath = getSafeFilePath(request.url);

  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) {
      response.writeHead(404);
      response.end('Not Found');
      return;
    }

    response.writeHead(200, {
      'Cache-Control': getCacheHeader(filePath),
      'Content-Length': fileStat.size,
      'Content-Type': getContentType(filePath),
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    createReadStream(filePath).pipe(response);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      response.writeHead(404);
      response.end('Not Found');
      return;
    }

    console.error('Static file response failed:', error);
    response.writeHead(500);
    response.end('Internal Server Error');
  }
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});

function getSafeFilePath(requestUrl) {
  const url = new URL(requestUrl, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const filePath = resolve(root, requestedPath);
  const relativePath = relative(root, filePath);

  if (
    relativePath === '' ||
    relativePath.startsWith(`..${sep}`) ||
    relativePath === '..' ||
    isAbsolute(relativePath)
  ) {
    return null;
  }

  return filePath;
}

function parsePort(value) {
  if (value === undefined) {
    return DEFAULT_PORT;
  }

  const parsedPort = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    console.error(`Invalid port: ${value}`);
    process.exit(1);
  }

  return parsedPort;
}

function getContentType(filePath) {
  const extension = extname(filePath);
  const contentTypes = new Map([
    ['.css', 'text/css; charset=utf-8'],
    ['.html', 'text/html; charset=utf-8'],
    ['.ico', 'image/x-icon'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.map', 'application/json; charset=utf-8'],
    ['.svg', 'image/svg+xml'],
    ['.txt', 'text/plain; charset=utf-8'],
    ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ]);

  return contentTypes.get(extension) ?? 'application/octet-stream';
}

function getCacheHeader(filePath) {
  return relative(root, filePath).startsWith(`assets${sep}`)
    ? 'public, max-age=31536000, immutable'
    : 'no-cache';
}
