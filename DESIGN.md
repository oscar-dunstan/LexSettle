# DESIGN.md — Lex Settle marketing homepage

Durable visual decisions for the homepage prototype (`index.html`) and the
Webflow rebuild that follows it. Product truth lives in `CLAUDE.md`; this file
only covers how the surface looks and behaves.

Status: **v1, provisional.** Tokens below are what the first build settled on.
They are derived from the Lex Settle app UI, not from a confirmed brand kit —
if Amanda produces one, it replaces this file's colour and type sections.

---

## The world

**One continuous field.** A single fixed navy/indigo **silk** sits behind the
entire document and never scrolls. The page moves over it in **whole regions**,
never in floating panels. The parallax is structural, not scripted — the field
is fixed, the page moves.

The field is a WebGL fragment shader. Structurally it is a **defocused mesh
gradient**: roughly one and a half very large soft regions across a desktop
viewport, elongated on a ~25° diagonal, with no hard edge anywhere — plus
native-resolution animated film grain on a layer above it. The five blurred
radial blobs it replaced are kept as the no-WebGL fallback.

**It was built wrong once, and the failure is worth recording** because it is the
obvious way to build it. v1 warped the domain twice at strengths 2.4 and 1.9 over
four octaves and then drew a ridge term off `length(r)`. Warping hard enough to
fold the domain back on itself produces curl; a `smoothstep` on the warp
magnitude draws a thin bright line along every curl; thin bright lines over fine
octaves is **smoke**, not cloth. The current build is not a toned-down version of
that — it is a different construction: one mild warp at 0.65, three octaves with
a steep 0.38 falloff, and **no ridge term at all.**

The idea it carries: a property settlement is two parties standing on one
shared surface. The field is that surface; the single white sheet is the
paperwork laid on top of it.

**The still room.** The field is not continuous for the whole dark run, and the
break is load-bearing. The stage's mask needs calm ground to dissolve into; the
first build made that a passing shade — deepen to solid, lift straight back —
and it read as a lighting artefact, because a ground that exists for 200px is
not a ground, it is a gradient.

Held instead, it becomes the page's second idea. You fall out of the moving
field into a room that is completely still, **the problem is stated there on
solid ground**, and the field — movement, life — only returns when the product
does, at "How it works". The still ground is the same colour as the footer, so
the page has two grounds of one colour: one alive, one not. The argument is made
on the one that isn't.

So the sequence is field → still navy → field → white sheet → field → footer.
The dark passages are one *colour* throughout; what changes is whether it moves.
This supersedes the original "one long fall through the field, interrupted once".
The still room is also the only dark ground where a third text tier is legible —
`--on-field-faint` measures 7.35:1 on solid `--field-base` against 2.7:1 on the
live field — so the audience strip's kicker uses it there and nowhere else.

**Cards are not page structure.** This is the load-bearing rule. A card is a
small rectangle with its own fill, radius and shadow floating on a larger
surface — and a *column* of them is the exact gesture the category default is
built from. Repeated cards are banned outright.

Two objects on the page are allowed to lift off their ground, and both earn it
by being singular: the **stage frame** (the product, in the first viewport) and
the **price card** (the thing you are being asked to buy). Everything else is a
whole region, a hairline, an image well cut into the sheet, or a knockout.
Depth is exactly two tokens for exactly those two objects — reaching for a
third means a card is being drawn that shouldn't be.

Reference: tiwis.fr (pinned by the designer). What is borrowed: the silk-gradient
motion, the knockout type, and the pacing — white type on the field, then a
sideways-scrolling passage with no ground of its own, then the white sheet,
then vertical scroll again. The borrowing extends to *technique*: the reference's
field is a WebGL shader, and that turned out to be the reason it folds. What is
not borrowed: the structure.

Second reference (pinned): a product mockup dissolving out of its own lower edge
into the ground beneath it. Adopted as the gesture, and — after building it both
ways — the centred hero copy that comes with it. This reverses an earlier ruling
that centring traded an editorial voice for the generic hero. That ruling was
sound while the product sat in a right-hand column; the stage replaced that column
with a centred 1180px device directly under the copy, and left-set copy over a
centred object gives the first viewport two competing axes, which reads as a
mistake rather than as asymmetry. The copy is narrower than the device it sits
over, so it reads as a caption to the product. See § Stage.
Everything below the hero is still left-set — the centring is an argument about
one shared axis in the first viewport, not a change of voice.

**Anti-reference:** the default legal-tech / SaaS homepage — flat white ground,
one screenshot in a drop-shadowed card, three icon-plus-heading tiles.

