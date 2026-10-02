# Legal pages: open questions for Josh

The site now has draft versions of `/privacy` and `/terms`, built from what the Catbird 1.0 code and Catbird's servers actually do. Both pages show "Draft — not yet in effect", are marked `noindex`, and show a "To be completed before publication" box with every missing detail. Nothing has been published.

This file lists every decision only you can make. Each item quotes the exact sentences on the pages that it affects, so you can see what changes when you answer. Answer the items in the first group before anything goes live. The second group needs a decision, but each one has a safe default.

- Governing plan: `docs/execution-plans/2026-10-02-catbird-website-plan.md`, §4 (privacy and terms corrections) and §7 decision D2 (publishing the legal text).
- Evidence: `docs/research/2026-10-02-catbird-website-research.md`, the "privacy-truth" report and its fact-check.
- Pages: `website/src/pages/privacy.astro`, `website/src/pages/terms.astro`. Shared parts are in `website/src/components/legal/`.
- Config: every missing value is `null` in `website/src/config.ts` (`LEGAL`, `PRIVACY_EMAIL`, `SUPPORT_EMAIL`). Fill a value there and the page renders it, and the "To be completed" box drops that line. No page edit is needed.

**Jargon used below:**
- **Nest:** Catbird's sign-in and request server at `api.catbird.blue`.
- **DID:** a user's permanent account ID on the AT Protocol network.
- **PDS:** the server that hosts a user's account, usually Bluesky's.

---

## A. Required before publishing (plan §4.3 and decision D2)

### A1. Who the data controller is: name, address, country (plan §4.3 item 1)

**Why it matters:**
- The person or company named here is legally responsible for the data.
- The country decides whether GDPR applies directly, the EU Digital Services Act obligations (contact points, and an EU legal representative if you have no EU establishment), and Apple's EU trader declaration. That declaration publishes an address, phone number and email on EU App Store pages.
- The git author is "Josh LaCalamito", but `LICENSE` says "Josh LaCal". Pick the legal name.

**Set:** `LEGAL.controllerName` and `LEGAL.postalAddress` in `src/config.ts`. A P.O. box is fine if your jurisdiction allows it.

**Affected sentences:**
- Privacy, "Who we are": "The person responsible for your data (the data controller) is [legal name], at [postal address]."
- Privacy, "Contact": "Post: [legal name and postal address]"
- Terms, "Accepting these terms": "“Catbird”, “we” and “us” mean [legal name], the person responsible for Catbird."
- Terms, "Contact": "Post: [legal name and postal address]"
- Terms, "Open-source license": the MIT text is quoted exactly from `LICENSE`, "Copyright (c) 2025 Josh LaCal". It stays as written unless you change `LICENSE` itself.

**Default if unanswered:** the pages stay drafts.

### A2. Governing-law jurisdiction

**Set:** `LEGAL.jurisdiction`, for example "the State of New York, United States". Use the exact wording you want after "the laws of".

**Affected sentence:**
- Terms, "Governing law": "These terms are governed by the laws of [governing-law jurisdiction]."

**Default if unanswered:** the terms stay a draft.

### A3. A monitored contact email

**Why it matters:** Apple's Support URL rules, Guideline 1.2 (social apps need published contact details), Bluesky's developer guidelines and the DSA all expect a monitored address. Plan D2 recommends `support@catbird.blue` and `privacy@catbird.blue` as iCloud aliases into one inbox. Whether those mailboxes exist is unknown.

**Set:** `PRIVACY_EMAIL` and/or `SUPPORT_EMAIL`. The privacy page uses `PRIVACY_EMAIL`, falling back to `SUPPORT_EMAIL`. The terms page uses `SUPPORT_EMAIL`, falling back to `PRIVACY_EMAIL`.

**Affected sentences:**
- Privacy, "Your choices and rights": "Email [contact email] and tell us your handle. We may ask you to confirm that you control the account."
- Privacy, "Deleting your data": "…email us at [contact email]. Deletion is handled by hand when you ask, and we’ll reply when it’s done."
- Privacy, "Contact": "Email: [contact email]"
- Terms, "Reporting and blocking": "You can also report objectionable content or abusive users to Catbird directly by emailing [contact email]."
- Terms, "Contact": "Email: [contact email]"

