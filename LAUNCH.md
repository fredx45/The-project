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

- Check **https://holdorhike.com** loads the game
- Send me the date you want on the privacy policy — it is the last unfilled
  field, and you should not apply to AdSense until it is done

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
- [ ] **Tax.** Ad revenue, however small, is self-employed income and brings a
      self-assessment obligation.
- [ ] **ICO data protection fee** (~£52/year). Ads and analytics are commercial
      processing, so check the ICO's self-assessment tool before launch.

---

## 1. The last written field

Operator and contact address are both filled in. One placeholder remains, in the
block at the top of `privacy.html`. It renders in loud amber on the live page
until replaced, so it cannot be missed.

| Placeholder | Files | Replace with |
|---|---|---|
| `[date you publish]` | `privacy.html` | The date you actually publish, e.g. `12 August 2026`. |

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

## 3. Apply to AdSense

Do this only once the domain resolves and the pages above are filled in — a site
with bracketed placeholders will be rejected.

1. Create the account and add the site.
2. Put your publisher ID into `ads.txt`, replacing `pub-REPLACE_ME`. The file
   must be reachable at `https://holdorhike.com/ads.txt`.
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
