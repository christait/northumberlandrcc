import type { APIRoute } from 'astro';
import baseConfig from '../../admin-config.yml?raw';

export const GET: APIRoute = () => {
  const body = import.meta.env.DEV
    ? `${baseConfig.trimEnd()}\n\n# Auto-enabled in dev (npm run dev) so editors can\n# work against npx decap-server without GitHub auth.\nlocal_backend: true\n`
    : baseConfig;
  return new Response(body, {
    headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
  });
};
