# Three Proposed Growth Experiments

> Status: **Proposed — not yet conducted.** No results exist. Success thresholds are configurable in the app (Experiments page).

---

## Experiment 1 — Message positioning

- **Hypothesis:** A project-focused invitation will generate a higher registration conversion rate than a generic workshop announcement.
- **Test design:** Two invitation messages sent to similar audiences under similar distribution conditions.
  - A (generic): “Join our free online AI workshop.”
  - B (project-focused): “Find your first AI project idea in 30 seconds — then build it in a free 60-minute workshop.”
  - Each variant uses its own tracked link (e.g. `?ch=ambassador&v=A`). Rotate variants across comparable groups to reduce bias.
- **Primary metric:** Registrations ÷ tracked invitation visits, per variant.
- **Success criterion (default):** B shows ≥ 20% relative lift over A, with enough visits per variant to be meaningful.
- **Decision:** If met, use project-focused copy for all remaining outreach. If not, keep the simpler message and test another angle (e.g. “no experience needed”).

## Experiment 2 — Referral activation

- **Hypothesis:** A visible post-registration sharing prompt will increase referral-driven registrations.
- **Test design:** Split registrants between (A) a standard confirmation showing only the code, and (B) a confirmation with a prominent “Invite your friends” card and one-tap WhatsApp share.
- **Primary metric:** Referred registrations per eligible registrant (every registrant receives a code and is eligible).
- **Success criterion (default):** Variant B reaches ≥ 0.3 referred registrations per eligible registrant and beats A.
- **Decision:** If met, keep the prominent prompt and emphasise referrals in ambassador scripts. If not, test a different message or a small, fair incentive.

## Experiment 3 — Channel efficiency

- **Hypothesis:** Relevant college communities may generate more registrations per unit of effort or spending than broad, untargeted promotion.
- **Test design:** Tag every outreach link with a channel (`?ch=ambassador|whatsapp|social|community`). Log spend and outreach hours per channel. Compare after Day 4.
- **Primary metrics:** Registrations by channel; cost per registration where spend exists; registrations per hour of outreach effort.
- **Success criterion (default):** Best channel delivers ≥ 15 registrations per hour of effort (adjust once baseline is known).
- **Decision:** Release the ₹700 contingency to the channel that clears the threshold; reduce effort on channels that do not.

---

### Measurement notes

- One primary acquisition channel per registration; referral attribution is a separate field — no double-counting.
- Duplicate emails (normalised) are counted once.
- When a denominator is zero, report “Not enough data” rather than a number.