---

## Colour

Strategy: **drenched ground, restrained content.** The field owns the page at
full saturation; inside the white slabs, neutrals plus one blue accent.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Slab surfaces |
| `--color-surface` | `#F7F8FA` | Tinted slab, screenshot frames |
| `--color-border` | `#E5E7EB` | Hairlines, rules, outline buttons |
| `--color-ink` | `#131A24` | Headings on white |
| `--color-navy` | `#1B2A4A` | Gradient partner, step numerals |
| `--color-indigo` | `#2B3A7A` | Gradient partner |
| `--color-primary` | `#2563EB` | Primary action, section kickers |
| `--color-accent` | `#16A34A` | Positive / agreed state **only** |
| `--accent-on-field` | `#4ADE80` | The same green, lightened to clear the dark ground |
| `--color-text` | `#374151` | Body on white |
| `--color-muted` | `#6B7280` | Secondary on white |

Field-specific. **This table is a contrast contract, not a palette.**
`--field-peak` is the brightest colour either field renderer may emit. Measured
over a 36-minute drift sweep the brightest pixel on the whole field reaches
L 0.137, giving **white 5.6:1 and `--on-field-soft` 4.7:1** — the ceiling is
enforced by construction, not by hoping (see the hull rule below).

Raising the peak costs the secondary text tier: at L 0.18 only pure white clears
4.5:1, which is what the reference does and why its field can be so much
brighter. This palette keeps a real second tier instead, and buys brightness by
raising the field's **mean** (0.044–0.090 across the sweep, ~2.4× the first
build) rather than its peak. Mean is free against the contract; peak is not.

| Token | Value | L | Use |
|---|---|---|---|
| `--field-base` | `#0C1526` | .008 | Deepest ground; the footer; the stage trough |
| `--field-trough` | `#04081A` | .003 | Shader: deepest pocket |
| `--field-deep` | `#131F3C` | .014 | Shader: shaded region |
| `--field-mid` | `#243D70` | .049 | Shader: the field's home tone |
| `--field-peak` | `#3A66B2` | **.136** | Shader + fallback: the lit region. **The ceiling.** |
| `--field-cobalt` | `#2B57D6` | .122 | Shader + fallback: the app blue, pooled low-left |
| `--field-shadow` | `#0A1424` | .006 | Fallback shadow blob |
| `--on-field` | `#FFFFFF` | — | Headings on the field — measured **5.6:1** |
| `--on-field-soft` | `#E4EBF5` | — | Body **and tertiary** on the field — measured **4.7:1** |
| `--on-field-faint` | `#8FA6C8` | — | **Solid `--field-base` only** (footer) — 7.35:1 |

**Rules**

- Secondary text on the field is tinted from the field hue (`--on-field-*`).
  Never neutral grey on the gradient.
- **The live field carries two text tiers, not three.** A third, dimmer tier is
  arithmetically impossible: at the field's brightest, a tertiary colour would
  have to be as light as `--on-field-soft` to clear 4.5:1, so it would not be
  dimmer. Tertiary on the field is made with the `.label` treatment —
  uppercase, 0.14em tracking, 600 — separating it by typography instead of by
  contrast. `--on-field-faint` measured 2.7:1 against the field's bright
  regions and is now confined to the solid-navy footer.
- **Chroma is free; luminance is not.** The first cool-palette build read grey
  rather than blue, and the fix was not to brighten it — luminance is capped by
  the contract — but to raise saturation at constant L. Because L is 71% green,
  dropping green while raising blue buys a large amount of chroma for nothing:
  mean saturation went 0.34 → 0.52 with the peak's L unchanged at .136. Any
  future "make it more X" request should try this axis first.
- **The grain layer blends `soft-light`, not `overlay`.** Overlay with a
  greyscale noise texture drags saturation out of exactly the midtones this field
  lives in, and was a contributing cause of the grey reading. soft-light grains
  just as legibly and leaves chroma alone.
- **`--on-field-soft` moves with the peak.** It was `#C6D4EA`; when the field was
  brightened to match the reference that fell to 3.5:1 and had to lift to
  `#E4EBF5`. Any future change to `--field-peak` requires re-deriving it.
- **Both renderers obey the ceiling.** The shader mixes only between the palette
  colours — `mix(col, peak, s)`, never `col += s` — so output stays inside the
  convex hull and the peak is provably the maximum. The CSS fallback draws from
  the same capped list. A contract that only holds on the fast path is not one.
