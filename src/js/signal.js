// Generative hero for themed timelines: "digital products for an analog world".
//
// Horizontal signal lines run across a canvas and swell in thickness wherever they cross
// the [data-signal] text, so the letters emerge from the lines. On the left the signal is
// a smooth analog wave; past a moving boundary it is sampled into digital steps, and
// scrolling pushes that boundary across until the whole signal is digital.
//
// Only animates while on screen in a foreground tab. With reduced motion it draws one
// still frame, so the artwork is still there without moving.

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const INTRO_MS = 1800;
const BOUNDARY_START = 0.62; // where analog becomes digital at the top of the page, 0-1 across
const BOUNDARY_END = -0.3;
const BOUNDARY_SOFTNESS = 0.11;
const SIDE_MARGIN = 20; // px either side of the letters
const POINTER_RADIUS = 130;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, value) => {
  const t = clamp((value - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function createSignal(canvas) {
  const ctx = canvas.getContext("2d");
  const text = canvas.dataset.signal;
  const font = `"${canvas.dataset.signalFont}", sans-serif`;

  let width = 0;
  let height = 0;
  let spacing = 8;
  let step = 3;
  let mask = new Uint8Array(0);
  let maskWidth = 0;
  let maskHeight = 0;

  let frameId = null;
  let inView = true;
  let startedAt = null;
  const pointer = {x: 0, y: 0, strength: 0, target: 0};

  // Draws the text once, offscreen at half size, to give each line something to look up
  const buildMask = () => {
    maskWidth = Math.ceil(width / 2);
    maskHeight = Math.ceil(height / 2);
    if (!maskWidth || !maskHeight) {
      return;
    }
    const offscreen = document.createElement("canvas");
    offscreen.width = maskWidth;
    offscreen.height = maskHeight;
    const c = offscreen.getContext("2d", {willReadFrequently: true});

    const measure = (size) => {
      c.font = `600 ${size}px ${font}`;
      return c.measureText(text);
    };
    const ink = measure(100);
    const inkWidth = ink.actualBoundingBoxLeft + ink.actualBoundingBoxRight;
    const inkHeight = ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent;
    const size = 100 * Math.min((maskWidth - SIDE_MARGIN) / inkWidth, (maskHeight * 0.92) / inkHeight);

    const fitted = measure(size);
    const x = (maskWidth - fitted.actualBoundingBoxRight + fitted.actualBoundingBoxLeft) / 2;
    const y = (maskHeight + fitted.actualBoundingBoxAscent - fitted.actualBoundingBoxDescent) / 2;
    c.fillStyle = "#fff";
    c.fillText(text, x, y);

    const {data} = c.getImageData(0, 0, maskWidth, maskHeight);
    mask = new Uint8Array(maskWidth * maskHeight);
    for (let i = 0; i < mask.length; i++) {
      mask[i] = data[i * 4 + 3];
    }
  };

  const coverage = (x, y) => {
    const mx = clamp(Math.floor(x / 2), 0, maskWidth - 1);
    const my = clamp(Math.floor(y / 2), 0, maskHeight - 1);
    return mask[mx + my * maskWidth] / 255;
  };

  const wave = (x, line, t) => Math.sin(x * 0.012 + t * 1.1 + line * 0.16) * 0.5
    + Math.sin(x * 0.031 - t * 0.7 + line * 0.07) * 0.3
    + Math.sin(x * 0.0047 + t * 0.4) * 0.2;

  const draw = (now) => {
    const animated = !reducedMotion.matches;
    const t = animated ? now / 1000 : 2;
    const intro = animated ? clamp((now - startedAt) / INTRO_MS, 0, 1) : 1;
    const scrolled = animated && height ? clamp(window.scrollY / height, 0, 1) : 0;
    const boundary = lerp(BOUNDARY_START, BOUNDARY_END, scrolled);

    pointer.strength = lerp(pointer.strength, pointer.target, 0.08);

    const lines = Math.floor(height / spacing);
    const points = Math.floor(width / step) + 1;
    const top = new Float32Array(points);
    const bottom = new Float32Array(points);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#fff";
    ctx.beginPath();

    for (let line = 0; line < lines; line++) {
      const base = (line + 0.5) * spacing;

      for (let i = 0; i < points; i++) {
        const x = i * step;
        const across = x / width;

        // 0 is pure analog, 1 is fully sampled: each cell reads one value and holds it
        const digital = smoothstep(boundary - BOUNDARY_SOFTNESS, boundary + BOUNDARY_SOFTNESS, across);
        const cellCentre = (Math.floor(x / spacing) + 0.5) * spacing;
        const sampleX = lerp(x, cellCentre, digital);

        const inLetter = coverage(sampleX, base);

        let amplitude = spacing * 1.7 * (1 - inLetter * 0.8);
        if (pointer.strength > 0.01) {
          const distance = Math.hypot(x - pointer.x, base - pointer.y);
          amplitude += spacing * 3 * pointer.strength * Math.exp(-(distance * distance) / (2 * POINTER_RADIUS * POINTER_RADIUS));
        }

        const analogY = base + wave(sampleX, line, t) * amplitude;
        const quantum = spacing / 2;
        const y = lerp(analogY, Math.round(analogY / quantum) * quantum, digital);

        // Lines draw in from the left on load, in a slightly staggered sweep
        const sweep = intro * 1.35 - across - (line / lines) * 0.2;
        const reveal = smoothstep(0, 0.14, sweep);
        const thickness = lerp(0.7, spacing * 0.86, inLetter) * reveal;

        top[i] = y - thickness / 2;
        bottom[i] = y + thickness / 2;
      }

      ctx.moveTo(0, top[0]);
      for (let i = 1; i < points; i++) {
        ctx.lineTo(i * step, top[i]);
      }
      for (let i = points - 1; i >= 0; i--) {
        ctx.lineTo(i * step, bottom[i]);
      }
      ctx.closePath();
    }
    ctx.fill();
  };

  const loop = (now) => {
    draw(now);
    frameId = requestAnimationFrame(loop);
  };

  const stop = () => {
    cancelAnimationFrame(frameId);
    frameId = null;
  };

  const sync = () => {
    if (reducedMotion.matches) {
      stop();
      draw(performance.now());
      return;
    }
    if (!inView || document.hidden) {
      stop();
      return;
    }
    if (frameId === null) {
      startedAt = startedAt ?? performance.now();
      frameId = requestAnimationFrame(loop);
    }
  };

  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    spacing = Math.max(4, Math.round(width / 160));
    step = Math.max(2, width / 420);
    buildMask();
    if (startedAt !== null || reducedMotion.matches) {
      draw(performance.now());
    }
  };

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(canvas);

  new ResizeObserver(resize).observe(canvas);

  canvas.addEventListener("pointermove", (event) => {
    pointer.x = event.offsetX;
    pointer.y = event.offsetY;
    pointer.target = 1;
  });
  canvas.addEventListener("pointerleave", () => {
    pointer.target = 0;
  });

  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", sync);

  // The letters must be measured in the brand font, so wait for it (or give up and use the fallback)
  const fontReady = document.fonts?.load(`600 200px ${font}`, text) ?? Promise.resolve();
  fontReady.catch(() => {}).finally(() => {
    resize();
    sync();
  });
}

export default function initSignal() {
  document.querySelectorAll("[data-signal]").forEach(createSignal);
}