**Default if unanswered:** the pages stay drafts.

### A4. Effective date

**Why it matters:** CalOPPA requires a fixed effective date. The old site printed the build date instead.

**Set:** `LEGAL.effectiveDate` as `YYYY-MM-DD`. Use the day the pages go live, or later.

**Affected text:** the "Effective date:" line under each page title.

**Default if unanswered:** the pages stay drafts.

### A5. Keeping users' Bluesky tokens on Nest, and App Review (plan §4.3 item 2)

**Why it matters:**
- Research quoted Guideline 5.1.1: apps "may not store credentials or tokens to social networks off of the device".
- Nest holds every user's access and refresh tokens server-side. That is exactly this pattern, even though it's the standard design for an OAuth confidential client.
- How App Review treats it is unknown. The policy discloses it plainly rather than hiding it.

**Affected sentences:**
- Privacy, "In short": "Catbird’s server, called Nest, keeps your sign-in tokens (encrypted) and relays most of what the app does with your account, including Bluesky direct messages."
- Privacy, "Your sign-in session": "After you approve Catbird, Nest receives and keeps your sign-in tokens (an access token and a refresh token), the private key used to prove those tokens belong to Catbird’s session, the permissions you granted, your DID, your handle and your account server’s address."
- Privacy, "Sign-in": "Your Bluesky sign-in tokens are not stored on your device; Catbird’s server holds them."

