# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

**Team name:**
Zach H
**Startup name:**
BayShare
**Live site link:**
https://hayesz007.github.io/lets-water-today.app/

---

## Work sessions

### Session - Nov 23 - driver: Zach

- **Goal for this session:** Convert the starter project into the BayShare prototype with filters, a local bay-density simulator, and a booking flow.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Refactor index.html, styles.css, app.js, and data.js into BayShare, a peer-to-peer garage bay, two-post lift, and tool booking web app using plain HTML, CSS, and JavaScript with filters, a Local Bay Density control, and a simulated booking modal.
- **What worked:** The zone/equipment/rate filters, the Local Bay Density simulator, and the simulated booking modal all worked on the first pass.
- **What broke, and how we fixed it:** Nothing broke in the code, though I needed to start a local Python HTTP server on port 8000 in the terminal to preview the site in Codespaces.
- **Committed?** yes

### Session - Nov 24 - driver: Zach

- **Goal for this session:** Configure GitHub Pages for live deployment and draft the core sections of `BUSINESS_CASE.md`.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Check index.html, styles.css, and app.js to make sure there are no external library links, real brand names, or mobile layout overflow issues before deploying to GitHub Pages.
- **What worked:** Enabled GitHub Pages from the `main` branch, verified the public `github.io` link loaded BayShare, and drafted all six sections of `BUSINESS_CASE.md`.
- **What broke, and how we fixed it:** I initially copied the temporary Codespaces port 8000 preview URL instead of the public GitHub Pages URL, and GitHub Pages took a couple of minutes to update after pushing commits. Fixed by waiting for the Pages build to finish and updating the URL to the permanent `github.io` link.
- **Committed?** yes

### Session - Nov 27 - driver: Zach

- **Goal for this session:** Expand `BUSINESS_CASE.md` to hit target depth and course concepts, verify the live mobile site, and complete `PROJECT_LOG.md`.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Review the booking modal and filter bar on narrow mobile widths so buttons and cards stack cleanly without horizontal scrolling.
- **What worked:** Expanded the business case with Porter's Value Chain, multi-homing, VRIN, IaaS/SaaS/PaaS, and data minimization, and verified the live site on both laptop and mobile.
- **What broke, and how we fixed it:** Nothing broke in the final pass; cleaned up placeholder lines and typos in both markdown files before final sync.
- **Committed?** yes

---

## Things that broke (running list)

| Date | What went wrong | What we tried | What finally fixed it |
|---|---|---|---|
| Nov 23 | Opening `index.html` directly didn't show a live browser preview in Codespaces | Checked the Ports tab in VS Code Codespaces | Ran `python3 -m http.server 8000` in the terminal to preview on port 8000 |
| Nov 24 | GitHub Pages initially showed the older starter page and I copied the private Codespaces URL by mistake | Refreshed the page immediately and checked repository Settings → Pages | Waited 2 minutes for GitHub Pages to finish deploying `main` and switched to the permanent `github.io` URL |

---

## What a real version would need

Everything we wanted but faked or left out — real logins, a real database, payments, security, moderation, an app, staff, etc. For each one, say **why** it's needed and roughly **how hard or expensive** you think it would be.

| Feature we faked or skipped | Why a real company would need it | How hard / expensive? |
|---|---|---|
| Real user accounts & ID verification | Both hosts and DIY renters need verified identities and driver's licenses before stepping onto private property or using heavy lifts | Medium difficulty; ~$500–$1,500/month using an auth and ID-verification SaaS |
| Live database & real-time calendar sync | Right now bay listings and bookings reset on refresh; a real marketplace needs persistent availability so two drivers can't double-book the same bay | Medium difficulty; ~$50–$200/month for managed cloud database hosting plus backend API development |
| Real payment processing & host payouts | BayShare needs to hold renter funds, collect its 15% service fee, hold damage deposits, and pay out hosts automatically | Medium difficulty; ~2.9% + $0.30 per transaction plus platform payout fees via a payments API |
| Per-booking liability & equipment insurance | Two-post lifts and power tools carry real injury and property-damage risks that a simple prototype checkbox cannot cover | Hard and expensive; requires commercial marketplace underwriting and likely $2,000+/month plus per-booking insurance fees |
| Address privacy & check-in photo storage | Exact street addresses must stay hidden until payment clears, and check-in/out photos need cloud storage to resolve tool or bay damage disputes | Low-to-medium difficulty; ~$50–$150/month for cloud object storage and mapping APIs |
| Trust, safety & host vetting operations | Someone has to review host lift-safety photos, handle damage claims, and moderate disputes | Ongoing operational cost; starts with founder review, scaling to part-time support staff ($3,000+/month) |

---

## Reflection (fill in at the end)

1. **What surprised you most about building software with AI?**
   I was super surprised with how fast Copilot could turn my idea into a working, interactive storefront with filters, a density simulator, and a booking modal in plain HTML, CSS, and JavaScript without needing heavy frameworks. It also showed me that AI still needs clear, specific prompts and manual testing—if you aren't exact about layout or rules, you have to catch and fix those details yourself.

2. **Which parts were easy, and which were hard? Why do you think that is?**
   Generating the front-end UI, sample bay data, and interactive filters was the easiest part as front-end layout patterns are well-defined and easy to test visually right away. The harder parts for me were understanding the GitHub/Codespaces/GitHub Pages deployment workflow and thinking through the real-world business mechanics like two-sided cold start, for example and liability insurance.

3. **If a competitor had the same AI tool, how long would it take them to copy your site?**
   A competitor with Copilot could copy the front-end website in a single weekend—probably in just a few hours. That is why the website itself is not BayShare's competitive advantage; what would take them months or years to copy is recruiting and safety-vetting local garage hosts city by city, building renter trust and reviews, and reaching enough local bay density that drivers can reliably find an open lift nearby.