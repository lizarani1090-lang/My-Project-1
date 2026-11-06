# Pulse Predictor

A responsive rural-healthcare prototype with role-specific sign-in for ASHA workers, doctors, facility administrators, and patients. It includes triage, teleconsultation, referral, medication, diagnostics, and appointment flows.

## Run locally

The built-in backend has no package dependencies. Start it with Node.js:

```bash
node server.js
```

Open [http://localhost:3000](http://localhost:3000). Choose a role portal and sign in with the configured backend account.

## Deploy to Netlify

Note: Netlify can publish the static UI, but the trial authentication backend requires a Node.js host or an equivalent serverless API deployment.

The included `netlify.toml` publishes the repository root. Create a new Netlify site from this repository with the default settings—no build command is required.

## Project structure

- `server.js` — dependency-free Node.js API, session management, configured login, and static file server.
- `login*.html` — role-specific trial login entry points.
- `assets/login.css` and `assets/login.js` — local login interface and sign-in flow.

- `index.html` — semantic application markup and CDN dependency configuration.
- `assets/styles.css` — responsive visual system and layout refinements.
- `assets/app.js` — role switching, view navigation, triage state, timeline rendering, connectivity, and notifications.
- `netlify.toml` — Netlify publish configuration.