**Decision needed:** keep the disclosure as written (recommended; it's accurate), and decide whether to get a lawyer's view or explain the design in the App Review notes.

### A6. Deleting server-side data: manual process or code (plan §4.3 item 3)

**Why it matters:**
- No code deletes a user's rows from these tables: `push_accounts`, `push_preferences`, `activity_subscriptions`, `thread_mutes`, `chat_poll_state` or `chat_muted_convos`.
- Signing out doesn't remove them either. Inactive device rows are only pruned beyond 20 per account.
- The draft therefore promises manual deletion on request, plus a confirmation reply. You need a real, repeatable way to do that: a SQL runbook keyed by DID, covering Redis sessions too.
- You also need to decide how to verify that the requester controls the account.

**Affected sentences:**
- Privacy, "What signing out does": "Signing out does not delete your notification registration record, notification settings, activity subscriptions, thread mutes, muted conversations, or older inactive device records (up to 20 per account). We delete these when you ask; see Deleting your data."
- Privacy, retention table: "Notification registration, settings, activity subscriptions, thread mutes and muted conversations — Nest — Until you ask us to delete them. Inactive device records beyond the 20 most recent are deleted."
- Privacy, "Deleting your data": "Deletion is handled by hand when you ask, and we’ll reply when it’s done."
- Privacy, "Your choices and rights": "We may ask you to confirm that you control the account."
- Privacy, "Children": "If you believe Catbird’s servers hold data about a child who shouldn’t have an account, contact us and we’ll delete it."

**Recommended default:** keep the manual promise and write the runbook before publishing. If purge on sign-out and on request is built first, change these sentences to describe the automatic behavior.

### A7. Message (DM) notifications and reading users' Bluesky DMs (plan §4.3 item 4)

**Why it matters:**
- When the DM-notification gate opens (`NEST_CHAT_POLL_RELEASE_GATE=open` plus its config flag), Nest reads users' Bluesky DMs with their session to build alerts.
- It also puts up to 200 characters of message text in the push payload, and publishes the event, with the text, on Redis pub/sub.
- Calling `registerPush` already enrolls the user's DID and PDS host in the polling table today.

**Affected sentence:**
- Privacy, "Push notifications": "Notifications for Bluesky direct messages aren’t turned on yet. Registering for notifications does record your DID and account server address in a list Nest would use for message notifications. Before message notifications are turned on, this policy will be updated to explain how they work."

**Decision needed:** whether turning on DM notifications should require explicit in-app consent. Recommended: yes, a separate opt-in. The policy section must be written before the gate opens either way.

### A8. Production facts the policy can't state yet (plan §4.3 item 5)

Each item is marked "not yet defined" or "To be completed" on the page. Confirm it from the server or from Sentry's settings, then replace the text.

**Log retention, and Nest's production log level (`RUST_LOG`):**
- The policy describes info-level logging: the request type and query string, plus your DID at sign-in and sign-out.
- If production runs the code default (`catbird=debug,tower_http=debug`), request URIs are also traced. The sentence still holds, but confirm it.
- Affected: "Nest’s logs record each request’s type and its query parameters (for example, a search term or an account ID), and your DID when you sign in or out. … How long these logs are kept is not yet defined."
- Also the retention row "Server logs — Nest — Not yet defined".

**Sentry retention and IP storage (Sentry project settings):**
- Affected: "How long Sentry keeps reports is not yet defined."
- Also the retention row "Crash and performance reports — Sentry (United States) — Not yet defined".
- If Sentry stores IP addresses, add that to the list of what reports include.

**Backups of Postgres, Valkey and SeaweedFS:**
- Affected: the retention row "Backups of Catbird’s servers — Not yet defined — Not yet defined".
- If there are no backups, say so and remove the row.

**Netcup data-center location:**
- Affected: "Catbird’s servers are hosted by Netcup. The location of the data center is [data center location]."
- Once you know it, also name the transfer safeguards if GDPR applies (for example, the EU-US Data Privacy Framework for Sentry, if Sentry is certified).

**Website access logs (Caddy and Cloudflare):**
- Affected: "How long these logs are kept is not yet defined."
- Also the retention row "Website access logs — Not yet defined".

**Facts not disclosed on the page, because their production state is unknown:**
- **`push_accounts.session_id`:** unless `PUSH_ACCOUNTS_PHASE2_WRITERS` is set, Nest writes the raw bearer session ID into this column. The scrub migration in `nest/catbird/migrations_phase2/` is manual. If production still writes raw IDs, either fix it or add a sentence.
- **Legacy catbird-firehose tables:** `user_mutes_encrypted`, `user_blocks_encrypted`, their hashed variants, and `relationship_audit_log` (which holds device tokens) were never dropped. If they still hold rows, purge them. Disclosing them is the fallback.
- **Cloudflare in front of `api.catbird.blue` (plan §4.1 row 9):** confirm that Cloudflare proxies `api.catbird.blue`, not only the apex. Affected: the third-party table row "Cloudflare — For every connection to `catbird.blue` and its subdomains — Your IP address and the requests passing through its network".
- **The Klipy proxy:** the Caddy route forwarding `/klipy/v2/*` to Klipy is known only from a source comment (`GifPickerView.swift:9`) and from the live route answering 200. Confirm it before publishing. Affected: "GIF searches go to Catbird’s server at `catbird.blue`, which passes them to Klipy, the GIF service."

### A9. App Store privacy label vs. Sentry (plan §4.3 item 6)

**Why it matters:**
- `PrivacyInfo.xcprivacy` declares crash data and performance data as **not linked** to the user.
- But Sentry sign-in events include full DIDs, and the policy now says so.
- Either stop sending DIDs (and add an opt-out), or declare the data as linked in the privacy manifest and in the App Store Connect answers (plan D5).

**Affected sentences:**
- Privacy, "In short": "Crash and performance reports go to Sentry in the United States and can include your account ID. There’s no setting to turn them off yet."
- Privacy, "Crash and performance reports": "Reporting is on by default, and there is no setting in Catbird to turn it off today." and "sign-in and sign-out events, which include your full DID;"

**Recommended default:** add an in-app toggle and drop DIDs from Sentry extras. Then change these sentences to describe the toggle.

---

## B. Decisions with a safe default (decide before publishing; the drafts use the default)

### B1. A response time for reports sent to Catbird (Guideline 1.2)

**Why it matters:** Apple expects a response commitment. The research and plan don't support a specific number, so the draft says "promptly".

**Affected sentence:**
- Terms, "Reporting and blocking": "We review reports sent to Catbird promptly."

**Option:** if you can commit to it, write "within 24 hours".

**Default:** "promptly".

### B2. In-app purchases (tips and subscriptions)

**Why it matters:**
- The 1.0 code still contains StoreKit "Support Catbird" products (`AboutSettingsView.swift` in the 1.0 workspace).
- Whether they exist in App Store Connect is unknown, and decision D4 (tips only) isn't recorded.

**Current draft:** no purchase section in the terms.

**If tips ship, add a terms section covering these points:**
- purchases are processed by Apple under Apple's terms;
- they don't unlock features;
- refunds go through Apple;
- for subscriptions, how to cancel in iOS Settings.

**Default:** omitted.

### B3. Legal basis for each use of data (GDPR Art. 13)

**Why it matters:** the policy describes purposes but names no legal basis, because that depends on your jurisdiction.

**Suggested bases:**
- **Performance of a contract:** sign-in, relaying requests, notifications you asked for.
- **Legitimate interests:** crash reports, server logs, rate limiting.
- **Consent:** notification permission, embedded media you allow.

**Default:** omitted until A1 is answered.

### B4. Contacts permission string

**Why it matters:**
- The 1.0 project still declares `NSContactsUsageDescription` (`Catbird.xcodeproj/project.pbxproj:1064,1156` in the 1.0 workspace).
- Contact-matching code exists, but no screen presents it.
- The policy says nothing about contacts, because plan §4.1 row 8 allows "doesn't read your contacts" only after the string and code are removed.

**Default:** no contacts sentence. Remove the string from the app, then optionally add "Catbird doesn’t access your contacts."

### B5. Account deletion in the app (plan B2, Guideline 5.1.1(v))

**Why it matters:**
- The app supports sign-up but offers only deactivation.
- The policy points users to their account server for deletion.

**Affected sentence:**
- Privacy, "Deleting your data": "For accounts hosted by Bluesky, you can delete your account in Bluesky’s own app. In Catbird you can deactivate your account in Settings > Account Settings…"

**To do:**
- Update this when in-app deletion lands.
- Also confirm that the Bluesky-app claim still holds when you publish. It's general knowledge, not something the research verified.

### B6. Commitments the draft makes that only you can promise

Each sentence below is a promise, not a fact from the code. Keep it, change it, or remove it.

- Privacy: "We use these reports only to find and fix problems."
- Privacy: "We’ll announce significant changes in the app or on Bluesky at @catbird.blue before they take effect."
- Terms: "…announce significant changes in the app or on Bluesky at @catbird.blue before they take effect."
- Privacy: "If a future version adds features that handle data differently, we’ll update this policy before that version ships."
- Terms: "We may limit or suspend access to these services to protect them or other users, or if you break these terms."

### B7. Not in the drafts, but worth deciding

These are left out because there's no evidence or decision behind them yet.

**A "we don't sell or share your personal data, and we show no ads" statement:**
- It's true of the code as read: there's no ad or analytics SDK, and nothing is sold.
- But it's a forward commitment, and CCPA-style wording has legal meaning. Add it if you want to promise it.

**Apple's Standard EULA:**
- Apple's Licensed Application EULA applies by default to apps without a custom EULA.
- Plan B3 (an in-app acceptance step for Guideline 1.2) is still missing.
- Decide whether the terms should reference Apple's EULA and whether the app needs an acceptance step.

**Trademarks:**
- Whether the Catbird name, icon and wordmark are excluded from the MIT license grant.
- The draft says only that the MIT License covers the source code.

**Disclaimers and liability:**
- The text is generic, "to the extent the law allows".
- It needs review for your jurisdiction, especially EU consumer law if A1 makes GDPR and the DSA apply.

### B8. Sitemap lists the drafts (outside the legal area)

**Why it matters:**
- `astro.config.mjs` (owned by the foundation) excludes only `/styleguide` and `/404` from the sitemap.
- So `/privacy` and `/terms` appear in `sitemap-index.xml` even though they're `noindex`.

**Fix:** exclude them while they're drafts, or accept it, since nothing is deployed.
