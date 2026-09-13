#!/usr/bin/env node
/*
 * Assemble the web assets that go inside the Android app.
 *
 * Capacitor needs a single directory to copy into the APK. The repository
 * root is the deployed website and also contains the login-gated /account
 * build, which is deliberately NOT part of the Android app.
 *
 * This uses an explicit allowlist rather than "copy everything except...".
 * A denylist would silently start shipping any new directory added to the
 * repo; an allowlist fails closed.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "www");

// The public build, exactly as index.html references it.
const INCLUDE = [
  "index.html",
  "app.js",
  "style.css",
  "ecg.js",
  "sample-data.js",
  "tracking.js",
  "favicon.svg",
];

// Never bundled, and asserted below so a future change cannot quietly
// pull them in:
//   account/   - login-gated build, not part of the Android app
//   sw.js      - a service worker is meaningless inside the APK, where
//                assets are already local; it is not registered anyway
//   CNAME      - GitHub Pages custom domain, web-only
const FORBIDDEN = ["account", "sw.js", "CNAME"];

function rmrf(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function main() {
  const missing = INCLUDE.filter((f) => !fs.existsSync(path.join(ROOT, f)));
  if (missing.length) {
    console.error(`build-www: missing source file(s): ${missing.join(", ")}`);
    process.exit(1);
  }

  rmrf(OUT);
  fs.mkdirSync(OUT, { recursive: true });

  for (const name of INCLUDE) {
    fs.copyFileSync(path.join(ROOT, name), path.join(OUT, name));
  }

  // Fail the build rather than ship the account app inside the APK.
  for (const name of FORBIDDEN) {
    if (fs.existsSync(path.join(OUT, name))) {
      console.error(`build-www: refusing to bundle "${name}" into the Android app`);
      process.exit(1);
    }
  }

  const bytes = INCLUDE.reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
  console.log(`build-www: ${INCLUDE.length} files -> www/ (${(bytes / 1024).toFixed(0)} KB)`);
}

main();
