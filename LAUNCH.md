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

**Read this first: at current traffic there is no alternative to fall back on.**

Almost every other ad network sets a traffic floor, and they are high. Figures
believed correct but **worth checking yourself, because they change and one of
them has already caught us out** — Ezoic was checked in August 2026 and requires
**250,000 monthly visits**, having previously had a far lower bar. Mediavine and
Raptive are in the tens of thousands of sessions and upward. Media.net publishes
no hard floor but is selective, and earns mainly on US traffic this site will
not have.

AdSense having **no traffic minimum** is precisely why it is the target, and why
the answer to rejection is to fix and reapply rather than to shop around.

So, in order:

1. **Fix and reapply.** No limit on attempts. The usual reason given is "low
   value content": add real writing, wait a couple of weeks, resubmit. The FAQ,
   how-it-works and the three scenario articles exist for exactly this. The next
   pieces of writing, if more are needed, are a strategy guide and a 2022
   (Ukraine) scenario — the machinery takes one entry in `SCENARIOS` plus an
   article.
2. **Build traffic and reapply again.** Section 6. This is the real answer: it
   fixes the rejection reason and unlocks every other network at the same time.
3. **A direct sponsor.** The one option with no threshold. One "supported by"
   line sold to a fintech or an economics newsletter can beat months of
   programmatic pennies, and it suits the audience. Still needs enough traffic to
   be sellable, but that is hundreds a month, not hundreds of thousands.
4. **The tip jar.** Already live. No approval, no review, no minimum.
5. **Revisit the networks above** once traffic clears their floors.

**Deliberately not used:** Adsterra, PropellerAds, Monetag and similar. They
approve almost anyone, in hours, because they monetise with pop-unders, push
notifications and redirects.

**Adsterra, specifically — approved, deliberately not installed.** An account
was opened and on 14 August 2026 Adsterra approved holdorhike.com for two ad
units: **Popunder (placement 30697790)** and **Social Bar (placement
30697791)**. Neither tag is on the site and neither should be added while the
AdSense application is in review — those are exactly the two formats the
paragraph below is about. The decision is to wait for the AdSense outcome
first. If AdSense rejects and reapplying is abandoned, this can be revisited as
a deliberate choice; it should not be reversed by accident.

Be precise about why that matters, because the looser version of this claim is
wrong. **AdSense does not forbid running other ad networks** — plenty of
publishers run several side by side. The rule is that any page carrying AdSense
must comply with AdSense policy, and pop-unders, forced redirects and intrusive
interstitials breach it. So Ezoic or Media.net alongside AdSense would be fine
if you qualified; an Adsterra tag is what puts the application at risk. It would
also ruin a three-minute mobile game, which is reason enough on its own.

The honest bottom line: traffic matters far more than the network. At £1–3 per
thousand views, ten visitors is about two pence — and below a few hundred
thousand a month, most networks will not take you at any price. Section 6.

## 3b. Google Search Console — and the stale title

For a window in August the page title read "Hold or Hike — the Bank of England
game". It was removed on 10 August, but Google cached it and kept showing it in
results long after the site stopped saying it. Everything on the site now uses
**"Hold or Hike — a UK interest rate game"**, in the served HTML, the social
tags and the JavaScript alike — but a code change alone will not refresh
Google's copy.

1. **search.google.com/search-console** → Add property → **Domain** →
   `holdorhike.com`
2. It gives you a **TXT record** to add. Cloudflare → holdorhike.com → DNS →
   Add record → Type `TXT`, Name `@`, paste the value → Save → back to Google →
   **Verify**
3. **URL Inspection**, enter `https://holdorhike.com/`, then
   **Request Indexing**

Allow a few days. Search Console is also where you will see what people search
to find the site, which is worth having regardless.

**Why the title matters beyond this:** a short generic title invites Google to
write its own from page content. A descriptive one it can use as-is is the best
defence against it inventing another.

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

## 6. Getting people to play it

The site has been the easy part. This is the hard part, and it is worth being
systematic about rather than posting a link somewhere and hoping.

### The one distinction that matters

**A spike is one day. Recurring is every year.**

| | Channel | What it gives you |
|---|---|---|
| Spike | Reddit, Hacker News | Hundreds to low thousands in a day, then nothing |
| Recurring | Teachers, search | Less at first, then every term and every year |

Ad revenue rewards the second kind far more than the first. Plan for both, but
do not mistake a good Reddit day for traction.

