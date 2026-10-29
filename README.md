# AI Sprint



Goal being simulated: 500 final-year engineering students register for the free online workshop *Build Your First AI Project in 60 Minutes* within 7 days, with ₹2,000.

## Features

- **Project idea generator** — 10 curated templates, deterministic rule-based scoring (no external AI API). Try another / copy / register.
- **Registration** — validation (required fields, email format, lengths), duplicate prevention by normalised email (case, Gmail dots, `+tags`). No phone number.
- **Referrals** — unique `AISPRINT-XX000` codes, `?ref=` links preserved across the session, attribution counted once, self-referral blocked, unknown codes allowed without attribution.
- **Channel tagging** — optional `?ch=ambassador|whatsapp|social|community`; one primary channel per registration, referral attribution separate.
- **WhatsApp sharing** — `wa.me` link with pre-filled message. Nothing is sent automatically.
- **Demo dashboard** — progress to 500, channels vs targets, funnel, conversion metrics ("Not enough data" when a denominator is 0), budget & hypothetical spend, 7-day timeline, next actions. Toggle between *Local demo activity* and *Synthetic sample*.
- **Growth Playbook**, **three proposed experiments** (configurable success criteria), **editable AI worklog** (copy/export Markdown).
- **Demo controls** (bottom-right) — two-minute repeatable walkthrough + reset.
- Printable growth plan at `/growth-plan.html`.

## Run locally

Requires Node 18+.

```bash
npm install
npm run dev        # http://localhost:5173
```

> Windows PowerShell blocking `npm`? Use `npm.cmd install` / `npm.cmd run dev`, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Build & test

```bash
npm test           # 19 unit tests: generator, validation, duplicates, referrals, self-referral, metrics
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

### Manual test script (≈2 min)

1. Open the app → **Demo controls** → run steps 1–5 in order.
2. Check Register page shows code, link, referral count = 1 after step 4.
3. Run step 4 again → duplicate blocked.
4. Register manually with an invalid email / empty fields → inline errors.
5. Copy the referral link, open it in a new tab, try registering with the *referrer's* email (e.g. `demo.student.a+x@example.com`) → self-referral blocked.
6. Open `/?ref=AISPRINT-ZZ999` → Register shows "not recognised", registration still works without attribution.
7. Dashboard: toggle *Synthetic sample*; enter spend values → cost/registration updates; exceed ₹2,000 → warning.
8. Reset → all metrics show "Not enough data".
9. Resize to mobile width; use the menu button.

## Deploy (free)

**Vercel:** push to GitHub → vercel.com → *Add New Project* → import repo → framework *Vite* (build `npm run build`, output `dist`). `vercel.json` included.

**Netlify:** app.netlify.com → *Add new site* → import repo. `netlify.toml` included. Or drag the `dist/` folder onto Netlify Drop.

After deploying, open the URL in an incognito window and test a `?ref=` link. (No deployment has been made yet.)

## Limitations

- LocalStorage only: referrals only "work" within one browser; no cross-device attribution, no real analytics.
- No authentication; the dashboard shows aggregate counts only and never personal details.
- Generator is rule-based over curated templates, not generative AI.
- Synthetic sample data is invented for illustration.

## Future improvements

- Shared backend (e.g. Supabase) with server-side dedupe and attribution.
- Consented email confirmations and reminders.
- Real A/B variant serving for Experiments 1 & 2.
- Ambassador dashboard / leaderboard with fair, verified incentives.
- Optional LLM-powered idea generation with the curated templates as a fallback.

## Submission materials

See [`/submission`](./submission): growth plan, three experiments, AI worklog (draft — replace with real notes), video script, checklist.