- Green is reserved for agreement/positive state. It is not a second brand
  colour and never appears as a surface fill.
- Elevation shadows are neutral and carry a y-offset. No chromatic glows —
  a blue-tinted shadow under a blue button on a dark ground is the tell.
  (The radial gradients in `.field` are the committed world, not decoration,
  and are the one exception to "no coloured radial washes".)

---

## Type

**Inter**, variable, 300–800. Pinned by the brief: it matches the app and is
Webflow-native. The design detector flags Inter as an overused face — that
finding is knowingly overridden here, not missed.

| Token | Value |
|---|---|
| `--fs-display` | `clamp(2.9rem, 6.6vw, 5.5rem)` |
| `--fs-h2` | `clamp(2.05rem, 4.1vw, 3.4rem)` |
| `--fs-h3` | `clamp(1.3rem, 1.9vw, 1.65rem)` |
| `--fs-lead` | `clamp(1.08rem, 1.5vw, 1.3rem)` |
| `--fs-body` | `1.0625rem` |
| `--fs-small` | `0.9375rem` |
| `--fs-label` | `0.75rem` |

- Display tracking `-0.038em`, headings `-0.028em`. Tight is the point.
- Body line-height `1.65`, measure capped at `68ch` (`--measure`).
- Headings use `text-wrap: balance`.
- Prices and figures use `font-variant-numeric: tabular-nums` (`.tnum`).
- `.label` (uppercase, `0.14em` tracking) is a **named kicker**, used only for
  section kickers, screenshot frame labels and footer column heads. It is not
  an eyebrow over every section.

---

## Layout & shape

| Token | Value |
|---|---|
| `--maxw` | `1240px` |
| `--gutter` | `clamp(1.25rem, 4vw, 4rem)` |
| `--section-y` | `clamp(4.5rem, 9vw, 8.5rem)` — rhythm inside the white run |
| `--field-y` | `clamp(5rem, 11vw, 10rem)` — rhythm on the field |
| `--rail-pad` | viewport edge → container edge; also drives the full-bleed frames |
| `--r-slab` | `clamp(20px, 2.4vw, 34px)` — price card only |
| `--r-card` | `16px` — stage frame only, and only below 1024px |
| `--r-pill` | `999px` (all buttons) |

