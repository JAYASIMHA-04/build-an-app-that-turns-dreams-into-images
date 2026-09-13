# Dreamweaver 🌙

Turn the impossible visions of sleep into art. Describe a dream in your own
words, choose a style and mood, and Dreamweaver paints it into a vivid, surreal
image — then keeps it forever in your personal dream journal.

## Features

- **Dream → image** — describe any dream and generate an image from it.
- **Styles & moods** — dreamscape, ethereal, oil painting, watercolor,
  cyberpunk, anime and more, crossed with moods like serene, epic, or uncanny.
- **Aspect ratios** — square, portrait, landscape and cinematic.
- **Reimagine** — reroll the same dream with a new seed for a fresh vision.
- **Dream Journal** — save the visions that resonate; they persist locally in
  your browser (`localStorage`).
- **Download & share** — save any image, copy the underlying prompt, or view it
  full-screen.
- **Animated cosmic UI** — a twinkling starfield, nebula glows and glassmorphic
  panels.

## How it works

Images are generated directly from the browser using
[Pollinations AI](https://pollinations.ai) — a free, no-API-key, CORS-friendly
text-to-image endpoint. This means the app is **fully functional with zero
configuration**: no server, no keys, no sign-up.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS
- `vite-plugin-singlefile` for a fully self-contained preview build

## Development

```bash
npm install
npm run dev          # start the dev server
npm run build        # type-check + production build
npm run build:preview # single self-contained index.html in dist-preview/
```

No environment variables are required.
