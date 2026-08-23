# Umbrella Problems

A complete, standalone interactive rainy scene built with semantic HTML, CSS, inline SVG, and vanilla JavaScript. Milo's umbrella protects almost anything except Milo.

**Version:** 1.0.0<br>
**Repository:** [SUDARSHANCHAUDHARI/UmbrellaProblems](https://github.com/SUDARSHANCHAUDHARI/UmbrellaProblems)<br>
**Status:** Production-ready static web project; repository currently private

## Contents

- [Experience](#experience)
- [Features](#features)
- [Technology and architecture](#technology-and-architecture)
- [Accessibility](#accessibility)
- [Run locally](#run-locally)
- [Verification](#verification)
- [Project structure](#project-structure)
- [Implementation notes](#implementation-notes)
- [Browser support](#browser-support)
- [Security and privacy](#security-and-privacy)
- [Production deployment](#production-deployment)
- [About](#about)
- [License](#license)

## Experience

Open the umbrella by:

- clicking or tapping the illustrated scene;
- dragging the umbrella;
- selecting **Try the umbrella**;
- focusing the scene and pressing <kbd>Enter</kbd> or <kbd>Space</kbd>.

The first ten attempts play all ten mishaps in a newly shuffled order:

1. the umbrella opens upside down;
2. it closes immediately;
3. wind carries it away;
4. it protects the bird;
5. it opens below Milo;
6. it becomes tiny;
7. it collects water and pours it onto Milo;
8. wind bends it backward;
9. the handle escapes;
10. rain changes direction.

After the tenth mishap, the rain stops first. Only then does the umbrella open correctly.

## Features

- Original responsive SVG cartoon scene with a character, closed/open umbrella, bird, clouds, street details, and puddles
- Generated rain particles, moving wind streaks, cloud drift, puddle ripples, and per-mishap animation
- Attempt counter and ten-step visual progress meter
- Generated Web Audio rain ambience and procedural sound effects—no audio files or network requests
- Sound toggle and complete reset control
- Mouse, touch, drag, and keyboard interaction
- Semantic controls, visible focus states, descriptive SVG text, live status updates, and a skip link
- `prefers-reduced-motion` support with fewer rain particles and near-instant state changes
- Responsive layouts for desktop, tablet, and mobile
- No runtime dependencies, build step, tracking, fonts, images, or external services

## Technology and architecture

| Area | Implementation |
| --- | --- |
| Markup | Semantic HTML5 with an inline, accessible SVG illustration |
| Styling | Hand-written CSS with responsive layouts, custom properties, and keyframe animation |
| Interaction | Vanilla JavaScript with pointer, click, touch, and keyboard input |
| Audio | Web Audio API using locally generated oscillators and filtered noise |
| State | A small client-side state machine with a shuffled ten-failure queue |
| Testing | Node.js built-in test runner and JavaScript syntax checking |
| Runtime dependencies | None |

The scene markup lives in `index.html`, presentation and animation live in `styles.css`, and interaction state, particles, and audio generation live in `script.js`. This separation keeps the project directly deployable while making each concern independently maintainable.

## Accessibility

- The illustrated scene is keyboard operable with <kbd>Enter</kbd> and <kbd>Space</kbd>.
- Native buttons provide dedicated sound, reset, and umbrella controls.
- Visible focus styles and a skip link support keyboard navigation.
- The SVG includes a title and description, while status changes are announced through a polite live region.
- The interface does not rely on color alone to communicate progress.
- `prefers-reduced-motion` reduces ambient particles and shortens animated transitions.
- Sound is disabled by default and remains optional throughout the experience.

## Run locally

### Prerequisites

- A current version of Chrome, Edge, Firefox, or Safari
- Node.js 20 or newer for verification
- pnpm 10.28.2 for the documented scripts

No dependency installation or build step is required.

### Clone

The repository is private, so the GitHub account cloning it must have access:

```bash
git clone https://github.com/SUDARSHANCHAUDHARI/UmbrellaProblems.git
cd UmbrellaProblems
```

### Start the local server

The project can be opened directly by loading `index.html` in a modern browser. Serving it locally is recommended:

```bash
pnpm serve
```

Then visit [http://localhost:4173](http://localhost:4173).

No install step is required because the project has no dependencies. If `pnpm` is unavailable, use:

```bash
python3 -m http.server 4173
```

## Verification

Run the dependency-free checks with:

```bash
pnpm check
```

This checks JavaScript syntax and runs Node's built-in test runner. The tests verify the standalone file set, all ten scenario definitions, interaction modes, audio generation, success ordering, accessibility hooks, responsive styles, and reduced-motion support.

Expected result: all nine tests pass with no failures.

## Project structure

```text
UmbrellaProblems/
├── index.html              # Semantic page and original SVG illustration
├── styles.css              # Layout, scene styling, animations, and media queries
├── script.js               # Interaction state, effects, particles, and generated audio
├── favicon.svg             # Local umbrella favicon
├── site.webmanifest        # Installable-site metadata
├── robots.txt              # Crawler policy
├── package.json            # Serve and verification scripts (no dependencies)
├── tests/
│   └── project.test.mjs    # Dependency-free project checks
├── AGENTS.md               # Repository-specific Codex guidance
├── CHANGELOG.md            # User-facing release history
├── SECURITY.md             # Vulnerability reporting and security posture
├── .gitignore
└── README.md
```

## Implementation notes

The failure list is shuffled once on reset and consumed as a queue. This keeps each attempt random while guaranteeing that every requested mishap appears once during the ten-attempt story.

Audio starts only after the sound control is selected, matching browser autoplay policies. Rain ambience is filtered noise, and the short interaction cues are synthesized oscillators and noise bursts.

The reduced-motion media query removes ambient movement and limits the particle field. JavaScript also shortens narrative animation delays so reduced-motion users do not have to wait through invisible effects.

## Browser support

The project targets current versions of Chrome, Edge, Firefox, and Safari. Web Audio is optional; the visual experience remains fully functional when audio is unavailable.

## Security and privacy

Umbrella Problems has no backend, authentication, cookies, analytics, user-data storage, forms, or network requests. All illustration, animation, interaction, and audio behavior runs locally in the browser.

The document includes a restrictive Content Security Policy fallback and a no-referrer policy. Vulnerabilities should be reported privately according to [SECURITY.md](SECURITY.md), not through a public issue. Release history is maintained in [CHANGELOG.md](CHANGELOG.md).

## Production deployment

The site is ready for any static host: publish the repository root with no build command. Use `index.html` as the entry point and run `pnpm check` before each release.

The document includes a restrictive Content Security Policy fallback and a no-referrer policy. Configure the equivalent policies as HTTP response headers on the production host, together with `X-Content-Type-Options: nosniff`, `Permissions-Policy`, and clickjacking protection. Response headers take precedence over HTML metadata and can enforce protections that `<meta>` cannot.

Before making the repository or deployment public:

1. run `pnpm check`;
2. test mouse, touch, keyboard, sound, reset, and reduced-motion behavior in target browsers;
3. configure the final canonical URL and social preview image when a production domain exists;
4. verify production response headers and the not-found route on the chosen host;
5. update `CHANGELOG.md` for any user-facing change.

See `SECURITY.md` for the current security model and reporting guidance.

## License

This project is currently marked `UNLICENSED` in `package.json`.

---

## About

I'm Sudarshan Chaudhari, a Senior Quality Engineer, Test Automation specialist, and AI systems builder based in Bangkok, Thailand.

I have 13+ years of experience in software quality engineering, working across SaaS, fintech, gaming, web, mobile, cloud, and digital signage platforms. My background combines hands-on test automation with QA leadership, test strategy, CI/CD, release quality, production investigation, and cross-platform validation.

Alongside my professional QA career, I run [SudarshanTechLabs](https://sudarshantechlabs.com/), my independent engineering and product lab where I design, build, test, and ship software across Android, web, AI, cybersecurity, developer tooling, and cross-platform applications.

### What I work on

- ⚙️ **Quality Engineering & Test Automation** — Playwright, Selenium, Cypress, Appium, API testing, automation frameworks, end-to-end testing, CI/CD, release gates, GitHub Actions, risk-based testing, and production validation
- 🤖 **AI Systems & Automation** — AI agents, multi-agent orchestration, MCP servers, AI-assisted QA, prompt tooling, developer workflows, automation systems, and Claude Code plugins
- 📱 **Mobile & Cross-Platform Applications** — Android applications built with Kotlin and Jetpack Compose, Google Play releases, automated build and publishing pipelines, and cross-platform development spanning iOS, web, Windows, and macOS
- 🌐 **Web Applications & Platforms** — Full-stack applications using Next.js, TypeScript, Firebase, Cloudflare, REST APIs, and modern web infrastructure
- 🛠️ **Developer Tooling & CLI Engineering** — Rust, Python, TypeScript, CLI utilities, multi-repository tooling, build automation, release tooling, and engineering productivity systems
- 🛡️ **Cybersecurity & Observability** — Threat detection, log analysis, security auditing, vulnerability assessment, monitoring, and security-focused developer tools
- 📺 **Digital Signage & Device Platforms** — Content validation, playback testing, device compatibility, production investigation, monitoring, and QA across diverse hardware and operating-system environments

My work sits at the intersection of quality engineering, automation, AI, and software development. I approach products with a QA mindset from the beginning: understanding failure modes, designing for testability, automating repetitive work, and building release confidence into the engineering process.

Through SudarshanTechLabs, I also build products and tools from idea to production, covering architecture, development, testing, CI/CD, release automation, monitoring, and ongoing maintenance.

🌐 [sudarshantechlabs.com](https://sudarshantechlabs.com/) · 💼 [LinkedIn](https://linkedin.com/in/sudarshan-chaudhari) · 🐙 [GitHub](https://github.com/SUDARSHANCHAUDHARI) · ✉️ [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