Rhythm: more space above a heading than below it. A dense passage (features)
is followed by a quiet one (who it's for), and the page closes on the field
before the solid footer anchors it.

**Section treatment.** The page falls through the field, rests once on still
navy, and is interrupted once by a single white sheet. The sequence — the two
ground changes and the change in scroll axis at step 4 — is the structure:

| Section | Ground |
|---|---|
| 0 Nav | Transparent → white sheet on scroll |
| 1 Hero | Field — copy only, centred on the device below it, no right column |
| 1b Stage | Field **deepening to solid** — the product frame, edge to edge, dissolving out of its own lower edge |
| 2 Audience strip | **The still room** — solid `--field-base`, no motion |
| 3 Problem | **The still room** — large white type, hairline columns, no panel |
| 4 How it works | **Lifting** back to the live field — **pinned rail**: scroll turns sideways |
| 5 → | **Knockout**: the white sheet opens on cut-out type |
| 5 Features | The white run — vertical scroll, frames bleeding off the edge |
| 6 Who it's for | The white run, continued past a hairline |
| 7 Pricing | Field, single white card — the `$44` **knocked out** of it |
| 8 Reassurance | Field |
| 9 Final CTA | **Knockout**, closing on white |
| 10 Footer | Solid `--field-base` |

The white run is one sheet, entered and left once. Breaking it into two would
cost the page the thing the sequence is for.

---

## Motion

Four authored moments in different registers so they never compete: one is
ambient and unprompted, one answers the cursor, and two only happen because the
visitor scrolls — and those two are separated by the length of the page.

**1. The field's drift, plus its grain.** Ambient — it runs whether or not anyone
is scrolling or pointing, and it is deliberately independent of the cursor.

**The drift is a noise walk, not a Lissajous.** Sine pairs were the first build:
smooth and bounded, which is why they were chosen. But a Lissajous figure is a
*closed path* — the field eases out along a route and eases back down the same
one, and after a minute you feel the return stroke. It reads as a mechanism
rather than as weather. The offsets are now driven by smooth 1-D value noise over
time (two octaves per axis, four independent seeds), so the heading changes
unpredictably and the path never closes. Measured over 30 minutes: **154
direction reversals versus ~27 for the sine version.**

`fbm1` is bounded to ±1 by construction (0.65 + 0.35), so the offsets are still
hard-capped — but the cap is now **1.4, not 0.42**, and that change came from
retiring an assumption rather than from taste. The tight cap existed because the
smoke-era field had genuinely flat neighbourhoods to avoid. This construction does
not: sweeping the offsets out to a radius of 5.0 and measuring, structure
(luminance σ) stays in 0.016–0.048 and the peak never moves. **There is nowhere
bad to wander to.** Any future "it's too subtle" should re-measure this envelope
before assuming a limit still applies.

**Rate, not reach, is what the eye reads as alive** — and two earlier builds were
tuned on the wrong one. Pace is 0.11 against a reach of 1.4, giving a peak of
about 23% of a feature width per second; measured, the image changes by a median
5.4/255 every second. The first build moved 5% of a feature per second and read
as still.

**Translation alone is not enough at this rate**: sliding a broad blob field past
itself looks like a texture on a conveyor. `u_warp` modulates the warp *strength*
on its own slower noise channel (0.30–0.86), so the forms reshape as well as move
and the field breathes between smoother and more folded. That is most of what
makes it read as weather rather than as a pan.

The grain is the second half of it, and it is **not** in the shader. The field
buffer renders at half scale and is upscaled, so per-fragment noise arrives as
~2px blocks — chunky digital noise rather than grain. `.field__grain` is a DOM
layer at native resolution stepping `transform` through ten offsets a second
(`steps(1, end)`, so the texture is held and swapped rather than slid — sliding
reads as drifting paper). Transform is the only property here that stays on the
compositor; animating `background-position` would repaint a full-viewport layer
ten times a second. The shader keeps a sub-LSB dither (0.004) purely against
banding.

*Why bounded and not linear:* advancing the offsets linearly with time is the
obvious implementation and it is wrong. The sample point translates through an
unbounded noise landscape, so the field genuinely drifts — into whatever is over
there. Tested two minutes in, an early build had wandered somewhere with no
folds in frame at all. Bounded offsets morph the silk and move the creases while
never leaving the neighbourhood that was art-directed. Verified by sampling a
40-minute sweep: structure (luminance σ) holds at 0.013–0.017 and never
collapses. **An effect that is only good when you happen to look is not done.**

*Budget*, because an always-on background that costs anything real is a bug:
half resolution at DPR capped to 1.25 (~0.16× the fragments of a naive full-res
canvas), four octaves, a hash with no transcendental in it, 30fps, paused while
the tab is hidden, and `failIfMajorPerformanceCaveat` so a software renderer
declines the context and the CSS field runs instead of a 4fps canvas.

**2. The cursor deforms the field.** Not lights it — *deforms* it. The sampling
coordinate is displaced locally around the pointer, so the folds themselves bulge
and slide as you move through them and the field behaves like cloth being pushed
rather than an image reacting to input. Desktop pointers only
(`(hover: hover) and (pointer: fine)`), off under reduced motion.

Three things make it read as material rather than as an effect, and each replaced
a version that didn't:

- **Displacement is proportional to distance, not to a normalised direction.** A
  normalised direction is discontinuous at the cursor — every fragment around it
  pushed at full magnitude away from one point — which pinches into a vortex with
  radiating spokes. Scaling by the offset vector itself sends displacement to
  *zero at the cursor*, peaks it about a fifth of a screen away, and decays
  smoothly: a broad swell with no centre.
- **The response is a damped spring, not a lerp.** A lerp can only approach its
  target, so a fast flick looks like the field is dragged along a rail. The
  spring stores the gesture's energy: measured at 30fps it overshoots the target
  by 0.27 and settles over about 1.5s.
- **The swell is driven by speed, and released faster than it attacks** (attack
  0.34, release 0.10). At rest almost nothing happens — a static deformation
  pinned to the cursor is just a lens stuck to the mouse, and the field should
  answer movement, not presence. The first release constant of 0.045 still
  measured 0.34 a second and a half after the gesture stopped, which read as the
  page being slow rather than the material being soft.

Displacement happens in aspect-corrected screen space **before** the rotation and
anisotropic squash; applying it after pushes along the squashed axis and the
deformation comes out skewed, reading as a lens artefact.

It cannot break the colour contract: deformation changes only the *input*
coordinates to the noise, so the output is still a convex combination of the
palette. Verified across 36 combinations of pointer position, full push and drift
phase — worst-case peak L 0.139, white 5.6:1, body 4.6:1.

**3. The stage's parallax** (section 1b). The product frame travels at ~0.9× page
speed on a CSS `view()` scroll timeline — no scroll listener, no rAF, nothing to
fall out of sync on resize. Where the timeline is unsupported (Firefox) the frame
is static and the mask carries the whole effect.

**4. The pinned rail** (section 4). The section sticks to the viewport and the
three steps travel sideways as you keep scrolling down; vertical gesture is
converted into horizontal movement, then handed back. This is the page's one
scroll event, and it is placed at the hinge of the argument — the point where
the page stops describing the problem and starts showing the product.

- Progress is a pure function of position (`-track.top / travel`), not an
  accumulator, so it survives resize, reload and restored scroll positions.
- A progress hairline under the heading is the affordance. Without it the
  section reads as a static row and visitors don't know to keep scrolling.
- **Base mode is the real markup**, not a fallback: a native `overflow-x` rail
  with scroll-snap that works with no JS, under reduced motion, and on any
  screen under 900×620. Pinning is added on top and can be withdrawn at any
  width without leaving a hole.
- Pinned, a step is a wide slide — copy left, 5:4 frame at full stage height.
  Stacked tiles fit three-up on a desktop screen, which leaves ~90px to travel:
  the section would pin for a whole viewport and give back nothing.
- `body` uses `overflow-x: clip`, not `hidden`. `hidden` makes `<body>` a scroll
  container and silently breaks the sticky pin.

Supporting motion only:

- Hero entrance (`[data-enter]`, 760ms, staggered 0/90/140/180/250ms) plays on
  load so the first viewport is never caught mid-transition.
- Below-fold reveal (`[data-reveal]`, opacity + 12px rise, 520ms) via
  IntersectionObserver. **Opt-in:** content is fully visible without JS; the
  hidden initial state is only applied once `.js-motion` is set.
  **Sets only, and the restriction is the rule.** It ran on 19 elements — every
  section heading, most paragraphs, all three feature rows — which is the pattern
  that reads as a template: the same fade-and-rise on everything you scroll past,
  which flattens the two authored moments into two more things that moved. It now
  runs on exactly two groups that are lists and stagger because they are lists:
  the three ways a settlement gets stuck, and the two sides of the table. Five
  elements. Everywhere else, content is simply there — against a field that is
  already moving, that reads as composure.
  Timing came down with it: 900ms over 20px was a slide, and a three-item stagger
  at that length finished nearly a second and a half after it began.
- The mobile menu **wipes** rather than appears (`clip-path` inset from its own top
  edge, 380ms open / 300ms close) and the toggle's three lines fold into a close
  mark, driven off `[aria-expanded]` so the state has one source. It is the page's
  only remaining discrete state change, and it used to be the only one with no
  motion at all. Two constraints shaped it: the panel is `position: absolute` so
  the fixed header's hit box stays the bar's height, and closed it is
  `visibility: hidden` rather than transparent so its six links leave the tab
  order and the accessibility tree.
- Easing is exponential ease-out: `cubic-bezier(.16, 1, .3, 1)`.
- `prefers-reduced-motion: reduce` disables the hero entrance, the stage
  parallax and the reveal observer, stops the fallback blobs, and makes the
  shader→CSS handover instant instead of a crossfade. The **shader still
  renders** — one static frame, so the silk is present and simply holds still.
  That is strictly better than dropping to the fallback.

Performance bounds: blobs animate `transform` only, `contain: strict` on the
field, blur stepped 90px → 130px at ≥768px. `will-change: transform` while the
blobs *are* the field, then **released to `auto` under `.is-gl`** — once the shader
takes over they are hidden with their animation off, and five promoted over-bleed
layers held on the GPU for nothing is a cost paid exactly on the hardware the
fallback exists to serve.

**Two shader traps, both of which fail silently and look like design problems:**

- `preserveDrawingBuffer` is **not optional**. By default the drawing buffer is
  cleared after every composite, so anything rendering a single static frame —
  the reduced-motion path, or the whole page while backgrounded — shows an empty
  buffer on the next repaint. With `alpha: false` an empty buffer composites as
  opaque **black**: the field doesn't degrade, it disappears.
- **Never record a zero viewport.** A hidden or prerendered tab measures 0.
  Clamping that to a 2px buffer and storing it makes the size look current
  forever after — nothing fires a `resize` when a hidden tab is shown — so the
  field runs at 2×2 for the life of the page, which reads as one flat colour.
  `resize()` bails instead, and a `ResizeObserver` on the canvas delivers the
  first real box. Nothing draws, and the handover does not happen, until then.

---

## Components

- **Buttons** — pill, min-height 48px (54px `--lg`). Four variants:
  `--light` / `--ghost` on the field, `--primary` / `--outline` on white.
  Tap targets ≥44px everywhere.
- **Knockout** (`.knockout`, `.pricecut`) — the page's one visual device. Type is
  cut out of a white sheet with `mix-blend-mode: lighten` and pure-black type,
  so the live gradient reads through the letterforms. Used **three times**: to
  open the white run, for the `$44`, and to close the page. Repetition is what
  makes it a system rather than a trick — but three is the ceiling. A fourth
  would make it wallpaper.
  · **Display sizes only.** At kicker or body size the letterforms are too thin
    to survive the blend, and a cut-out letter can land on a bright part of the
    field where small text would fall under 4.5:1.
  · Only works because `.page` creates no stacking context and `.field` sits at
    `z-index: -1`. **No ancestor of a `.knockout` may carry `transform`,
    `opacity` or `filter`** — any of the three would trap the blend and the type
    would go flat black. Fallbacks are wired for `@supports not` and
    `forced-colors`.
- **White run** (`.white-run`) — one continuous full-bleed white sheet, edge to
  edge, entered via the opening knockout so it never just starts. Not floating
  panels: the page alternates whole regions.
- **Price card** (`.pricecard`) — white, `--r-slab`, `--shadow-slab`, centred on
  the field. The one card on the page. It is not licence for a second one.
  · **Built from three pieces, and it has to be.** The `$44` is a knockout, and
    a blend composites against whatever is painted beneath it — so if the card
    painted its own white fill behind the price, `lighten` would resolve black
    against white and the figures would vanish. The card therefore has
    `background: transparent`: two white sheets sit above and below, and the
    price band between them is the only part with no white behind it.
  · The wrapper still carries the radius and the shadow. An outer box-shadow is
    clipped to outside the border box, so it never enters the blend's backdrop —
    the card keeps its depth and the cutout still works.
  · Blending the whole card instead is simpler and wrong: `lighten` erases every
    shadow darker than the field, so the card loses the elevation that makes it
    a card.
  · All three pieces are pure `#fff`, and **they overlap by 1px** — the negative
    margins on `.pricecut` and `.pricecard__sheet--bottom` are load-bearing, not
    leftovers. Because the card paints no background, the pieces meet over raw
    transparency; their edges land on fractional device pixels, both sides
    antialias the boundary, and the two partial alphas don't sum to 1, so the
    dark field leaks through the shortfall as a hairline. It hides at 1:1 on
    some displays and is obvious at 2x zoom. The overlap puts opaque white on
    both sides of every junction.
  · **No `[data-reveal]` on this card.** The reveal animates opacity, and an
    opacity below 1 creates a stacking context that traps the blend — the price
    would flash solid black before settling.
- **Screenshot frame** (`.shot`) — an image well, not a card: square corners,
  flat fill, no shadow. Above `1024px` feature frames run off the viewport edge
  (`.bleed-left` / `.bleed-right`, alternating) so a column of screenshots
  cannot resolve into a column of cards. The dashed hairline is the placeholder
  tell and goes when the asset lands. On the rail the frames drop their fill
  entirely — that section's whole point is having no background.
  **No app UI is ever invented here.** Every frame names the exact screen the
  designer must supply, and the real asset drops in via `.shot__img`; if the file
  is absent the script removes the element so the labelled placeholder shows
  rather than a broken frame.
- **The stage** (`.stage`, `.shot--stage`) — the hero's product frame, and the
  one object that outgrows the container. Above 1024px it goes edge to edge and
  becomes a window cut into the page rather than an object placed on it; a frame
  that stops at the same 1240px the paragraphs stop at is a card in a column
  whatever else is done to it. Radius and side borders are dropped at that width
  because those edges are off-screen. It replaces the old right-column portrait
  frame, and it is still the one elevated object in the first viewport.
  · **The fade is an alpha mask, not a gradient overlay in a flat colour.** That
    is the whole difference: masked to transparency the frame dissolves into
    whatever the field is actually doing behind it, so it keeps working while the
    silk moves. An overlay would have to guess a single colour, and the moment
    the field drifted the "fade" would read as a smear of the wrong navy.
  · What a mask cannot fix is a *busy* ground — a fold passing under the fade
    edge reads as dirt rather than depth. So the stage carries a veil that
    deepens to solid `--field-base`, and the next section lifts it again.
    **The deepening is not a backdrop for the parallax, it IS the handoff.**
    Remove it and the effect doesn't get subtler, it gets grubby.
  · **The veil goes solid BEFORE the mask starts fading — 70% of the frame
    against 78%.** That ordering is the effect. It used to arrive at ~92%, after
    the fade had already begun, so the stand dissolved against a ground that was
    itself still a gradient: the device read as an object on a lit field with a
    fade under it, rather than as the screen morphing out of the darker section.
    The dissolve has to happen on dark that is already established.
  · Two numbers hold it: the device's top edge sits at ~0.35 veil alpha (dark
    enough that the ground has visibly turned by the bottom of the monitor, light
    enough that the lit field still reads behind the top of it), and the veil is
    solid by 70% of the frame. **The reach is a percentage of the stage, not
    `vh`** — the frame's height comes from its width, so a viewport-relative
    reach let both numbers drift with the window's aspect ratio: the alpha at the
    device's top edge ranged from 0.19 to 0.41 across two ordinary desktop sizes.
    As a percentage it resolves against the stage and holds to within 0.04.
  · Stops: full to 74%, gone by 100% — **the fade covers the bottom quarter of
    the image.** It reaches up past the stand and the bezel into the last few
    percent of the screen, because a fade that stops below the device leaves a
    crisply-edged monitor with a dissolve underneath it, and a complete object
    with a fade below it does not read as emerging from anything. The image's own
    edge has to go soft for the screen to morph out of the dark.
    Measured against the asset: screen content ends at 77.6% of the image height,
    the monitor body ends and the stand begins at 80.3%. So the bottom sliver of
    the screen sits at ~0.90 alpha — and the content there is the "Liabilities"
    row the mockup crops mid-row anyway, so the fade dissolves an awkward crop
    rather than hiding data. The whole *Current Combined Property Pool* block ends
    at 74% and is untouched; taking the first stop below ~72% would break that.
    Re-exporting the asset means re-measuring all of these.
    The stops this replaces were full-to-46%, written before the asset existed,
    against an assumption that a device mockup is mostly device. It isn't — this
    one is 78% screen — so at 46% the *Current Combined Property Pool* block sat
    between 30% and 70% alpha and the schedule of assets and liabilities was the
    most faded thing in the frame. The old brief, "everything that has to be read
    must sit in the top 46% of the crop", was asking for a mockup nobody could
    supply. The working range is narrow: below ~72% the fade eats the property
    pool, above ~80% it stops touching the device at all.
  · **Vertical only.** A horizontal fade was built and removed: softening the
    left and right edges only makes sense if those edges are off-screen, and with
    the frame's own gutters they weren't — a 9% side ramp spent its whole budget
    greying ~67px of actual screenshot on each side, measured and visible at a
    1200px viewport.
  · The `box-shadow` is masked along with everything else, so depth fades out
    with the image instead of outlining a rectangle that has already dissolved.
  · **Two asset kinds, opposite treatments.** A raw screen capture wants a
    WINDOW: full bleed, `object-fit: cover`, the frame's own edge doing the
    framing. A device mockup already contains its own frame, so the window has to
    get out of the way — otherwise there are two frames, and `cover` crops the
    bezel the mockup was drawn to show. `.is-device` strips the fill, border,
    radius, backdrop blur and shadow, and caps the width: the frame stops being
    an object and becomes a transparent area an image sits in. The mask still
    runs, so the monitor's stand dissolves into the still room rather than
    ending — which is why a stand is not a problem here.
  · **No declared ratio, and no `contain`.** The image sits in flow and the
    frame's height *is* the image's height. A frame with its own `aspect-ratio`
    has to agree with the asset's, and the same brief that asks for margins
    trimmed tight to the device is a brief that changes the asset's ratio —
    whichever way the two disagree, `contain` letterboxes, and letterbox inside
    this frame is dead height that pushes the device up out of the fade. That is
    the exact failure trimming was meant to prevent, so the ratio is not declared
    at all. Any asset ratio now works, and only the `width`/`height` attributes
    have to match the file.
  · **`.is-device` is scoped to `:has(.shot__img)`.** Unscoped it stripped the
    fill, border, shadow and padding whether or not an image was there, so with
    the asset missing the frame was a transparent box with the placeholder label
    floating at the top of it — 658px of empty navy at 1440×900, measured. The
    one frame that most needed the missing-asset fallback was the only one
    without it. Scoped, a missing asset falls back to the full glass placeholder
    like every other frame.
  · The device asset **must have a transparent background.** Device mode draws no
    fill, so a white matte around the monitor lands as a white slab in the middle
    of the navy. It is the one requirement that visibly breaks the page.
