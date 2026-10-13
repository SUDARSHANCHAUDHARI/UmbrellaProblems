# Umbrella Problems

A complete, standalone interactive rainy scene built with semantic HTML, CSS, inline SVG, and vanilla JavaScript. Milo's umbrella protects almost anything except Milo.

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

## Run locally

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

## Technology and architecture

Plain HTML, CSS, and JavaScript with no framework, bundler, or build step. `package.json`
declares no dependencies at all — it only carries the serve and verification scripts.

- `index.html` — semantic markup plus the inline SVG scene
- `styles.css` — layout, animation, and media queries
- `script.js` — interaction state, particle effects, and generated Web Audio
- `tests/project.test.mjs` — checks run by Node's built-in test runner

Everything ships as static files, so the site can be served from any static host with no
server-side runtime.

## Accessibility

- Semantic controls with visible focus states and a skip link
- Full keyboard operation: `Enter` and `Space` activate the controls
- Descriptive SVG text and live status updates for screen readers
- `prefers-reduced-motion` reduces the particle field and collapses animation and transition
  durations to near zero, and JavaScript shortens matching waits so reduced-motion users are
  not left waiting through effects they cannot see

## Security and privacy

No data leaves the browser. `script.js` makes no network requests and uses no cookies,
`localStorage`, `sessionStorage`, or IndexedDB, so there is nothing to collect and no state to
clear. There are no analytics, trackers, external fonts, remote images, or third-party
services, and no runtime dependencies to audit.

Audio is generated with Web Audio rather than fetched. See [SECURITY.md](SECURITY.md) for
vulnerability reporting.

## Implementation notes

The failure list is shuffled once on reset and consumed as a queue. This keeps each attempt random while guaranteeing that every requested mishap appears once during the ten-attempt story.

Audio starts only after the sound control is selected, matching browser autoplay policies. Rain ambience is filtered noise, and the short interaction cues are synthesized oscillators and noise bursts.

The reduced-motion media query removes ambient movement and limits the particle field. JavaScript also shortens narrative animation delays so reduced-motion users do not have to wait through invisible effects.

## Browser support

The project targets current versions of Chrome, Edge, Firefox, and Safari. Web Audio is optional; the visual experience remains fully functional when audio is unavailable.

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

## Author

**Sudarshan Chaudhari**

Solo indie developer and founder of **SudarshanTechLabs**, based in Bangkok, Thailand.

- GitHub: [@SUDARSHANCHAUDHARI](https://github.com/SUDARSHANCHAUDHARI)
- Developer contact: [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
- Business and legal contact: [sudarshantechlabs@gmail.com](mailto:sudarshantechlabs@gmail.com)

UmbrellaProblems was designed and developed by Sudarshan Chaudhari under SudarshanTechLabs.

## License

This project is currently marked `UNLICENSED` in `package.json`.
