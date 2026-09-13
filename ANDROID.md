# Cancer Recovery Planner — Android app

The Android app is the existing web app wrapped in a
[Capacitor](https://capacitorjs.com) shell. The web code is unchanged and
unduplicated: the same `index.html`, `app.js`, `style.css`, `ecg.js`,
`sample-data.js` and `tracking.js` that serve the website are bundled into the
APK, so the two can never drift apart.

| | |
|---|---|
| Application ID | `com.thenewnormalhub.cancerrecovery` |
| Min Android | 7.0 (API 24) |
| Target | API 36 |
| Permissions | `INTERNET` only |

## Getting an APK

### From CI (no local setup)

Every push builds one. Open the **Actions** tab → the latest **Android APK**
run → **Artifacts** → `cancer-recovery-planner-debug-apk`.

Unzip it and transfer the `.apk` to the phone. Android will ask you to allow
installation from that source, since a debug APK is not Play-signed.

### Locally

Needs a JDK 21 and the Android SDK (Android Studio installs both).

```bash
npm ci
npm run apk        # build www/, sync it into android/, then assembleDebug
```

The APK lands in `android/app/build/outputs/apk/debug/`.

To work in Android Studio instead, run `npm run sync` first, then open the
`android/` directory. Do not open the repository root — the Gradle project is
`android/`.

Install straight to a connected device with `adb install -r <path-to-apk>`.

## After changing the web app

The native project holds a *copy* of the web assets, so a web change needs a
sync before it shows up in the app:

```bash
npm run sync
```

`npm run apk` does this for you.

## What is and is not in the app

`scripts/build-www.js` assembles the bundle from an explicit allowlist of the
seven public files, then asserts the excluded paths are absent. It fails the
build rather than shipping something unintended, and CI re-checks it.

Deliberately excluded:

- **`account/`** — the login-gated build is not part of the Android app.
- **`sw.js`** — a service worker is pointless inside the APK, where the assets
  are already local. Nothing registered it on the web either.
- **`CNAME`** — GitHub Pages only.

`www/` is generated and git-ignored. Never edit it; edit the files at the
repository root.

## Data

Entries live in the WebView's `localStorage`, on the device. The app's storage
is separate from the website's, so installing the app does not import data from
`cancer.thenewnormalhub.com` — the two keep independent copies. Use **Export**
on the Tracking tab to move data between them.

`android:allowBackup` is left at Capacitor's default of `true`, so entries are
included in Android's app backup.

## Icons

Generated from `favicon.svg` by `scripts/generate-icons.py` (needs Pillow):

```bash
pip install pillow
python3 scripts/generate-icons.py
```

Adaptive-icon foregrounds keep the cross inside the 66dp safe zone so launcher
masks cannot clip it. `android/play-store-icon.png` is the 512×512 listing icon
and is not bundled in the APK.

## Releasing to Play

The CI build is a **debug** APK: it is signed with the shared debug key and is
not publishable. A Play release additionally needs:

1. A release keystore, kept out of the repository.
2. `signingConfigs` in `android/app/build.gradle` reading it from environment
   variables or GitHub secrets.
3. `./gradlew bundleRelease` for an AAB, which is what Play accepts.
4. `versionCode` incremented on every upload — it is currently `1`, in
   `android/app/build.gradle`.

## Known limitations

- **Fonts need a network on first launch.** The web app loads IBM Plex from
  `fonts.googleapis.com`, and that request is not bundled. Opened offline, the
  app falls back to the system sans-serif; everything else works, since all
  data is local. Bundling the fonts into the APK would remove the dependency.
- **This project has not been compiled yet.** The environment it was scaffolded
  in has no access to Google's Android artifact hosts, so the first real build
  is the CI run on the first push. Read that run before trusting the APK.
