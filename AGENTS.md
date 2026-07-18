# UmbrellaProblems Repository Instructions

## Architecture

- Keep the project dependency-free and directly runnable as a static site.
- Use semantic HTML, CSS, inline SVG, and vanilla JavaScript.
- Preserve the separation between scene markup (`index.html`), presentation and animation (`styles.css`), and interaction state (`script.js`).
- Do not introduce remote fonts, media, analytics, or runtime services without explicit approval.

## Experience

- Preserve click, tap, drag, button, and keyboard interaction parity.
- Keep the ten unique umbrella failures and the ordering guarantee: rain stops before the final successful opening.
- Maintain accessible names, visible focus, live status updates, responsive layouts, and reduced-motion behavior.
- Sound must remain opt-in and locally generated.

## Verification

- Run `pnpm check` after code or markup changes.
- Update tests when changing required elements, scenario behavior, or production metadata.
- Perform manual browser and assistive-technology checks before a public production release.
- Do not create or modify GitHub Actions workflows without Sudarshan's explicit approval.

## Security and repository hygiene

- Never commit `.env*`, credentials, local configuration, signing material, generated output, or editor state.
- Keep `package.json` marked private unless registry publication is explicitly requested.
- Keep the GitHub repository private until Sudarshan explicitly approves a visibility change.