**Not used, on purpose:** cards of any kind (see "No cards" above), same-size
icon-heading-text tiles as page structure, gradient text, glass as decoration,
coloured left-borders, section numbers outside the how-it-works sequence (where
the order is the information).

---

## Accessibility floor

- Heading order runs h1 → h2 → h3 with no skips; one h1.
- Body ≥4.5:1, large text ≥3:1, on both the white slabs and the field.
- Visible focus ring: 2px `--color-primary`, 3px offset; white on the field.
- Skip-to-content link before the nav.
- `.field` is `aria-hidden` and `pointer-events: none`.
- Mobile menu toggle carries `aria-expanded` / `aria-controls`; one function owns
  the panel's state so `aria-label` cannot go stale, Escape closes it and returns
  focus to the toggle, and the closed panel is `visibility: hidden` so its links
  are out of the tab order.
- **Interactive targets ≥24px** (WCAG 2.2 SC 2.5.8). The footer links were 18px
  inline links until they were given `inline-flex` and a min-height; the nav links
  had padding for this reason from the start.
- **No horizontal scroll at any width.** Two sources were found and contained, both
  by clipping the one section that produces them rather than the root (overflow on
  the root propagates to the viewport and would put the sticky pin at risk):
  the stage's parallax `scale(1.035)`, since a transformed box contributes to
  scrollable overflow; and the `.bleed-*` rows, because `--rail-pad` is derived from
  `100vw`, which includes the classic scrollbar while the layout width does not —
  71.2px against a true 64.2px at a 1280px window, so each bleeding row overshot by
  ~8px. The overshoot is clipped rather than corrected: the intent is flush to the
  edge, and a clipped overshoot *is* flush. **In the Webflow rebuild, use a
  full-bleed grid rather than a `vw` calculation and this stops existing.**

