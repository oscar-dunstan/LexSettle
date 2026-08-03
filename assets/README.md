# assets

## Encoding rules for this folder

- **Photographs → WebP**, lossy `-q 80` (see below). Every mockup delivered so far
  has arrived as a 5120×3558 PNG at 11–17 MB. PNG is lossless, for flat UI and
  transparency; these are photographs with gradients, shadows and grain, where a
  lossy codec is free. Re-encoding costs nothing visible and saves 55–190×.
- **Flat UI with transparency → WebP `-near_lossless`.** The hero is the only one.
- **Logos and icons → SVG.**
- **Size to about 2× the largest box the asset renders in**, not to the master.
  The numbers per asset are in the sections below.
- **The `.png` masters have been removed** (they were ~80 MB). `assets/` is now
  2.7 MB. Keep masters outside this folder if you need them again — every WebP
  here was encoded from one, so a re-encode needs the master back.

### WebP — DONE. Everything the page serves is WebP.

Total raster payload went **2.44 MB → 0.70 MB (−72%)**. No `<picture>` fallback:
WebP has been supported by every current browser since 2020.

**Encoded from the `.png` masters, never from the JPEGs.** Going
master → WebP avoids stacking two lossy passes; the intermediate `.jpg` files are
now unreferenced and kept only in case a fallback is ever wanted.

**Two different settings, because there are two kinds of image here.**

Photographs — lossy `-q 80` is invisible on gradients and grain:

```bash
cwebp -q 80 -resize 1800 0 -m 6 buildthepool.png -o buildthepool.webp   # rail: 1800px
cwebp -q 80 -resize 1700 0 -m 6 scheduleBuilder.png -o scheduleBuilder.webp  # features: 1700px
```

The hero — **`-near_lossless 60`, not `-q`**, and that is measured rather than
cautious. The hero is flat UI: large areas of pure white with fine dark text, which
is the content type lossy WebP handles worst. Compared at 2× magnification:

| Mode | Size | Verdict |
|---|---|---|
| source PNG | 595 KB | — |
| `-lossless` | 257 KB | clean |
| **`-near_lossless 60`** | **182 KB** | **clean — chosen** |
| `-q 95` | 107 KB | faint 8×8 block mottling across the white panels |
| `-q 90` | 78 KB | worse |

`near_lossless` stays inside the lossless coder, so flat fills stay flat and there
is no DCT blocking; it just quantises beforehand. Half the size of true lossless
with no visible cost. Alpha verified preserved (`webpinfo` → `Alpha: 1`).

```bash
cwebp -near_lossless 60 -m 6 -alpha_q 100 hero-net-pool.png -o hero-net-pool.webp
```

**Gotcha if you re-encode:** `cwebp -resize` and `sips -Z` round the odd dimension
differently — the features images came out 1700×**1182** from cwebp where sips gave
1181. The `width`/`height` attributes in `index.html` must match whichever tool
produced the served file.

`apple-touch-icon.png` stays PNG — iOS does not accept WebP for touch icons.

**Toolchain note:** `sips` on this machine reads WebP but cannot write it
(`Error: Can't write format: org.webmproject.webp`). `cwebp` was present at
`/opt/homebrew/bin/cwebp` but broken by a missing `libtiff.6.dylib`; fixed with
`brew install libtiff`.

## Logo

| File | What it is |
|---|---|
| `logoWordmarkColour.svg` | 142×41 lockup, `#03045E` body + `#21ABF0` accent. Used on the white scrolled nav. |
| `logoWordmarkWhite.svg` | Same geometry, single-colour white. Used over the field and in the footer. |
| `favicon.svg` | Generated — the mark's two paths alone, transparent. |
| `apple-touch-icon.png` | Generated — 180×180, white mark on `#03045E`, **opaque**. |

Both icons are derived from the lockup, so re-exporting the logo means
regenerating them. The mark is the left 44×40 of the lockup (2 paths); the
wordmark is the remaining 9. The wordmark is illegible below ~100px wide, which
is why the icons are the mark alone.

The touch icon is deliberately opaque: iOS composites a transparent one onto
black, which would swallow the mark's `#03045E` body and leave only the cyan
accent floating.

**Open question:** the logo's `#03045E` / `#21ABF0` are in no design token, and
the cyan clashes with the page's `#2563EB` action blue. See `DESIGN.md` § Open 1.

## "Everything the matter needs" (#features) — COMPLETE (3 rows)

| Row | Feature | File served |
|---|---|---|
| 1 | Schedule builder | `scheduleBuilder.webp` (1700×1182, 34 KB) |
| 2 | Proposal and split slider | `splitSlider.webp` (1700×1182, 29 KB) |
| 3 | Share the offer | `shareProposal.webp` (1700×1182, 41 KB) |

Two further rows — *Respond, item by item* and *Downloadable outputs* — were
**removed** rather than left unfilled: one empty frame among filled ones reads as a
gap, not a placeholder. Neither message was lost (both appear in the how-it-works
rail, steps 3 and 1). If either returns, it needs a 16:10 asset and must be
`bleed-left` to keep the alternation running.

**These three ARE cropped**, unlike the hero and the rail. They are 1.439:1 in
16:10 frames, so `cover` takes ~5% off the top and bottom. That is safe here and
was not safe there: the hero is a device on a transparent ground where a crop cuts
the bezel, whereas these are photographs with wall above and desk below. Holding
16:10 also keeps the rows of this section to one rhythm — rating each frame
to its own asset would step the heights of a stack whose whole effect is
regularity. Verified: the monitor keeps headroom at the crop.

