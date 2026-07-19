import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readProjectFile = (path) => readFile(resolve(projectRoot, path), "utf8");

const [html, css, script, readme, packageJson] = await Promise.all([
  readProjectFile("index.html"),
  readProjectFile("styles.css"),
  readProjectFile("script.js"),
  readProjectFile("README.md"),
  readProjectFile("package.json"),
]);

test("contains the complete standalone project file set", async () => {
  const files = [
    "index.html",
    "styles.css",
    "script.js",
    "favicon.svg",
    "site.webmanifest",
    "robots.txt",
    "README.md",
    "SECURITY.md",
    "CHANGELOG.md",
    "AGENTS.md",
    ".gitignore",
  ];
  await Promise.all(files.map((file) => readProjectFile(file)));

  const packageData = JSON.parse(packageJson);
  assert.equal(packageData.name, "umbrella-problems");
  assert.equal(packageData.private, true);
  assert.equal(packageData.dependencies, undefined);
  assert.equal(packageData.devDependencies, undefined);
});

test("keeps the browser experience self-contained", () => {
  const localAssets = `${html}\n${css}`.replace(
    /href="https:\/\/sudarshanchaudhari\.github\.io\/TinyChaos\/"/g,
    "",
  );
  assert.doesNotMatch(localAssets, /(?:src|href)=["']https?:\/\//i);
  assert.doesNotMatch(css, /url\(["']?https?:\/\//i);
  assert.match(html, /<script src="script\.js" defer><\/script>/);
  assert.match(html, /<link rel="stylesheet" href="styles\.css"/);
  assert.match(html, /<link rel="manifest" href="site\.webmanifest"/);
  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.match(html, /script-src 'self'/);
  assert.match(html, /connect-src 'none'/);
});

test("renders every requested scene element", () => {
  for (const idOrClass of [
    "character",
    "umbrellaAssembly",
    "closed-canopy",
    "rainLayer",
    "wind-layer",
    "cloud",
    "puddle",
    "bird",
  ]) {
    assert.match(html, new RegExp(idOrClass), `Missing scene element: ${idOrClass}`);
  }
  assert.match(html, /<svg[\s\S]*role="img"/);
  assert.match(html, /<title id="svgTitle">/);
  assert.match(html, /<desc id="svgDescription">/);
});

test("uses unique element IDs and resolves JavaScript ID selectors", () => {
  const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(htmlIds).size, htmlIds.length, "HTML element IDs must be unique");

  const queriedIds = [...script.matchAll(/querySelector\("#([^"]+)"\)/g)].map((match) => match[1]);
  for (const queriedId of queriedIds) {
    assert.ok(htmlIds.includes(queriedId), `JavaScript references missing element #${queriedId}`);
  }
});

test("defines all ten unique randomized umbrella failures", () => {
  const failureIds = [
    "inverted",
    "snap",
    "fly",
    "bird",
    "below",
    "tiny",
    "water",
    "bend",
    "handle",
    "direction",
  ];

  for (const failureId of failureIds) {
    assert.match(script, new RegExp(`id: ["']${failureId}["']`), `Missing failure: ${failureId}`);
  }
  assert.equal([...script.matchAll(/\bid: "(?:inverted|snap|fly|bird|below|tiny|water|bend|handle|direction)"/g)].length, 10);
  assert.match(script, /failureQueue:\s*\[\]/);
  assert.match(script, /state\.failureQueue = shuffle\(failures\)/);
});

test("stops rain before opening the successful umbrella", () => {
  const successFunction = script.match(/const stopRainThenSucceed = \(\) => \{([\s\S]*?)\n  \};/)?.[1] ?? "";
  const stopIndex = successFunction.indexOf('rainLayer.classList.add("is-stopped")');
  const openIndex = successFunction.indexOf('scene.classList.add("umbrella-open", "scene--success")');

  assert.ok(stopIndex >= 0, "The final sequence must stop the rain");
  assert.ok(openIndex > stopIndex, "The final umbrella must open only after the rain stops");
  assert.match(script, /state\.attempts === TOTAL_ATTEMPTS/);
});

test("supports click, tap or drag, keyboard, reset, and generated sound", () => {
  assert.match(script, /scene\.addEventListener\("click"/);
  assert.match(script, /umbrellaHitArea\.addEventListener\("pointerdown"/);
  assert.match(script, /scene\.addEventListener\("pointermove"/);
  assert.match(script, /event\.key !== "Enter" && event\.key !== " "/);
  assert.match(script, /resetButton\.addEventListener\("click", resetExperience\)/);
  assert.match(script, /window\.AudioContext \|\| window\.webkitAudioContext/);
  assert.match(script, /createBuffer\(1, frameCount/);
  assert.match(script, /soundToggle\.setAttribute\("aria-pressed"/);
});

test("includes accessibility, responsive, and reduced-motion behavior", () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /id="weatherScene"[\s\S]*role="button"[\s\S]*tabindex="0"/);
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 430px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(script, /prefers-reduced-motion: reduce/);
});

test("documents operation, controls, checks, and accessibility features", () => {
  for (const section of ["## Experience", "## Features", "## Run locally", "## Verification", "## Project structure"]) {
    assert.match(readme, new RegExp(section));
  }
  assert.match(readme, /Enter.*Space/s);
  assert.match(readme, /prefers-reduced-motion/);
  assert.match(readme, /pnpm check/);
});

test("uses the shared TinyChaos shell contract", () => {
  for (const color of ["#15152a", "#fff5df", "#ff5d5d", "#4f7cff", "#ffd166", "#58d6a9", "#b695ff"]) {
    assert.match(css, new RegExp(`--(?:ink|paper|coral|blue|butter|mint|lilac):\\s*${color}`, "i"));
  }
  assert.match(css, /--display-font:\s*Impact/);
  assert.match(css, /--body-font:\s*"Arial Rounded MT Bold"/);
  assert.match(css, /:focus-visible\s*\{[\s\S]*outline:\s*4px solid var\(--blue\)/);
  assert.match(css, /body\s*\{[\s\S]*min-width:\s*0;[\s\S]*overflow-x:\s*clip;[\s\S]*overflow-y:\s*auto;/);
  assert.match(css, /html\s*\{[\s\S]*min-width:\s*0;/);
  assert.match(html, /href="https:\/\/sudarshanchaudhari\.github\.io\/TinyChaos\/"/);
  assert.match(html, /UmbrellaProblems · by Sudarshan Chaudhari/);
});
