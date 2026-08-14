# The Chancellor game — v1 build brief

A sibling to *Hold or Hike*, on the same domain, at `/chancellor.html`. Same
discipline as the game it sits beside: **one self-contained HTML file, vanilla
JS, inline CSS, canvas charts, no dependencies, no build step.**

Built primarily because it is interesting to build. Revenue at this scale is
tens of pounds a month at best; that is not the reason for it.

## The premise

*Hold or Hike* inverted. There you are the Bank and the government is
exogenous. Here **you are the Treasury, and the MPC becomes an automated
reaction function** that raises rates on you when you loosen too hard.

Five Budgets, 2026–2031, then a general election.

## The two hidden variables

These are the fiscal analogue of the hidden neutral rate, and they are what
make this a game rather than a spreadsheet.

**The fiscal multiplier** — how much output a pound of spending actually buys.
Genuinely disputed among economists, so hiding it is honest rather than a
difficulty setting. This is the argument `faq.html` already makes for r*, and
it should be made again in the same voice.

**The OBR forecast** — what you are judged against, and which gets *revised*.
Headroom evaporating in a forecast round you did not cause is the actual lived
experience of the job, and should be the game's signature cruelty. The player
should feel it as unfair and then realise it is accurate.

## The four levers

Income tax/NI, VAT, day-to-day spending, capital investment.

This is the smallest set that produces real dilemmas. VAT raises money quickly
but feeds straight into inflation and provokes the Bank. Capital investment
costs you now and raises *potential* output only after you have left office —
the honest version of the long-termism problem. Two levers collapse to a single
borrowing number and erase everything interesting; six is a fortnight of
balancing and a scrolling form on a phone.

*(Chosen by me, not confirmed by the user — overrule if wanted, but reread the
paragraph above before doing so.)*

## The feedback loop

The bond market. Borrow above expectations while debt is rising and gilt yields
spike; debt interest eats the headroom; you finish worse off than before you
spent. This is what stops "borrow and spend" being a dominant strategy, and it
is the mechanic a 2022 mini-Budget scenario would later be built on.

## Outputs and scoring

Growth, borrowing, debt/GDP, unemployment, inflation, polling.

Scored against a **par**, exactly as the rate game is, with the election as the
emotional result. The fiscal rule — debt falling as a share of GDP by year five
— is the hard constraint.

Par must be *measured*, not guessed. See verification.

## v1 excludes

Scenarios, sandbox, career, reappointment.

Deferred, best first: **2022 mini-Budget** (the most searchable recent fiscal
event and the obvious traffic hook), 1976 IMF crisis, 2010 austerity.

## What to reuse from `index.html`

Fork to `chancellor.html`. The fiscal model is the only genuinely new part.

| What | Where |
|---|---|
| Sparkline charts | `spark()` 1282, `sparkGrowth()` 1338 |
| Results chart | `drawStory()` 1390 |
| Auto-zooming axes | `scaleFor()` 1259 |
| Ads / analytics | `initAds()` 585, `initGA()` 565, `track()` 576 |
| Helpers | `clamp` / `inBand` / `outBy` / `pct` / `f1`, 1074–1079 |
| The committee, inverted into an automaton | `mpcVote()` 1092 |

Also reuse, unchanged: `page.css`, the results and share machinery, the medal
system, and the intro chrome.

## House rules inherited from the game

- No mention of AI authorship anywhere on the site.
- The operator is the trading name **Hold or Hike**; contact is
  `hello@holdorhike.com`, never a personal address.
- Carry the non-affiliation footer: not connected to HM Treasury or the Bank of
  England, a simplified model, for entertainment, not economic advice.
- Ship an honest caveat page in the manner of `how-it-works.html`, saying
  plainly what the model cannot represent.

## Verification

Follow the rate game's practice: **measure, do not eyeball.** Playwright is at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; the harnesses in the
scratchpad (`allscen.js`, `hpdiff.js`) are the pattern to copy.

- Sweep a passive strategy, a steady one and an aggressive one across many
  seeded runs, and set par so a well-judged Budget beats it roughly ten times
  in twelve — the ratio the modern rate game was tuned to.
- Confirm no strategy dominates: in particular that borrow-and-spend loses to
  the bond market, and that austerity loses to scarring.
- Check on a 390px viewport that four sliders plus the readouts fit without the
  page becoming a scrolling form.
- `node preflight.js` after adding the page.