### Phase 0 — now, while AdSense is in review

**Do not launch yet.** You get one first post to each community, and spending it
while ads serve blank wastes the only shot you have at monetising the spike.

What to do instead:
- Search Console and re-indexing — section 3b. The SEO clock starts the day
  Google can crawl you properly, so this is the one thing worth doing today.
- Take a good screenshot of a finished term — the results screen with the green
  and red grid is the most arresting image the site has.
- Draft the posts below so launch day is copy-paste, not composition.

### Phase 1 — launch week, once ads actually serve

Run these inside one week, not spread out. Each one feeds the next: a Reddit
thread gives a Show HN post social proof, and both give a journalist a reason to
look.

| Day | Where | Notes |
|---|---|---|
| Mon | **r/WebGames** | Best pure fit. Friendly to browser games, no self-promo hostility |
| Tue | **r/ukpolitics**, **r/badeconomics**, **r/AskEconomics** | Read each sub's self-promotion rule first. r/ukpolitics is strict |
| Wed | **Show HN** | Post 08:00–10:00 UK. Title below |
| Thu | **FT Alphaville** and econ journalists | Email below |
| Fri | **Teachers** | The one that keeps paying. See Phase 2 |

Reddit accounts with no history get removed on sight in most of these subs. If
you have no usable account, spend Phase 0 commenting normally in one or two of
them so you are not a drive-by.

### Phase 2 — the channels that compound

**A-level Economics teachers.** The most undervalued audience you have. UK
teachers hunt constantly for something that makes monetary policy concrete, and
your three scenarios are lesson activities that play in three minutes on a
phone. One head of department sharing it inside a school is traffic every year,
not one afternoon. Reach them through TES resources, the #EconTwitter and
#EconTeacher tags, the Economics Network, and tutor2u's community.

**Search.** The three articles are genuinely searchable — people look up "Black
Wednesday explained", "why was inflation 25% in the 1970s", "what did QE
actually do". This builds over months and never stops. It is the reason to keep
writing scenario articles even after AdSense approves.

### Copy you can send as-is

**Show HN title** — no personal story available, so lead with the thing:

> Show HN: A browser game where you set UK interest rates for five years

**Reddit, r/WebGames:**

> **Hold or Hike — you run UK monetary policy for five years**
>
> Free, no signup, plays in about three minutes on a phone. You set the interest
> rate each quarter and try to keep inflation and unemployment both on target,
> which is harder than it sounds because every change takes a quarter to bite.
>
> There are three historical scenarios — 1974, Black Wednesday, and 2008 — where
> the real shocks are scripted, so you can see whether you would have done
> better than the people who were actually there. Mostly you would not.
>
> holdorhike.com

**FT Alphaville / journalists** — short, no pitch language:

> Subject: A browser game about setting Bank Rate
>
> I built a small free game where you set UK interest rates for a five-year term
> and try to hold inflation and unemployment on target. It has scripted
> scenarios for 1974, 1992 and 2008 — playing the rate path the MPC actually ran
> reproduces the history fairly closely, which surprised me.
>
> No signup, no tracking beyond analytics, plays in three minutes:
> holdorhike.com
>
> Happy to explain any of the modelling if it is useful.

**Teachers:**

> Subject: Free monetary policy activity for A-level Economics
>
> I have made a free browser game where students set Bank Rate for twenty
> quarters and try to keep CPI and unemployment inside target bands. It takes
> about three minutes, works on any phone, needs no signup or logins, and there
> are historical scenarios for 1974, 1992 and 2008.
>
> The model is written out in full at holdorhike.com/how-it-works.html if you
> want to check it before putting it in front of a class.

### A constraint to plan around

You cannot be personally identifiable, so the founder story is unavailable. That
matters most on Hacker News, where "I built this and here is why" does a lot of
the work. Post as Hold or Hike and let the thing speak. It costs you little on
Reddit and nothing at all with teachers.

### What good actually looks like

So the numbers are not a surprise later:

- A well-received r/WebGames post: perhaps 2,000–10,000 views in a day.
- A Show HN that reaches the front page: 5,000–20,000. Most do not reach it.
- Both together, at UK rates, might be £10–40. Once.
- A teacher who puts it in a scheme of work: a few hundred a year, every year,
  for no further effort.

That contrast is the whole strategy. Chase the spike for the share grid and the
backlinks; build the recurring channels for the revenue.

