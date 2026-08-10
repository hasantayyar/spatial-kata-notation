# Spatial Kata Notation (SKN)

Documentation site for **Spatial Kata Notation**: a plain-text notation for karate kata and bunkai.

SKN helps students remember [embusen](https://en.wikipedia.org/wiki/Embusen), facing, stances, and technique order. It does not replace dojo teaching. Always defer to your sensei.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

Site URL: https://hasantayyar.github.io/spatial-kata-notation/

1. Push to `main` (workflow: `.github/workflows/deploy.yml`).
2. In the repo on GitHub: **Settings → Pages → Source → GitHub Actions**.

`astro.config.mjs` sets `site` and `base` for this project Pages URL. If you later use a custom domain, set `site` to that domain and remove `base`.

## Contents

- Philosophy: why SKN exists, and the limits of notation
- Guide: how to read a sheet
- Reference: compass, stances, movement codes
- Bunkai: attaching application lines
- Practice: generate practice loops from an SKN sheet
- Example: Pinan Nidan (Shito-Ryu reading)
