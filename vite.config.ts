import vinext from "vinext";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

// Nitro owns the deployment output on Vercel. The Cloudflare Vite plugin
// remains enabled for local/Workers builds, where its R2 and worker bindings
// are required, but must not also claim the Vercel build output.
const isNitroDeployment =
  process.env.NITRO_PRESET === "vercel" || process.env.VERCEL === "1";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    // Vite 8's CSS import resolver does not follow Tailwind v4's `style`
    // export in every package-manager layout. Resolve the framework stylesheet
    // explicitly so the Nitro build uses the same CSS pipeline as local Vinext.
    resolve: {
      alias: {
        tailwindcss: resolve("node_modules/tailwindcss/index.css"),
      },
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      {
        name: "local-archive-media",
        apply: "serve",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url?.startsWith("/media/")) return next();
            const root = resolve(".r2-media");
            let path: string;
            try { path = resolve(root, decodeURIComponent(req.url.split("?")[0].slice(7))); } catch { return next(); }
            if (!path.startsWith(root + sep)) return next();
            try {
              const info = await stat(path);
              if (!info.isFile()) return next();
              const types: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf" };
              res.setHeader("Content-Type", types[extname(path)] ?? "application/octet-stream");
              res.setHeader("Content-Length", info.size);
              if (req.method === "HEAD") return res.end();
              createReadStream(path).pipe(res);
            } catch { next(); }
          });
        },
      },
      vinext(),
      nitro(),
      sites(),
      ...(!isNitroDeployment
        ? [
            cloudflare({
              viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
              inspectorPort: false,
              config: localBindingConfig,
            }),
          ]
        : []),
    ],
  };
});
