// passkey.catbird.blue: the WebAuthn relying-party host for Catbird's passkey
// recovery method. It serves exactly three association files and nothing else,
// so no page on this origin can ever run script that requests the passkey.
//
//   /.well-known/apple-app-site-association  iOS / macOS apps allowed to use the passkey
//   /.well-known/assetlinks.json             Android apps allowed to use the passkey
//   /.well-known/webauthn                    web origins allowed to use the passkey
//                                            (WebAuthn Related Origin Requests)
import appleAppSiteAssociation from "../well-known/apple-app-site-association.json";
import assetLinks from "../well-known/assetlinks.json";
import webauthn from "../well-known/webauthn.json";

const FILES = new Map([
  ["/.well-known/apple-app-site-association", appleAppSiteAssociation],
  ["/.well-known/assetlinks.json", assetLinks],
  ["/.well-known/webauthn", webauthn],
]);

const BASE_HEADERS = {
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
  "strict-transport-security": "max-age=31536000",
};

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(null, {
        status: 405,
        headers: { ...BASE_HEADERS, allow: "GET, HEAD" },
      });
    }

    const file = FILES.get(new URL(request.url).pathname);
    if (file === undefined) {
      return new Response(null, { status: 404, headers: BASE_HEADERS });
    }

    const body = JSON.stringify(file);
    return new Response(request.method === "HEAD" ? null : body, {
      status: 200,
      headers: {
        ...BASE_HEADERS,
        "content-type": "application/json",
        "cache-control": "public, max-age=3600",
      },
    });
  },
};
