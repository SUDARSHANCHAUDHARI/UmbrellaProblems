# Security Policy

## Supported version

Security updates apply to the current `main` branch.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Report it privately to `sunny.sudarshan@gmail.com` with:

- the affected file or behavior;
- reproduction steps;
- the expected security impact;
- any suggested mitigation.

Do not include real credentials, personal data, or unrelated private information in the report.

## Current security model

Umbrella Problems is a dependency-free static site. It has no backend, authentication, user data storage, forms, cookies, analytics, or network requests. Sound is generated locally through the Web Audio API.

The HTML provides a Content Security Policy fallback that limits scripts and resources to local files and blocks network connections. Inline styles remain allowed because the SVG scene and particle system use dynamic CSS custom properties. Production hosting should enforce the same policy as a response header and add host-level protections such as MIME sniffing prevention, clickjacking protection, and a restrictive permissions policy.

Repository secrets, environment files, signing material, generated output, and local configuration are excluded by `.gitignore`. Run `pnpm check` before release and repeat secret scanning before every public visibility change.
