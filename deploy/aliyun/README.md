# Alibaba Cloud migration: staged deployment

The production domain remains on Vercel while this standalone Node deployment is tested.

## Build and package

Use Node 24, install the locked dependencies, then run:

```
npm run typecheck
npm run build:aliyun
node scripts/package-aliyun.mjs
```

The package contains bundled JavaScript and static pages; no npm installation or compilation is needed on the server. Packaging rejects native `.node` files and symlinks. It removes files covered by the existing `vercel.json` redirects; the standalone server applies those same redirects and preserves query strings. HTML pages excluded by the redirect rules remain local. Nginx serves local static files and proxies other requests to Node.

Output: `dist/aliyun/learningwithrachel-aliyun.tar.gz`, with its SHA-256 in `dist/aliyun/SHA256SUMS`.

## First installation

On the target Ubuntu x86_64 server, install Node 24, Nginx, curl, CA certificates and xz-utils first. Verify the archive checksum, extract into a new temporary folder, then run `bash learningwithrachel/install-preview.sh` as root.

The installer refuses to replace an existing deployment or occupy ports already in use. It stages a versioned release under `/opt/learningwithrachel/releases`, creates a dedicated non-login service account and an automatically started systemd service bound to `127.0.0.1:3000`. The Nginx preview listens only on `127.0.0.1:8080`. It does not modify DNS, the public default Nginx site or firewall/security group rules. On failure it restores the configuration it added and retains the staged files for inspection.

Readiness checks cover the root page, a static course page, the release marker and a media redirect. Successful installation ends with `PREVIEW_READY`. Runtime logs: `journalctl -u learningwithrachel`.

Full redirect verification from a checkout:

```
ALIYUN_TEST_URL=http://127.0.0.1:8080 node scripts/verify-aliyun-routes.mjs
```

## Public preview after local readiness

Run `bash deploy/aliyun/enable-public-preview.sh` on the server from an audited copy. It configures only `preview.negentropylearning.com.cn` on port 80 and keeps the public production domain unchanged. It verifies the website with a local Host header request. Next, create a DNS-only A record for `preview` pointing to the ECS public IPv4, ensure inbound TCP/80 and 443 are permitted, then issue a certificate and test HTTPS. Disable or remove this host after the migration if no longer needed.

## Still required before production cutover

Verify the packaged runtime on the actual server, prepare a public hostname and HTTPS certificate, check security-group rules and filing details, test production-domain resource access, and only then change DNS. Keep Vercel available for rollback. If changing the asset host later, migrate resources separately and retest CORS and audio range requests. This first-install script intentionally does not implement upgrades or automatic DNS changes.