---

## Open

1. **Brand kit — the logo has landed and it does not share the page's palette.**
   `assets/logoWordmarkColour.svg` and `logoWordmarkWhite.svg` (142×41, mark +
   wordmark) are in and wired to the nav and footer. But the mark introduces two
   colours that are in no token: **`#03045E`** for the body and **`#21ABF0`** for
   the accent.
   · `#03045E` sits at almost exactly the luminance of `--color-ink` `#131A24`
     (contrast between them is 1.02:1) but is far more saturated. Same darkness,
     different colour — which is the mismatch you notice without being able to
     name it.
   · `#21ABF0` is a cyan; the page's action blue is `--color-primary` `#2563EB`.
     In the scrolled nav the logo's accent sits inches from a `#2563EB` button,
     and the two read as two different blues rather than one brand.
   The logo is wired in **as supplied** — no recolouring, because silently
   redrawing a brand asset to fit a prototype's palette is not a decision to make
   on the page's behalf. Three ways out, in order of how much they cost:
   adopt the logo's blues as the accent tokens; keep `#2563EB` and ask the brand
   for a lockup in it; or accept the two-blue system deliberately and keep the
   logo's cyan strictly to the logo. **Unresolved — needs a call.**
2. App screenshots — **every frame on the page is filled.** No placeholders remain.
   `#features` was cut from five rows to three: *Respond, item by item* and
   *Downloadable outputs* were removed rather than left unfilled, because a single
   empty frame in a section of filled ones reads as a gap, not as a placeholder.
   Neither message was lost — agree/disagree/comment is stated in rail step 3 and
   the downloadable schedule in rail step 1. If either returns it needs a 16:10
   asset, and the next row added must be `bleed-left` to keep the alternation.
   Outstanding on the assets that have landed:
   · The hero mockup has a solicitor sharing a party's email address, and a stray
     `E` on the first asset row.
   · `shareandnegotiate` has a compositing fault — screen contents painted onto
     the laptop keyboard, plus a green sliver at the base. Needs a re-render.
   · **Two product-shot languages now coexist.** The hero is a flat, transparent,
     screen-only render dissolving into the field; the three steps are warm
     photographic lifestyle shots sitting as opaque rectangles on it. Both are
     defensible; together they read as two decisions rather than one. The hero is
     now the only flat one, so the cheapest resolution is a flat re-render of the
     hero's screen in the photographic style, or vice versa. **Unresolved.**
3. Whether the nav's scrolled state should stay white or become dark glass to
   sit inside the field. White was chosen to match the brief. Now that the real
   screenshots are in, the white sheet is what the colour logo needs to sit on —
   dark glass would mean the white logo variant throughout and no swap at all.