Same note as the step images applies — warm photographic register, and the app UI
is small because the monitor occupies about half the frame. On the white sheet the
warm tone sits far more comfortably than it does on the navy field, so this section
suffers less from it than the rail does.

## How-it-works step images — IN PLACE

Ordered by filename, matching the three step headings:

| # | Step | File served |
|---|---|---|
| 1 | Build the pool | `buildthepool.webp` (1800×1251, 90 KB) |
| 2 | Propose a split | `proposeSplit.webp` (1800×1251, 118 KB) |
| 3 | Share and negotiate | `shareandnegotiate.webp` (1800×1251, 219 KB) |

**Re-encoded, and that is not a preference.** The delivered files were 5120×3558
PNGs at 14–16 MB each — 45 MB for three photographs in one section. PNG is
lossless, for flat UI and transparency; these are photographs with gradients,
shadows and film grain. At 1800px wide (about 2× the largest size the rail renders
them at) and `-q 80` they are **150–190× smaller** with no visible loss. The `.png`
masters have since been removed from this folder.

All three are 1.439:1 and the frames read that from `--step-ratio` on `:root`, so
nothing is cropped or letterboxed. Re-export at a different ratio and that one
token is the only thing to change.

### Two things worth a decision

1. **`shareandnegotiate` has a compositing fault.** The screen's contents
   bleed down out of the screen onto the laptop's keyboard and palm rest — party
   names, `$1,000,000` / `$500,000` values and blue slider lines are all painted
   on the keys — and there is a green sliver along the bottom edge of the base.
   It is plainly visible at the size the rail renders it. Wired in as delivered,
   because cropping it away would take the agree/disagree controls with it, and
   those are what step 3 is about. **Needs a re-render.**
2. **These sit in a different visual language from the hero.** The hero is a flat,
   transparent, screen-only render that dissolves into the navy field. These are
   warm photographic lifestyle shots — beige wall and wood in #1, orange wood and
   concrete in #3 — set as opaque rectangles on a cool navy field. Two product-shot
   languages inside one scroll, and the warm/cool clash is strongest on #1 and #3.
   A related consequence: because the laptop occupies less than half the frame,
   the app UI is small — the assets table in #1 is not readable at the rendered
   size, which works against a caption that promises "cropped to the entry table".
   Options: re-render these as flat screen-only shots to match the hero; crop them
   much tighter to the screen; or keep the photography and accept that the hero is
   the odd one out.

## hero-net-pool.webp — IN PLACE

The monitor mockup of the Smith Family matter overview, used by the hero stage
(section 1b in `index.html`).

Served as **hero-net-pool.webp** — 2360 × 1708, transparent, margins trimmed, 182 KB.
Both of its ancestors have been removed from this folder, and that is fine. 2360px
is not an arbitrary size: the device is capped at `max-width: 1180px` and the
parallax scales it to 1.035× at entry, so the widest it can ever render is 1221 CSS
px — 2443 device px at 2×. The asset is within 3.4% of that at the most-zoomed frame
of the parallax and at or above 1:1 everywhere else. Nothing of the device was lost
in the trim either; only transparent margin was removed, so the WebP can still be
re-cropped, just not enlarged.

More resolution would only matter if the 1180px cap were raised, or if the shot were
reused outside this page at a larger size. The thing actually worth keeping is the
**design file that exported it** — the PNG was itself a derivative, and any content
fix (see below) has to start there regardless.

### What the page requires of this asset

- **A transparent background.** The stage draws no fill in device mode, so a
  white matte around the monitor lands as a white slab in the middle of the navy
  field. This is the one requirement that will visibly break the page if missed.
  The delivered file was correct on this.
- **Margins trimmed tight to the device.** The delivered master carried 16% dead
  height above the monitor and ~10% down each side, which made the product shot
  about a fifth smaller than the frame allows and pushed the hero copy further
  from it. Trimmed here with `sips` to the alpha bounding box.
- **Any aspect ratio.** The frame takes its height from the image (the image is
  in flow, not `object-fit`), so nothing needs to agree with a declared ratio and
  there is no letterboxing to avoid. This used to be a 3:2 requirement; it isn't
  one any more.
- **`width` / `height` in the markup must match the file.** They are what reserves
  space before the largest element on the page loads. Currently 2360 × 1708.

### If the asset is ever re-exported

The stage's fade is a mask whose stops are measured off *this file's* geometry —
in the trimmed version the screen content ends at 77.6% of the image height and
the stand starts at 80.3%, and the fade runs from 74% so it dissolves the bottom
quarter: stand, bezel, and the last sliver of screen. A re-export with a different
amount of stand, or a different crop, moves those numbers and the mask stops in
`6a. THE STAGE` have to move with them. Everything else in the page adapts on its
own.

If you re-export with **more room below the screen** — a taller stand, or a little
transparent space under it — the dissolve gets a longer runway and can start lower
in the screen without touching the property pool. That is the one asset change
that would make this effect better rather than merely different.

### Known content errors in the mockup (not code)

- **Amanda (Solicitor) shows `john@email.com.au`** — the same address as John
  Smith, and she has no surname. Two parties sharing an email is the wrong
  detail to put in front of solicitors.
- **The first asset row reads `E $1,200,000.00`** — a stray `E` that the other
  two rows don't have.

Both are visible at full size in the hero and want fixing in the source mockup.
