# Catbird Privacy Policy — review draft (Nest-verified)

**Review draft revised 7 October 2026. Not published or in effect.** Effective date: **[actual publication date]**.

This revision starts from the Appendix A draft in the 7 October website handoff and corrects it against the Nest server that was running in production on 7 October 2026 (release `legacy-handoff-20260912`, started 12 September). Statements marked **[On Nest deploy]** describe behaviour in the reviewed but undeployed Nest patch (jj workspace `nest-privacy-20261007`). Replace them only after that release is live and verified. Remove every bracketed note and the closing review section before publication.

## Who we are and what this policy covers

Catbird is an independent app for Bluesky and the AT Protocol network. This policy covers Catbird Lite for iPhone and iPad, Catbird's supporting services and catbird.blue. "Catbird," "we" and "us" mean **Josh LaCalamito, United States**. For privacy requests, support or abuse involving Catbird's services, contact **[hi@catbird.blue](mailto:hi@catbird.blue)**.

Your account provider, also called a Personal Data Server or PDS, hosts your account. Bluesky and other network services handle feeds, ordinary Bluesky messages and other network functions under their own policies. For Bluesky-hosted services, see [Bluesky's Privacy Policy](https://bsky.social/about/support/privacy-policy). This policy does not govern every independent service or person who receives public network content.

## Sign in and account requests

Nest is Catbird's server. In the normal OAuth sign-in flow, Catbird opens your account provider's authorization page. You enter your password there and authorize access; your password goes to that provider. Nest receives the upstream OAuth session credentials. Your device keeps a separate credential for its Nest session.

Most authenticated actions pass through Nest to the relevant account or network service. Nest can read the requests and responses it forwards, including posts, uploads and ordinary Bluesky direct messages. Nest does not save the bodies of the requests and responses it relays to its database or logs; it records the technical details described under "Server logs" below.

**Ordinary Bluesky direct messages are not end-to-end encrypted.** Nest can read messages it relays. Catbird Lite does not include MLS encrypted chat or Circles.

Some requests go directly from your device to other services, including media and image servers, identity discovery, public account lookups, link-card extraction and video upload. Direct video upload can use a short-lived service authorization token on your device. When you load an embedded player or follow a link, the destination service receives that request. A direct recipient can receive your IP address and the information sent with the request.

[Review: Appendix A said GIF searches use "Catbird's forwarding service." Nest contains no GIF code. Confirm which component serves `/klipy/*` on catbird.blue before keeping that sentence.]

## Information used to provide Catbird

| Information | How it is used and where it is handled |
| --- | --- |
| Account and session information | Account identifiers such as your DID, handle and provider address; OAuth authorization state; upstream session credentials; and the Nest session binding support sign-in, authenticated actions and access revocation. |
| Account actions and content | Posts, messages, media, searches, reactions, profile changes and other requested actions pass through the services needed to perform them. Nest processes the content it relays; direct recipients receive their own requests. |
| Device and notification information | Apple push tokens, account/device associations, notification preferences, activity subscriptions, thread and conversation mutes, and delivery information support notifications and routing. |
| Preferences and feed feedback | Selected interests, feed preferences and supported interaction feedback help provide suggestions and personalize relevant feeds. Some preferences are synchronized with account services. |
| Local app information | The app keeps credentials, settings, caches and drafts on your device. Optional remote draft synchronization sends draft information to the upstream draft service through the authenticated request path. |
| Technical information | Network requests, errors, rate-limit and security information, operational metrics and app diagnostics help operate and diagnose Catbird. |
| Support information | If you contact us, we receive your message, email address, account information you supply and any attachments. Do not send a password or session token. |

Catbird uses this information to perform your requested actions, keep sessions working, deliver enabled features, protect its services, diagnose problems and handle support or privacy requests.

## Notifications and background access

If you allow notifications, Catbird registers your device and stores the account and device information and preferences needed to route them. Your iOS notification permission and Catbird's notification preferences affect alerts.

Nest uses your stored authorization while the app is closed to process enabled social notifications, including checking your mute and block relationships with the account that triggered a notification. Apple receives the push token and alert payload needed for delivery. Social alerts can include an actor's display name and handle, an excerpt of up to 160 characters of a public post, and routing identifiers.

**Direct-message push notifications are currently switched off.** Nest's chat polling service has not run in production since at least 11 September 2026; its release gate is closed. You can still read and send ordinary Bluesky messages in the app. This switch is separate from social push notifications. It does not mean that earlier notification registrations, preferences or delivery records have been deleted.

Notifications waiting to be sent are normally removed when they are delivered or dropped, and in any case after about 24 hours. Notification delivery can be delayed or fail.

## Feeds and optional features

Catbird uses your interest choices and feed and account information to provide suggestions. Supported feed generators can receive post identifiers, interaction events, feed context and request identifiers through authenticated requests. Feedback can include seen, like, repost, reply, quote and show-more/show-less events. This feedback path is used for Discover, Video and custom feeds that declare support; ordinary timelines, lists and author feeds do not use it.

Remote draft synchronization is off by default. Enabling it sends draft information through the authenticated path to the upstream draft service. Disabling synchronization stops new synchronization; it does not itself delete earlier remote copies.

Ask Catbird, generated alt text and other supported Apple Intelligence features depend on device and system support. Account actions you approve can still use the ordinary authenticated network services described above. Review generated output before posting or relying on it.

## Server logs and automatic diagnostics

Nest records technical information about the requests it serves. Its logs include account identifiers (DIDs), the type of request, the address of your account provider, and rate-limiting information that can include your IP address. Logs currently also include the parameters of relayed requests, such as the accounts, conversations or feeds a request refers to and pagination cursors. **[On Nest deploy: replace the previous sentence with "Logs record the names of request parameters, not their values."]** Logs do not include the bodies of relayed requests or responses.

Server logs are kept on the server until they are rotated out by size. They are not deleted after a fixed number of days. **[Publication check: either set a time-based limit (proposed: 30 days) and state it here, or state the size-based behaviour and the typical age of the oldest entry.]**

Catbird uses **Sentry** in the app for automatic crash, app-hang, error and sampled performance diagnostics. Reports can include the app and build version, device and system information, technical errors, diagnostic breadcrumbs, network information and an SDK installation identifier. Nest itself does not send data to Sentry or another error-reporting service.

The app does not attach a Sentry user profile and attempts to redact AT Protocol DIDs from selected diagnostic fields. This is limited redaction. Reports are not guaranteed to be anonymous, and the filtering does not guarantee removal of every URL query value, nested field or SDK-generated value.

The reviewed app configuration sends diagnostics automatically and has no in-app diagnostic off switch. **[Publication check: confirm the submitted build's Sentry configuration and the Sentry project's retention setting.]**

On supported systems, Catbird's MetricKit manager logs technical summaries locally; it does not upload the received payloads. You can choose to export local system logs and pick a sharing destination. These exports are separate from automatic diagnostics and do not use the same DID redaction. Check exported text before sharing it.

## Other services and the website

Nest contacts your account provider and its authorization server, identity services (the PLC directory and DNS or `.well-known` lookups), Bluesky's public API for public profile information, and Apple Push Notification service. Your PDS forwards some requests to Bluesky's AppView and chat service on Nest's behalf. Catbird also works with feed generators and the moderation services you use. These services process the requests sent to them under their own practices.

Catbird uses an infrastructure provider to host its website and supporting services, Sentry for app diagnostics, and Apple for push delivery. Where optional one-time support tips are available, Apple processes purchases through the App Store. Catbird does not operate Apple's payment flow.

The website uses browser local storage to remember the selected theme. Hosting and network services receive the technical requests needed to deliver the site.

Information may be processed outside your country by the services involved. **[Publication check: name the hosting provider and server location (netcup, Germany, per the server's timezone; confirm) and any required regional disclosures.]**

## Security and retention

Catbird's production connection to Nest uses HTTPS. Encryption in transit protects the connection; a server receiving the connection can still read its contents.

Nest stores your OAuth session credentials encrypted (AES-256-GCM) and decrypts them to perform the actions you request. Nest's notification database currently also stores an unencrypted identifier for the session used for notifications. **[On Nest deploy, plus the separately approved database clean-up: replace with "Nest's notification database stores a one-way fingerprint of that session, not the session identifier itself."]** No system can guarantee absolute security.

How long Nest keeps information:

| Information | How long |
| --- | --- |
| Sign-in session | Until you sign out, or 30 days after it was last used |
| Sign-in requests in progress | Up to 10 minutes |
| Notifications waiting to be sent | Until delivered or dropped, and no longer than about 24 hours |
| Mute and block checks for notifications | Up to 1 hour |
| Rate-limiting records (can include your IP address) | In memory, about 2 minutes after your last request |
| Notification account record, notification preferences, activity subscriptions, thread and conversation mutes | Until removed. These are kept after sign-out so they apply again when you sign back in |
| Device push registrations | While active; inactive registrations are kept until removed (at most 20 per account) |
| Server logs | See "Server logs" above |
| Support email | [Publication check] |

**[Publication check: the "until removed" rows describe the current behaviour honestly but give no end point. Before publication either (a) deploy the proposed retention rules (revoked notification accounts with no active device removed after 180 days; inactive device registrations after 90 days; orphaned chat-notification state after 30 days) and describe them here, or (b) keep the current wording. Do not promise deletion that is not running.]**

Nest's session store is saved to disk as periodic snapshots on the same server, so a deleted session can persist in a snapshot until the next one is written. **[Publication check: confirm whether netcup or any other process keeps off-server backups or snapshots of the server, and for how long.]**

## Your choices and privacy requests

You can manage notification permission in iOS Settings and notification preferences in Catbird. You can choose your feeds and moderation services, keep remote draft synchronization off, and decide whether to share local logs or support attachments. Account-provider authorization and provider privacy settings remain separate.

To ask about, correct or request removal of information Catbird holds about your account, email **[hi@catbird.blue](mailto:hi@catbird.blue)** with enough information to identify your account and request. Do not send a password or session token. We may need to verify that you control the account before handling an account-related request.

**[Publication check: a deletion tool covering Nest's notification records has been built (Nest `account_data` command, undeployed) but no request has been carried out with it. Once it has been deployed and exercised, state what a request removes, how ownership is verified, how long it takes, and that server logs and snapshots age out on their own schedule. Until then, do not promise a deletion outcome or timeline.]**

Contacting Catbird does not itself delete your provider account or public copies held by other services. Depending on your location, you may have rights concerning access, correction, deletion, restriction or other handling of personal information. Contact us so your request can be assessed under the rules that apply.

## Sign out and provider account deletion

To sign out, open Settings → Account & Security → Sign Out. The app first asks Nest to stop notifications to this device, then signs out. When Nest handles the sign-out, it deletes your stored OAuth session and its indexes and attempts to revoke its access at your account provider. That revocation attempt can fail independently. **[On Nest deploy: add "If it fails, Nest keeps an encrypted copy of the authorization for up to 7 days solely to retry the revocation, then deletes it."]** The app clears local authentication even if the server request fails, so appearing signed out does not confirm server cleanup.

If this device's sign-in was the one your account's notifications were linked to, signing out currently stops notification processing for the whole account until you sign in again on another device. **[On Nest deploy: replace with "Signing out stops notifications to the devices registered by that sign-in. Your other signed-in devices keep receiving notifications."]**

Signing out does not delete your provider account, your notification preferences, mutes or subscriptions, or other records described above. Removing an account that is not currently active in the app deletes it from the device only; it does not sign it out of Nest. Uninstalling the app does not itself send Nest a sign-out or data-removal request; Keychain items may remain separately from the app's files.

Settings → Account & Security → Delete Account opens a provider account-management website. Complete permanent account deletion through your provider's supported process. Opening a website does not itself delete the account, and Catbird cannot confirm completion. Deleting your provider account does not automatically remove the records Catbird holds; email us to request that.

Account deactivation is reversible. Deleting only a chat account is narrower than deleting the provider account. Public content may remain with other people or independent network services.

## Eligibility and policy changes

You must meet your account provider's eligibility rules and the requirements that apply where you live. An App Store age rating is not itself an account-eligibility rule.

Revised policies will be published with an updated effective date. Any additional notice or consent required for a change will be handled under the applicable requirements.

Operator: **Josh LaCalamito, United States**. Contact: **[hi@catbird.blue](mailto:hi@catbird.blue)**. General announcements: **[@catbird.blue](https://bsky.app/profile/catbird.blue)**. Use email for private account-related information rather than a public mention or issue.

---

## Review notes — remove before publication

**Verification basis (7 October 2026, read-only):** systemd unit and drop-ins for `catbird-nest-prod.service`; allowlisted, non-secret environment variables of the running process; strings in the running binary; journald configuration and line counts (no log content copied); Valkey `CONFIG GET save`/`appendonly`; row counts and column lists in the push database; source of the matching Nest revision (`e3eefb5b` plus the Sept 12 sign-in compatibility edits, reconstructed as `kzyxuuul` in the review workspace).

**Facts behind the changed statements:**
- Relayed request bodies: only a structural "shape" (keys and types) is logged, never values. Query strings were logged at info level on 8,221 of 10,687 relayed requests in the 24 hours checked.
- Logs: journald with default settings (size-capped, no time limit, 1.7 GB in use); the oldest Nest entry is from 11 September 2026.
- Session identifier copies: all 207 rows of `push_accounts` hold a raw session identifier, including 29 already revoked. The column is `NOT NULL`, so the manual scrub has not been run.
- DM push: `CATBIRD__PUSH__CHAT_POLL_ENABLED=true`, release-gate variable absent; both September 12 starts logged "release gate is CLOSED"; "Chat poll service started" never appears in the journal.
- Background access: Nest calls the authenticated `getProfile` through the recipient's PDS for social pushes, independently of the chat gate.
- Snapshots: Valkey RDB save (`3600 1 300 100 60 10000`), AOF off. No Postgres or Valkey backup timer or cron job was found on the host.
- Shared database also holds tables from the retired push notifier: `relationship_audit_log` (26,488 rows, 2 April 2025 – 19 March 2026, includes device tokens), encrypted and hashed mute/block mirrors, `post_cache` (includes post text with an expiry column), `did_cache`, `notification_preferences`. They are not described above. **Decide before publication:** delete them under the proposed retention rules, or describe them.
- Sign-in compatibility switches `NEST_ALLOW_MISSING_DIRECT_OAUTH_COOKIE` and `NEST_LEGACY_DIRECT_OAUTH_HANDOFF` are both enabled in production. The 7 October App Store polish handoff says they were not deployed; that statement is wrong. They do not change this policy's data categories but are a security-posture decision.

**Not verified:** the content of `push_event_queue` rows written by catbird-firehose (whether social events carry post text while queued); provider-level backups; Sentry project retention; the component behind `/klipy/*`; whether the deployed catbird-firehose matches its source.
