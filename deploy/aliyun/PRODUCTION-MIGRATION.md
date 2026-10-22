# Alibaba ECS production cutover

The preview site must be healthy before starting. Keep Vercel and the existing root/www DNS records in place until the origin is tested with local --resolve requests.

## 1. Issue the production certificate before cutover

In Cloudflare, create a user API token scoped to the single zone negentropylearning.com.cn, with Zone > DNS > Edit and Zone > Zone > Read. Do not paste the token into a chat or command line argument. Run issue-production-certificate.sh from a reviewed copy on the ECS Workbench terminal. It installs the Ubuntu Cloudflare Certbot plugin, asks for the token without echoing it, stores it under /root/.secrets/certbot/cloudflare.ini with mode 0600, tests the DNS-01 challenge with Let's Encrypt staging, and then issues one certificate covering the apex and www. The script does not change live A or CNAME records.

## 2. Prepare Nginx for the real hostnames

Run enable-production-domain.sh from a reviewed copy. It refuses to run without the certificate, adds separate HTTP and HTTPS vhosts for both names, checks nginx -t, reloads Nginx, and verifies both names locally through curl --resolve. Public DNS is still unchanged. It also adds a Certbot deploy hook to reload Nginx after future renewals.

Run certbot renew --dry-run to check automatic renewal. Confirm that https://preview.negentropylearning.com.cn/ still works and the current public website remains on Vercel.

## 3. DNS cutover

In Cloudflare DNS, leave assets (the R2 record) and preview untouched. Change the apex A record from 216.198.79.1 to 8.137.172.103 and leave it DNS-only. Change www from its Vercel CNAME ed73c2757aea5722.vercel-dns-017.com to a CNAME for negentropylearning.com.cn, also DNS-only. Do not change the Alibaba registrar or nameservers.

Check HTTPS, home, course pages, images and audio on both formal names. Check /release-version.json returns weekly-2026-10-22 and server responses come from Nginx. Keep Vercel available temporarily for rollback.

## Rollback

If the new origin fails, restore exactly the prior Cloudflare records: apex A 216.198.79.1 (DNS-only) and www CNAME ed73c2757aea5722.vercel-dns-017.com (DNS-only). Leave the ECS files, R2 assets and certificates in place for diagnosis. DNS caches may take time to honor the reverted records.
