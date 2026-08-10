# Launch checklist

Everything still outstanding before this site can go live with ads, in the order
worth doing it. Run `node preflight.js` at any point to see what is left.

---

## 1. Fill in the three written fields

All three live in one block at the top of `privacy.html`, plus the contact
address in `about.html`. They render in loud amber on the live page until
replaced, so an unfilled field is obvious.

| Placeholder | Files | Replace with |
|---|---|---|
| `[your name or company]` | `privacy.html` | Your name, or the company name if you have one. UK GDPR needs a real identifiable operator. |
| `[your email address]` | `privacy.html`, `about.html` | A contact address. Prefer a dedicated one — a published address gets scraped hard. |
| `[date you publish]` | `privacy.html` | The date you actually publish, e.g. `12 August 2026`. |

## 2. Buy a domain and point it at GitHub Pages

AdSense will not approve a `github.io` subdomain, so a real domain comes first.

Swap the placeholder host everywhere in one command, from the repo root:

```sh
grep -rl 'example\.com' --include='*.html' --include='*.xml' . \
  | xargs sed -i 's|https://example\.com|https://YOURDOMAIN|g'
```

Then create a `CNAME` file at the repo root containing just your domain:

```sh
echo 'yourdomain.co.uk' > CNAME
```

**DNS at your registrar** — four A records for the apex, pointing at GitHub:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Plus a `CNAME` record for `www` pointing at `fredx45.github.io`.

**Enable Pages**: repo Settings → Pages → Source: Deploy from a branch →
`claude/boe-governor-game-2h8qag` → `/ (root)`. Tick "Enforce HTTPS" once the
certificate has been issued (can take an hour).

## 3. Apply to AdSense

Do this only once the domain resolves and the pages above are filled in — a site
with bracketed placeholders will be rejected.

1. Create the account and add the site.
2. Put your publisher ID into `ads.txt`, replacing `pub-REPLACE_ME`. The file
   must be reachable at `https://yourdomain/ads.txt`.
3. Create three display units and paste the IDs into the `ADS` object near the
   top of the script in `index.html`:

```js
var ADS = { client: "ca-pub-XXXXXXXXXXXXXXXX",
            slots: { intro: "1234567890", banner: "2345678901", results: "3456789012" } };
```

While `client` is empty, the slots stay inert placeholders and nothing external
loads — so it is safe to deploy before approval.

4. In the AdSense console, turn on **Privacy & messaging → GDPR message**
   (Funding Choices). This is the UK/EEA consent banner and is required. It
   ships through the ad tag; no code change needed.

**Never click your own ads**, not even to check they work. It is the quickest
route to a permanent ban.

Realistic expectation: two to four weeks, rejection on first attempt is common,
and UK rates for a game like this run about £1–3 per thousand views.

## 4. Turn on analytics

Create a GA4 property, then set the measurement ID in `index.html`:

```js
var GA = { id: "G-XXXXXXXXXX" };
```

Four events are already wired: `term_start`, `term_complete` (with score, rating
and crisis count), `medal_earned`, `share_result`. The privacy policy already
describes them.

## 5. Launch-day checks

- [ ] `node preflight.js` exits clean
- [ ] All four pages load over HTTPS: game, how-it-works, about, privacy
- [ ] `https://yourdomain/ads.txt` returns plain text
- [ ] Paste the URL into Slack or WhatsApp — the preview card should show
      `share.png`, not a bare link
- [ ] Play a full term on a real phone, then tap SHARE RESULT and confirm the
      share sheet opens
- [ ] The consent banner appears on first visit from a UK IP

## 6. Where the players are

Free, on your own domain, with the share grid doing the work:

- **FT Alphaville** — squarely their register, and worth more than any other
  single mention
- **Hacker News** — "Show HN: I built a game where you run the Bank of England"
- **r/ukpolitics, r/badeconomics, r/AskEconomics**
- **Econ Twitter/Bluesky** — the MoneyWeek, IFS and economics-commentator orbit

Post the same week, not spread out — one coordinated push gives the share grid
the best chance of compounding.
