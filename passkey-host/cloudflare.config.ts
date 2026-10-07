// passkey.catbird.blue: WebAuthn relying-party host (association files only).
// Deploy with `npx cf deploy` from this folder. The custom domain below makes
// Cloudflare create the DNS record and certificate for the hostname.
// `wrangler.toml` beside this file describes the same Worker for Wrangler; `cf` ignores it.
import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "catbird-passkey-host",
    entrypoint: "src/index.js",
    compatibilityDate: "2026-10-01",
    domains: ["passkey.catbird.blue"],
  },
});
