# Alibaba Cloud migration: staged deployment

The production domain now points to the Alibaba Cloud ECS deployment. Keep the previous release and Vercel deployment available for rollback.

## Build and package

Use Node 24, install the locked dependencies, then run:

```
npm run typecheck
npm run build:aliyun
node scripts/package-aliyun.mjs
```

The package contains bundled JavaScript and static pages; no npm installation or compilation is needed on the server. Packaging rejects native `.node` files and symlinks. It removes files covered by the existing `vercel.json` redirects; the standalone server applies those same redirects and preserves query strings. HTML pages excluded by the redirect rules remain local. Nginx serves local static files and proxies other requests to Node.

Generated narrative decks, storybook pages, native-theory resources, and their fonts stay in the local release. Before archiving, the package audit verifies the interactive readers' required assets against the copied bundle so broad legacy redirects cannot silently omit them.

Output: `dist/aliyun/learningwithrachel-aliyun.tar.gz`, with its SHA-256 in `dist/aliyun/SHA256SUMS`.

## First installation

On the target Ubuntu x86_64 server, install Node 24, Nginx, curl, CA certificates and xz-utils first. Verify the archive checksum, extract into a new temporary folder, then run `bash learningwithrachel/install-preview.sh` as root.

The installer refuses to replace an existing deployment or occupy ports already in use. It stages a versioned release under `/opt/learningwithrachel/releases`, creates a dedicated non-login service account and an automatically started systemd service bound to `127.0.0.1:3000`. The Nginx preview listens only on `127.0.0.1:8080`. It does not modify DNS, the public default Nginx site or firewall/security group rules. On failure it restores the configuration it added and retains the staged files for inspection.

Readiness checks cover the root page, a static course page, the release marker and a media redirect. Successful installation ends with `PREVIEW_READY`. Runtime logs: `journalctl -u learningwithrachel`.

Full redirect verification from a checkout:

```
ALIYUN_TEST_URL=http://127.0.0.1:8080 node scripts/verify-aliyun-routes.mjs
```

## Updating an existing deployment

Build and package a new release, transfer the archive to the ECS instance, verify its SHA-256, then extract it and run `bash learningwithrachel/update-release.sh` as root. The updater requires an existing healthy deployment. It copies the new release into a dated directory, switches the `current` symlink, restarts the application, and checks the local preview and both HTTPS production hostnames. If a check fails, it restores the previous release and restarts the application. It does not change DNS, TLS certificates, Nginx configuration, or R2 objects. Keep the previous release until the public site has been checked from outside the server.

## Public preview after local readiness

Run `bash deploy/aliyun/enable-public-preview.sh` on the server from an audited copy. It configures only `preview.negentropylearning.com.cn` on port 80 and keeps the public production domain unchanged. It verifies the website with a local Host header request. Next, create a DNS-only A record for `preview` pointing to the ECS public IPv4, ensure inbound TCP/80 and 443 are permitted, then issue a certificate and test HTTPS. Disable or remove this host after the migration if no longer needed.

If changing the asset host later, migrate resources separately and retest CORS and audio range requests. The first-install script still refuses to overwrite an existing deployment.
