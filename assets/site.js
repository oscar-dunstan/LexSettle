/* ==========================================================================
   LEX SETTLE — SHARED SITE SCRIPT
   ==========================================================================
   Extracted verbatim from index.html: the nav sheet, the mobile menu and the
   silk field shader. Every page has a nav and a field, so every page loads
   this; index.html keeps only its own furniture (the pinned rail, the shot
   fallbacks, the scroll reveal) inline.

   `allowMotion` is recomputed in index.html's inline script rather than
   exported — it is one matchMedia call, and a shared global for it would be
   a wider contract than the fact deserves.
   ========================================================================== */
(function () {
  'use strict';

  /* --- Nav: transparent over the hero, white sheet once scrolled --- */
  var nav = document.getElementById('nav');
  /* TWO INDEPENDENT REASONS for the white sheet, and they have to be evaluated
     together. Scroll position is one; an open mobile menu is the other, because
     the panel is a white sheet and a transparent bar above it leaves the panel
     hanging off nothing.
     This used to be `scrollY > 40` alone, which meant the scroll handler and the
     menu toggle fought over the same class: opening the menu set it, and the very
     next scroll event — a touch drag, or the one an anchor jump fires — took it
     straight back off, stranding a white panel on a transparent bar over the
     field. Reproduced at scrollY 0 by dispatching one scroll event. */
  var navSheet = function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 40 || panel.classList.contains('is-open'));
  };

  /* --- Mobile menu --- */
  var toggle = document.getElementById('navtoggle');
  var panel  = document.getElementById('navpanel');
  /* One function owns the panel's state, because the two callers below used to set
     it independently and disagreed: closing via a link cleared `is-open` and
     aria-expanded but left aria-label reading "Close menu", so the button
     announced the wrong action for the rest of the session. */
  function setMenu(open) {
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navSheet();                       /* one owner for the class — see above */
  }
  toggle.addEventListener('click', function () {
    setMenu(!panel.classList.contains('is-open'));
  });
  panel.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  /* Escape closes it and returns focus to the control that opened it — without
     this, dismissing by keyboard is impossible and focus is left inside a panel
     that visibility has just removed from the tree. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* Bound here rather than beside navSheet's definition: it reads `panel`, which
     is only assigned above. */
  navSheet();
  window.addEventListener('scroll', navSheet, { passive: true });

  var allowMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     THE SILK FIELD

     One fragment shader, no library, ~2KB of GLSL. Two rounds of domain
     warping through a gradient-noise fBm: fbm(p) warps into q, q warps into r,
     r warps the final sample. That chain is what produces folds — a crease
     with a direction and a ridge. Blurred circles cannot make one.

     BUDGET, because an always-on background effect that costs anything real is
     a bug:
     · Half resolution at DPR capped to 1.25. The output is a smooth gradient,
       so the upscale is invisible, and the CSS grain layer on top covers what
       little softness is left. ~0.16× the fragments of a naive full-res canvas.
     · Three octaves, three fbm calls per pixel, and a hash with no
       transcendental in it. The usual sin-based hash costs 8 sin per noise
       lookup — ~100 per pixel here, which is what makes this kind of shader
       janky on integrated graphics.
     · 30fps. The field drifts at 0.035 units/second; the difference between 30
       and 60 is not perceptible at that speed, and it halves the GPU cost.
     · failIfMajorPerformanceCaveat, so a software renderer declines the context
       and the CSS blob field runs instead of a 4fps canvas.
     · Paused entirely while the tab is hidden.

     COLOUR IS A CONTRACT. Every emitted pixel is a mix of the five palette
     colours, and the sheen is `mix(col, peak, s)` — never `col += s`. That
     keeps the output inside the convex hull of the palette, so the field's
     brightest possible pixel is exactly --field-peak and the contrast figures
     in the token block are guarantees rather than samples.

     Reduced motion: one static frame. The silk is still there, it just holds
     still — strictly better than dropping to the fallback.
     ------------------------------------------------------------------------ */
  (function silkField() {
    var field  = document.getElementById('field');
    var canvas = document.getElementById('field-gl');
    if (!field || !canvas) return;

    var gl;
    try {
      gl = canvas.getContext('webgl', {
        alpha: false, antialias: false, depth: false, stencil: false,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: true,
        /* NOT optional, and the failure it prevents is invisible in testing.
           By default the drawing buffer is cleared after every composite, so
           anything that renders a single static frame — the reduced-motion
           path here, or the whole page while the tab is backgrounded — shows
           an empty buffer on the next repaint. With alpha:false an empty
           buffer composites as opaque BLACK, so the field doesn't degrade,
           it disappears. */
        preserveDrawingBuffer: true
      });
    } catch (e) { return; }
    if (!gl) return;

    var VERT =
      'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

    var FRAG = [
      'precision highp float;',
      'uniform vec2 u_res;',
      'uniform vec2 u_d1,u_d2;',
      'uniform vec2 u_grain;',
      'uniform float u_push;',
      'uniform float u_warp;',
      'uniform vec2 u_ptr;',
      'uniform vec3 c0,c1,c2,c3,c4;',

      /* Cheap ALU hash — no sin. Returns a signed 2D gradient. */
      'vec2 hash2(vec2 p){',
      '  vec3 q=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));',
      '  q+=dot(q,q.yzx+33.33);',
      '  return -1.+2.*fract((q.xx+q.yz)*q.zy);',
      '}',

      /* Gradient (Perlin-style) noise: smoother than value noise, which
         matters because value noise's axis-aligned lattice shows up as a grid
         once you warp the domain twice. */
      'float noise(vec2 p){',
      '  vec2 i=floor(p),f=fract(p);',
      '  vec2 u=f*f*(3.-2.*f);',
      '  return mix(mix(dot(hash2(i),f),dot(hash2(i+vec2(1,0)),f-vec2(1,0)),u.x),',
      '             mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)),dot(hash2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);',
      '}',

      /* THREE octaves with a STEEP amplitude falloff (0.38, not 0.5), so the
         second and third contribute shape rather than texture. The reference's
         field is, structurally, a defocused mesh gradient: about four very
         large soft regions across the whole viewport and no hard edge anywhere.
         Standard 0.5 falloff over four octaves is how you get fine filament
         detail, which is the wrong material entirely. */
      'float fbm(vec2 p){',
      '  float a=.5,v=0.;',
      '  mat2 m=mat2(.8,.6,-.6,.8);',
      '  for(int i=0;i<3;i++){v+=a*noise(p);p=m*p*2.02;a*=.38;}',
      '  return v;',
      '}',

      'void main(){',
      '  vec2 uv=gl_FragCoord.xy/u_res;',
      '  vec2 asp=vec2(u_res.x/u_res.y,1.);',
      '  vec2 sp=(uv-.5)*asp;',

      /* THE CURSOR DEFORMS THE MATERIAL, it does not light it.
         The sampling coordinate is displaced locally around the pointer, so the
         folds themselves bulge and slide as you move through them — the field
         behaves like cloth being pushed rather than an image reacting to input.

         Displacement happens HERE, in aspect-corrected screen space, before the
         rotation and the anisotropic squash. Applying it after would push along
         the squashed axis and the deformation would come out skewed, reading as
         a lens artefact rather than as a material.

         Two components, both scaled by a gaussian falloff so there is never a
         hard bubble edge:
         · radial, pushing the pattern away from the cursor
         · tangential, stirring it around the cursor
         The tangential term is driven ENTIRELY by u_push (pointer speed). At
         rest almost nothing happens: a static deformation pinned to the cursor
         is just a lens stuck to the mouse. The field should answer movement, not
         presence. */
      '  vec2 mp=u_ptr*.5*asp;',
      '  vec2 dv=sp-mp;',
      '  float dd=length(dv);',
      '  float fall=exp(-dd*dd*3.2);',
      /* Displacement is proportional to dv, NOT to normalize(dv). This is the
         whole difference between a material and a lens. A normalized direction
         is discontinuous at the cursor: every fragment around it is pushed at
         full magnitude away from a single point, which pinches into a vortex
         with visible radiating spokes — measured and rejected in the first
         build of this effect. Scaling by dv itself sends displacement to zero
         AT the cursor, peaks it at dd≈0.4 (roughly a fifth of the screen away),
         and decays smoothly outward: a broad soft swell with no centre. */
      '  sp+=fall*(dv*(.14+.45*u_push)+vec2(-dv.y,dv.x)*(.40*u_push));',

      /* BROAD. 0.95 puts roughly one and a half lobes across a desktop screen.
         Earlier builds ran at 1.9-2.9, which is what made this read as smoke:
         dozens of small forms instead of a few large ones. The reference has so
         few features you can count them. */
      '  vec2 p=sp*.95;',
      /* Rotate the domain ~25 degrees, THEN squash one axis. Squashing before
         rotating would elongate the forms horizontally, which reads as haze
         layers; doing it after gives diagonal elongation, which is how cloth
         hangs and is the direction the reference's folds run. */
      '  p=mat2(.906,-.423,.423,.906)*p;',
      '  p.x*=.62;',
      /* A small whole-field lean toward the cursor on top of the local
         deformation, so the response has a scale larger than the bulge. */
      '  p+=u_ptr*.04;',

      /* ONE MILD WARP, strength 0.65.
         The previous build warped twice at 2.4 and 1.9 and then drew a ridge
         term off length(r). That combination is not a subtle version of this
         one, it is a different material: warping the domain hard enough to fold
         it back on itself produces curl, and a smoothstep on the warp magnitude
         draws a thin bright line along every curl. Thin bright lines over fine
         octaves IS smoke. There is no ridge term here at all, and the warp only
         goes far enough to stop the regions reading as circles.

         MOTION IS BOUNDED. Advancing the offsets linearly with time translates
         the sample point through an unbounded noise landscape: the field
         genuinely drifts, but into whatever is over there, and some
         neighbourhoods are flat. Tested two minutes in, an early build had
         wandered somewhere with nothing in frame. u_d1/u_d2 are slow Lissajous
         offsets on a fixed radius, so the gradient morphs and the regions travel
         while the composition never leaves the neighbourhood that was
         art-directed. Computed on the CPU: they depend only on time, so making
         every fragment evaluate four sines would be per-pixel work for a
         per-frame value. */
      '  vec2 q=vec2(fbm(p+u_d1),fbm(p+vec2(4.7,2.1)+u_d1.yx));',
      '  float f=fbm(p+u_warp*q+u_d2);',

      /* Wide gain, centred. The reference's power is its RANGE — near-black
         troughs against bright steel — not its mean. */
      '  float m=clamp(f*1.75+.56,0.,1.);',
      '  m=smoothstep(.02,.98,m);',

      /* Weighted toward the top of the ramp on purpose. The reference reads as
         a mid-blue page with dark pockets, not a dark page with light pockets —
         its MEAN is high while its peak stays bounded. Raising the mean is free
         against the contrast contract; raising the peak is not. */
      '  vec3 col=mix(c0,c1,smoothstep(0.,.18,m));',
      '  col=mix(col,c2,smoothstep(.10,.46,m));',
      '  col=mix(col,c3,smoothstep(.38,.88,m));',

      /* Cobalt pooled low-left, holding the app blue on the field.
         Written as 1.0 - smoothstep(lo, hi, x), NOT smoothstep(hi, lo, x):
         reversed edges are UNDEFINED in GLSL and this driver returns ~1
         everywhere, which floods the field with a flat cobalt wash and erases
         the structure. It looks like a tuning problem, not a bug. */
      '  float pool=1.-smoothstep(.12,.88,uv.y+uv.x*.40);',
      '  col=mix(col,c4,pool*smoothstep(.46,1.,m)*.34);',

      /* ONE LIGHT DIRECTION. Most of the page's copy is left-set, so the left is
         the shaded side and the bright region lives out right. Mixed toward c1,
         never toward black, so the output stays inside the palette hull.

         This is a MARGIN, not the legibility mechanism — it used to be described
         as the latter, which mattered when the hero copy was centred and started
         extending into the brighter right-hand side. Nothing had to change,
         because the guarantee never came from here: the convex hull caps the
         field's brightest possible pixel at --field-peak, where --on-field-soft
         still measures 4.70:1. The shading only ever bought extra headroom on the
         side the copy happened to be on. */
      '  col=mix(col,c1,(1.-smoothstep(0.,.72,uv.x))*.16);',

      /* DITHER ONLY — the film grain is NOT done here, and that is a resolution
         decision rather than a stylistic one. This buffer renders at half scale
         and is upscaled by CSS, so per-fragment noise arrives on screen as ~2px
         blocks: chunky digital noise, not grain. Grain has to be native
         resolution, so it lives in .field__grain over the top (see § 1. THE
         FIELD). What stays here is a sub-LSB dither, which is all that is
         needed to stop an 8-bit ramp this dark from banding.

         SUBTRACTIVE, and that is the contrast contract rather than taste. The
         previous term was `col += d*.004` with d signed in -1..1, which is a
         symmetric dither — and symmetric means half of it is additive. Measured
         on the live canvas it put the brightest pixel at #3B67B4, one step above
         --field-peak, so the convex-hull guarantee that the whole token block
         rests on was false by about 1 LSB (soft copy 4.62:1 rather than 4.70:1).
         Folded to 0..1 and subtracted, the dither can only ever darken, so the
         hull holds by construction and the peak is exactly --field-peak again.
         Band-breaking is indifferent to the sign — a ramp this dark only needs
         sub-LSB variation, not variation in both directions. */
      '  float d=hash2(gl_FragCoord.xy+u_grain).x*.5+.5;',
      '  col-=d*.004;',

      '  gl_FragColor=vec4(col,1.);',
      '}'
    ].join('\n');

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }

    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes  = gl.getUniformLocation(prog, 'u_res');
    var uD1   = gl.getUniformLocation(prog, 'u_d1');
    var uGrain= gl.getUniformLocation(prog, 'u_grain');
    var uD2   = gl.getUniformLocation(prog, 'u_d2');
    var uPtr  = gl.getUniformLocation(prog, 'u_ptr');
    var uPush = gl.getUniformLocation(prog, 'u_push');
    var uWarp = gl.getUniformLocation(prog, 'u_warp');

    /* Palette read from the tokens, so :root stays the single source of truth
       and the contrast contract can't drift out of sync with the CSS. */
    var cs = getComputedStyle(document.documentElement);
    function rgb(name, fallback) {
      var v = (cs.getPropertyValue(name) || '').trim() || fallback;
      var h = v.replace('#', '');
      if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
      var n = parseInt(h, 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
    var pal = [
      ['c0', rgb('--field-trough', '#04081A')],
      ['c1', rgb('--field-deep',   '#131F3C')],
      ['c2', rgb('--field-mid',    '#243D70')],
      ['c3', rgb('--field-peak',   '#3A66B2')],
      ['c4', rgb('--field-cobalt', '#2B57D6')]
    ];
    pal.forEach(function (e) {
      gl.uniform3f.apply(gl, [gl.getUniformLocation(prog, e[0])].concat(e[1]));
    });

    var SCALE = 0.5;
    var w = 0, h = 0;
    /* Sized from the viewport, not from canvas.clientWidth. The canvas is laid
       out inside .field, which carries `contain: strict` — size containment
       there makes the element's box an unreliable thing to measure a render
       buffer from, and the CSS already pins the canvas to exactly 100vw x 100vh.
       So ask the viewport directly. */
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      var vw = window.innerWidth  || document.documentElement.clientWidth  || 0;
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      /* A zero viewport is a real state — a backgrounded or prerendered tab, a
         hidden iframe — and it must not be *recorded*. Clamping it to a 2px
         buffer and storing that in w/h means the size looks "current" forever
         after: nothing fires a resize event when a hidden tab is shown, so the
         field would run at 2x2 for the life of the page, which reads as one
         flat colour rather than as a broken canvas. Bail instead and let the
         ResizeObserver below deliver the first real box. */
      if (vw < 2 || vh < 2) return false;
      var nw = Math.max(2, Math.round(vw * dpr * SCALE));
      var nh = Math.max(2, Math.round(vh * dpr * SCALE));
      if (nw === w && nh === h) return false;
      w = nw; h = nh;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      return true;
    }

    /* --- POINTER: A SPRING, NOT A LERP -------------------------------------
       The field's response to the cursor is integrated as a damped spring
       rather than eased toward the target, and that is the whole difference
       between physical and mechanical. A lerp can only ever approach the
       target, so a fast flick looks like the field is being dragged along a
       rail. A spring stores the energy of the movement: flick and the field
       overshoots, swells, and settles back over about a second.

       `push` is the swell — pointer SPEED, normalised and smoothed, driving the
       deformation's amplitude and all of its tangential stir. It is what makes
       the field answer movement rather than mere presence: hold the cursor
       still and the material comes back to rest under it.

       Asymmetric smoothing on push (fast attack, slow release) because that is
       how the eye reads impact: the swell should arrive with the gesture and
       decay after it, not fade in behind it. --- */
    var px = 0, py = 0;      /* spring position, -1..1 */
    var vx = 0, vy = 0;      /* spring velocity */
    var tx = 0, ty = 0;      /* raw pointer target */
    var push = 0;            /* smoothed speed, 0..1 */
    var K = 0.14, DAMP = 0.76;

    if (allowMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('pointermove', function (e) {
        tx = (e.clientX / window.innerWidth)  * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
      /* Cursor leaves the window: ease the material back to centre rather than
         freezing it mid-deformation. */
      document.addEventListener('pointerleave', function () { tx = 0; ty = 0; }, { passive: true });
    }

    function spring() {
      vx = (vx + (tx - px) * K) * DAMP;
      vy = (vy + (ty - py) * K) * DAMP;
      px += vx;
      py += vy;
      /* Spring velocity, not raw pointer delta — so the swell follows the
         material's motion and inherits the overshoot rather than spiking on a
         single mousemove and vanishing. */
      var speed = Math.min(1, Math.sqrt(vx * vx + vy * vy) * 11);
      /* Attack 0.34, release 0.10. Simulated at 30fps a flick peaks at 0.99 and
         is down to 0.11 by 1.5s and 0.03 by 2s. The first build released at
         0.045, which still measured 0.34 a second and a half after the gesture
         had stopped — the deformation visibly lagged the cursor by seconds and
         read as the page being slow rather than the material being soft. */
      push += (speed - push) * (speed > push ? 0.34 : 0.10);
    }

    var t0 = performance.now();
    var last = 0;
    var STEP = 1000 / 30;
    var raf = 0;
    /* False until the canvas has a real render size. Nothing may draw before
       then: with u_res still unset, uv divides by zero and every fragment
       resolves to the same non-colour — so drawing early doesn't look like a
       sizing bug, it looks like the shader is a flat fill. */
    var ready = false;
    /* Set once the GPU context is gone. Terminal on purpose — see the
       webglcontextlost handler below. Every path that could hand the field back
       to the canvas is gated on it, because a resize or a tab becoming visible
       must not re-add .is-gl over a context that can no longer paint. */
    var lost = false;

    /* One frame, uniforms and all. Factored out because THREE callers need to be
       able to paint, not just the loop: the loop, the handover, and — the one
       that was missing and turned the field black — a resize. */
    function paint(seconds) {
      gl.uniform2f(uPtr, px, py);
      gl.uniform1f(uPush, push);
      drift(seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function clock() { return allowMotion ? (performance.now() - t0) / 1000 : 0; }

    function draw(now) {
      raf = 0;
      if (lost) return;
      if (document.hidden) return;                 /* resumed by visibilitychange */
      if (!ready) { raf = requestAnimationFrame(draw); return; }
      if (now - last >= STEP) {
        last = now;
        spring();
        paint((now - t0) / 1000);
      }
      raf = requestAnimationFrame(draw);
    }

    /* --- THE AUTONOMOUS DRIFT: A NOISE WALK, NOT A LISSAJOUS ----------------
       The field wanders on its own, independently of the cursor, and the shape
       of that wander matters more than its speed.

       The first build drove the warp offsets with sine pairs. Those are smooth
       and bounded, which is why they were chosen — but a Lissajous figure is a
       *closed path*: the field eases out along a route and then eases back down
       the same one. Watch it for a minute and you feel the return stroke. It
       reads as a mechanism, not as weather.

       These offsets are instead driven by smooth 1-D value noise over time —
       two octaves, one per axis, four independent seeds. The heading changes
       unpredictably and the path never closes, so there is no return stroke to
       notice. It keeps the property that made sines attractive: fbm1 is bounded
       to ±1 by construction (0.65 + 0.35), so the offsets are still hard-capped
       and the composition cannot wander out of the neighbourhood that was
       art-directed.

       PACE AND REACH were both raised after the first two builds read as static,
       and the cap that had been holding them down turned out to be inherited
       from a shader that no longer exists. The old ±0.42 limit existed because
       the smoke-era field had genuinely flat neighbourhoods to avoid. This
       construction does not: sweeping the offsets out to a radius of 5.0 and
       measuring, structure (luminance σ) stays in 0.016–0.048 and the peak never
       moves. There is nowhere bad to wander to, so the reach is now 1.4 rather
       than 0.42.

       Rate is what the eye actually reads as "alive", not reach. WANDER = 0.11
       against a reach of 1.4 gives a peak of roughly 23% of a feature width per
       second — about four times the first build, which moved 5% and read as
       still.

       TRANSLATION ALONE IS NOT ENOUGH at this rate: sliding a broad blob field
       past itself looks like a texture on a conveyor. u_warp modulates the warp
       STRENGTH on its own noise channel, so the forms reshape as well as move —
       the field breathes between smoother and more folded. That is most of what
       makes it read as weather rather than as a pan. --- */
    var WANDER = 0.11;
    var REACH1 = 1.4, REACH2 = 1.0;

    /* Deterministic 0..1 hash. sin() is fine here: this runs four times a frame
       on the CPU, not once per pixel. */
    function h1(n) {
      var x = Math.sin(n * 12.9898) * 43758.5453123;
      return x - Math.floor(x);
    }
    function vnoise(x, seed) {
      var i = Math.floor(x), f = x - i;
      var u = f * f * (3 - 2 * f);                 /* smoothstep, so C1 continuous */
      var a = h1(i + seed), b = h1(i + 1 + seed);
      return (a + (b - a) * u) * 2 - 1;            /* -1..1 */
    }
    function fbm1(x, seed) {
      return vnoise(x, seed) * 0.65 + vnoise(x * 2.13, seed + 31.7) * 0.35;
    }

    function drift(s) {
      var w = s * WANDER;
      gl.uniform2f(uD1, fbm1(w, 11.3) * REACH1, fbm1(w, 57.1) * REACH1);
      gl.uniform2f(uD2, fbm1(w * 0.77, 91.7) * REACH2, fbm1(w * 0.61, 133.3) * REACH2);
      /* Warp strength on its own slower channel: 0.30 .. 0.86. Low end is a
         smooth wash, high end is distinctly folded, and crossing between them is
         the shape change that translation cannot produce. */
      gl.uniform1f(uWarp, 0.58 + fbm1(w * 0.62, 201.5) * 0.28);
      /* Grain seed, stepped at 10Hz. Reseeding every frame is buzz; the
         reference steps once a second. 10Hz is the cinematic middle. Two
         uncorrelated components so the hash gets a genuinely new lattice
         rather than a translated one. */
      var k = Math.floor(s * 10);
      gl.uniform2f(uGrain, (k % 71) * 13.137, (k % 53) * 7.919);
    }

    /* Paint one real frame, then hand the field over. Both are gated on having
       a size: if the page loaded into a zero-height viewport, the blob field
       keeps running and the handover simply waits for the first real box. */
    function activate() {
      if (ready || lost) return;
      ready = true;
      paint(clock());
      field.classList.add('is-gl');
    }
    if (resize()) activate();

    /* Resizing is event-driven, not per-frame: reading innerWidth in the draw
       loop would flush layout 30 times a second for a value that changes twice
       a session. Orientation change on iOS reports the old size synchronously,
       hence the deferred second pass. */
    var reflow = function () {
      if (lost) return;
      if (!resize()) return;
      if (!ready) { activate(); return; }
      /* REPAINT NOW, ALWAYS. Setting canvas.width reallocates the drawing buffer,
         which clears it — and with alpha:false an empty buffer composites as
         opaque BLACK, over a blob fallback that .is-gl has already withdrawn. So
         the window between a resize and the next painted frame is not a slightly
         stale field, it is a black one.

         This used to repaint only under reduced motion, on the reasoning that the
         animation loop would cover the other case on its next tick. It does not
         always get a tick: draw() returns without rescheduling while
         document.hidden is true, and "hidden" is not the same as "not being
         composited" — a prerendered page, an embedded webview, and the preview
         pane this was built in all report hidden while still being painted to a
         screen. In exactly those surfaces the field stayed black for the life of
         the page. Even where the loop is running, deferring means a black frame
         for up to a 30fps tick on every resize step, which flickers through a
         window drag.

         Painting here is one draw call against an event that fires twice a
         session. There is no case where waiting was worth it. */
      paint(clock());
    };
    window.addEventListener('resize', reflow, { passive: true });
    window.addEventListener('orientationchange', function () {
      reflow();
      setTimeout(reflow, 250);
    }, { passive: true });

    /* The canvas's own box is the one signal that arrives whether or not a
       resize event does — it fires on first layout, and again if the element
       ever gets a real box after starting at zero. This is what recovers the
       field for a tab that loaded hidden. */
    if (window.ResizeObserver) {
      new ResizeObserver(reflow).observe(canvas);
    }

    /* --- CONTEXT LOSS: HAND THE FIELD BACK TO THE FALLBACK ------------------
       A GPU context is not guaranteed for the life of a page — a driver reset,
       a GPU process crash, or the browser evicting the oldest context because
       another tab wanted one all take it away, and mobile does the last of those
       routinely. Without this the failure is total rather than graceful: the
       canvas stops painting, and because `.is-gl` has already withdrawn the blob
       field to `visibility: hidden`, the fallback that exists for exactly this
       moment stays hidden. The page would sit on flat --field-base with no
       field at all.

       Dropping `.is-gl` reverses both halves in one line — the canvas fades back
       to opacity 0 and the blobs return with their animations.

       preventDefault() is deliberately NOT called. It is what makes a context
       *restorable*, and restoring means rebuilding the program, buffer and every
       uniform. That path would run once in a blue moon, on the hardware least
       able to tell us it broke, and it can only ever arrive back at what the CSS
       fallback is already showing. Not worth the code that can rot untested. --- */
    canvas.addEventListener('webglcontextlost', function () {
      lost = true;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      ready = false;
      field.classList.remove('is-gl');
    }, { passive: true });

    if (allowMotion) {
      raf = requestAnimationFrame(draw);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
        } else if (!raf && !lost) {
          reflow();
          /* Rebase the clock: the field should pick up where it left off, not
             jump forward by however long the tab was in the background. Guarded
             on `last`, because if the tab was hidden before the first animated
             frame ever ran, `last` is 0 and this would push t0 into next week. */
          if (last) t0 += performance.now() - last;
          last = 0;
          raf = requestAnimationFrame(draw);
        }
      });
    }
  })();
})();
