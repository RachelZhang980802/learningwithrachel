import pathToRegexp from 'next/dist/compiled/path-to-regexp/index.js';
import hosting from '../../vercel.json';

const routes = hosting.redirects.map(rule => ({
  ...rule,
  matches: pathToRegexp.match(rule.source),
}));

// Keep the same public resource URLs when the app runs outside Vercel.
export default function assetRedirects(event) {
  const url = new URL(event.req.url);
  for (const rule of routes) {
    const match = rule.matches(url.pathname);
    if (!match) continue;
    const destination = rule.destination.replace(':path', match.params.path ?? '');
    return new Response(null, {
      status: rule.statusCode,
      headers: { Location: destination + url.search },
    });
  }
}
