# Launch checklist

## Doing this on your phone

Three jobs, in this order. DNS first — GitHub checks it, so doing Pages first
just gives you an error. All of it in Safari; the Cloudflare app cannot edit DNS.

### 1. DNS (Cloudflare, ~5 minutes)

1. Safari → **dash.cloudflare.com** → sign in
2. Tap **holdorhike.com**
3. Tap **DNS** → **Records**
4. Delete any **A** or **CNAME** record already sitting on `@` or `www`
5. **Add record** five times:

| Type | Name | Points to |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `fredx45.github.io` |

**The thing that catches everyone out:** each record has a cloud icon. It must be
**grey (DNS only)**, never orange. Tap it to toggle. An orange cloud means
Cloudflare proxies the traffic, which stops GitHub issuing the HTTPS certificate
— and it fails in a way that is hard to diagnose.

### 2. GitHub Pages (~3 minutes, then up to an hour of waiting)

**This is the step that makes the site public.** Nothing before it is visible to
anyone.

1. Safari → **github.com/fredx45/The-project**
2. Tap **aA** in the address bar → **Request Desktop Website**. The mobile
   layout hides parts of Settings, so this matters.
3. **Settings** → find **Pages** in the left sidebar
4. Source: **Deploy from a branch**
5. Branch: **claude/boe-governor-game-2h8qag**, folder **/ (root)** → **Save**
6. Custom domain: `holdorhike.com` → **Save**
7. Wait for the DNS check to pass (a few minutes), then tick **Enforce HTTPS**

If the site looks broken straight after, that is normal — the certificate can
take up to an hour.

### 3. Email forwarding (Cloudflare, ~5 minutes)

1. **dash.cloudflare.com** → **holdorhike.com** → **Email** → **Email Routing**
2. **Get started**
3. Create the address `hello` and forward it to your normal inbox
4. Cloudflare emails that inbox a verification link — tap it

Cloudflare adds its own mail records automatically. They do not clash with the
records from step 1.

### Then

The site is live and the AdSense tag is on it. What is left is waiting for
Google's review, then sending me the three ad unit IDs — see section 3.

---

Everything still outstanding before this site can go live with ads, in the order
worth doing it. Run `node preflight.js` at any point to see what is left.

## Decisions already taken

| | |
|---|---|
| **Operator** | **Hold or Hike** — a trading name, sole trader, no company |
| **Domain** | **holdorhike.com** — purchased, wired into the site |
| **Contact** | `hello@holdorhike.com` — in the pages; still needs the forwarding rule creating |
| **Ad network** | Google AdSense |
| **Analytics** | Google Analytics 4 |
| **Tips** | [buymeacoffee.com/holdorhike](https://buymeacoffee.com/holdorhike) — results screen and every footer |

Two things about the operator choice, recorded so they are not rediscovered the
hard way later:

- A sole trader may use a trading name without registering anything. But an
  ad-funded site is an "information society service" under the E-Commerce
  Regulations 2002, which expect the provider's real name and a geographic
  address to be accessible — and under UK GDPR the data controller is the
  individual regardless of the name over the door. **This gap was accepted
  deliberately.** Practical risk is low and enforcement is complaint-driven, but
  it is a gap. Incorporating, with a registered-office service, is the clean fix
  if that ever matters.
- Avoid "bank" in any business name — it is restricted under financial services
  legislation. Avoid "Threadneedle" too: it is an active trademark in financial
  services. The same reasoning is why the domain does not contain
  "bankofengland", even though the game keeps that title.

---

## 0. Before spending any money

- [ ] **Chain-of-command approval.** An ad-funded site is a secondary occupation
      with income attached and will normally need permission. If the answer is
      no, none of the rest matters — so ask first.
- [ ] **Tax.** Ad revenue and tips alike, however small, are self-employed
      income and bring a self-assessment obligation. Donations are generally
      outside the scope of VAT, unlike selling access to something — which is
      what made the paywall idea awkward and the tip jar simple.
- [ ] **ICO data protection fee** (~£52/year). Ads and analytics are commercial
      processing, so check the ICO's self-assessment tool before launch.

---

## 1. Written fields — done

Operator, contact address and the last-updated date (10 August 2026) are all
filled in. No placeholders remain on any page.

## 2. Hosting — reference

Done in the repo already: every absolute URL points at `https://holdorhike.com`
and the `CNAME` file exists. What is left is the dashboard work in the phone
guide above. The values, for reference:

**DNS** — four A records on the apex, pointing at GitHub:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Plus a `CNAME` record for `www` pointing at `fredx45.github.io`.

**Pages**: Settings → Pages → Deploy from a branch →
`claude/boe-governor-game-2h8qag` → `/ (root)`, custom domain
`holdorhike.com`, then Enforce HTTPS once the certificate is issued.

All records must be **DNS only** in Cloudflare, not proxied.

## 3. AdSense — awaiting review

Done: publisher ID `ca-pub-8246785320309196` is in `ads.txt` and in the `ADS`
config, and the loader tag is on the game plus all three written pages, so the
whole site carries it for review. The three slot values are deliberately empty,
which means **no ad unit renders yet** — the tag is present for verification
only.

Left to do, once Google approves:

1. **Ads → By ad unit → Display ads**, create three units (intro, banner,
   results), and send the three slot IDs. They go into:

```js
var ADS = { client: "ca-pub-8246785320309196",
            slots: { intro: "…", banner: "…", results: "…" } };
```

2. **Privacy & messaging → GDPR message** — create and publish it. This is the
   UK/EEA consent banner, it is required before ads may serve here, and it needs
   no code change: it ships through the ad tag already on the site.

**Never click your own ads**, not even to check they work. It is the quickest
route to a permanent ban.

Realistic expectation: two to four weeks, rejection on first attempt is common,
and UK rates for a game like this run about £1–3 per thousand views.

## 3a. If AdSense rejects

Rejection is common and not the end. In order of what to try:

1. **Fix and reapply.** There is no limit on attempts, and AdSense pays better
   than every alternative below, so it is worth two or three goes. The usual
   reason given is "low value content": add real writing, wait a couple of
   weeks, resubmit. The FAQ and how-it-works pages exist for exactly this.
2. **Ezoic.** Accepts much smaller sites, respectable rates, but it inserts its
   own layer via Cloudflare or a script and can be heavy-handed with a carefully
   built mobile layout.
3. **Media.net.** Contextual ads from the Yahoo/Bing network. Standards similar
   to AdSense, and it earns mainly on US traffic, which this site will not have
   much of.
4. **A direct sponsor.** At low volume this beats programmatic. One "supported
   by" line sold to a fintech or an economics newsletter can be worth more than
   months of ad pennies, and it suits the audience.
5. **A tip jar.** No approval, no review, five minutes.

**Deliberately not used:** Adsterra, PropellerAds and similar. They approve
almost anyone but lean on pop-unders and redirects, which would wreck a clean
three-minute game.

The honest bottom line: traffic matters far more than the network. An approved
site with no visitors earns nothing.

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
- [ ] `https://holdorhike.com/ads.txt` returns plain text
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
