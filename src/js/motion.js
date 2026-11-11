// Scroll animations: sections marked [data-reveal] fade/slide in as they enter the
// viewport, digits inside [data-roll] spin like slot-machine reels to their value,
// the [data-rotate] headline phrase cycles with a decode effect, and the [data-hero]
// background pattern drifts in layers as the page scrolls.
//
// Safeguards, matching the hover effects in ui.css:
// - Reduced motion is followed live: turning it on reveals everything, lands the
//   reels and parks the headline on its first phrase; turning it off resumes.
// - The headline only changes while visible, in a foreground tab, and not while
//   hovered or focused.
// - Without JS or IntersectionObserver, everything is shown as-is.

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const SPINS = 2; // full 0-9 cycles before landing on the digit

function buildReels(el) {
  const text = el.textContent.trim();
  el.setAttribute("aria-label", text);
  el.textContent = "";

  let digitIndex = 0;
  for (const char of text) {
    if (!/\d/.test(char)) {
      const span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
      span.textContent = char;
      el.appendChild(span);
      continue;
    }

    // The reel is sized by an invisible copy of the final digit so the resting
    // layout matches plain text; the strip of digits scrolls behind it.
    const reel = document.createElement("span");
    reel.className = "reel";
    reel.setAttribute("aria-hidden", "true");

    const sizer = document.createElement("span");
    sizer.className = "reel-sizer";
    sizer.textContent = char;

    const strip = document.createElement("span");
    strip.className = "reel-strip";
    const stops = [];
    for (let i = 0; i < SPINS * 10; i++) {
      stops.push(i % 10);
    }
    stops.push(Number(char));
    for (const digit of stops) {
      const cell = document.createElement("span");
      cell.textContent = digit;
      strip.appendChild(cell);
    }

    reel.style.setProperty("--reel-stop", stops.length - 1);
    reel.style.setProperty("--reel-delay", `${digitIndex * 90}ms`);
    reel.append(sizer, strip);
    el.appendChild(reel);
    digitIndex++;
  }
}

// Rotating headline phrase: every few seconds the text scrambles into random
// letters and digits and "decodes" into the next phrase left to right.
const HOLD_MS = 3000;
const DECODE_MS = 900;
const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomGlyph(glyphs = GLYPHS) {
  return glyphs[Math.floor(Math.random() * glyphs.length)];
}

// Draws the decode as an overlay so the headline never reflows mid-transition: the new phrase
// goes in as real (transparent) text straight away, fixing the layout, and each character gets
// a cell positioned over it that shows random glyphs until it resolves, left to right.
// Also used by generative.js, which passes its own glyphs.
export function createDecodeOverlay(el, text, glyphs = GLYPHS) {
  const host = el.closest("h1") || el.parentElement;
  if (getComputedStyle(host).position === "static") {
    host.style.position = "relative";
  }

  el.textContent = text;
  el.classList.add("is-decoding");

  const hostBox = host.getBoundingClientRect();
  const overlay = document.createElement("span");
  overlay.className = "decode-overlay";
  overlay.setAttribute("aria-hidden", "true");

  const cells = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      continue;
    }
    const range = document.createRange();
    range.setStart(el.firstChild, i);
    range.setEnd(el.firstChild, i + 1);
    const box = range.getBoundingClientRect();

    const cell = document.createElement("span");
    cell.className = "decode-cell";
    Object.assign(cell.style, {
      left: `${box.left - hostBox.left}px`,
      top: `${box.top - hostBox.top}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
      lineHeight: `${box.height}px`
    });
    overlay.appendChild(cell);
    cells.push({cell, char: text[i], index: i});
  }
  host.appendChild(overlay);

  return {
    render(progress) {
      const resolved = Math.floor(text.length * Math.max(0, (progress - 0.15) / 0.85));
      cells.forEach(({cell, char, index}) => {
        const done = index < resolved;
        cell.textContent = done ? char : randomGlyph(glyphs);
        cell.classList.toggle("is-resolved", done);
      });
    },
    remove() {
      overlay.remove();
      el.classList.remove("is-decoding");
    }
  };
}

// Returns {start, stop} so the rotation can follow the reduced-motion setting
function createRotator(el) {
  const phrases = JSON.parse(el.dataset.rotate);
  const heading = el.closest("h1") || el.parentElement;

  let overlay = null;

  // Reserve the height of the tallest phrase so wrapping never shifts the page
  const reserveHeight = () => {
    if (overlay) {
      return;
    }
    const current = el.textContent;
    heading.style.minHeight = "";
    let tallest = 0;
    for (const phrase of phrases) {
      el.textContent = phrase;
      tallest = Math.max(tallest, heading.offsetHeight);
    }
    el.textContent = current;
    heading.style.minHeight = `${tallest}px`;
  };

  let index = 0;
  let running = false;
  let inView = true;
  let paused = false;
  let timer;
  let frameId;

  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // Hold while off-screen, in a background tab, or hovered/focused
      if (!inView || document.hidden || paused) {
        schedule();
        return;
      }
      decodeTo((index + 1) % phrases.length);
    }, HOLD_MS);
  };

  const decodeTo = (next) => {
    overlay = createDecodeOverlay(el, phrases[next]);
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / DECODE_MS, 1);
      overlay.render(progress);
      if (progress < 1) {
        frameId = requestAnimationFrame(frame);
      } else {
        overlay.remove();
        overlay = null;
        index = next;
        schedule();
      }
    };
    frameId = requestAnimationFrame(frame);
  };

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
  }).observe(heading);

  heading.addEventListener("pointerenter", () => (paused = true));
  heading.addEventListener("pointerleave", () => (paused = false));
  heading.addEventListener("focusin", () => (paused = true));
  heading.addEventListener("focusout", () => (paused = false));

  return {
    start() {
      if (running || phrases.length < 2) {
        return;
      }
      running = true;
      reserveHeight();
      window.addEventListener("resize", reserveHeight);
      document.fonts.ready.then(() => running && reserveHeight());
      schedule();
    },
    stop() {
      running = false;
      clearTimeout(timer);
      cancelAnimationFrame(frameId);
      if (overlay) {
        overlay.remove();
        overlay = null;
      }
      window.removeEventListener("resize", reserveHeight);
      heading.style.minHeight = "";
      index = 0;
      el.textContent = phrases[0];
    }
  };
}

// Hero pattern draw-in timing: smaller shapes get longer durations (on a log scale) so they
// are visibly drawn rather than popping in, while long lines still finish promptly.
const DRAW_SHORTEST_MS = 935;
const DRAW_LONGEST_MS = 2210;

function timeHeroPattern(svg) {
  const shapes = [...svg.querySelectorAll("[pathLength]")];
  const lengths = shapes.map((shape) => shape.getTotalLength());
  const min = Math.log(Math.min(...lengths));
  const max = Math.log(Math.max(...lengths));

  shapes.forEach((shape, k) => {
    const size = max > min ? (Math.log(lengths[k]) - min) / (max - min) : 0.5; // 0 smallest, 1 largest
    const duration = DRAW_LONGEST_MS - size * (DRAW_LONGEST_MS - DRAW_SHORTEST_MS);
    shape.style.setProperty("--draw-duration", `${Math.round(duration)}ms`);
  });
}

// Hero pattern parallax: sets --hero-scroll from 0 (top of the page) to 1 (hero scrolled
// away); the CSS turns that into layer drift and fade. Returns {start, stop}.
function createHeroScroll(hero) {
  let frameId = null;
  let running = false;

  const update = () => {
    frameId = null;
    const progress = Math.min(Math.max(window.scrollY / (hero.offsetTop + hero.offsetHeight), 0), 1);
    hero.style.setProperty("--hero-scroll", progress.toFixed(3));
  };

  // Only do work while the hero is on screen; one last update when it leaves pins it at the end
  let inView = true;
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (running) {
      update();
    }
  }).observe(hero);

  const onScroll = () => {
    if (inView && frameId === null) {
      frameId = requestAnimationFrame(update);
    }
  };

  return {
    start() {
      if (running) {
        return;
      }
      running = true;
      window.addEventListener("scroll", onScroll, {passive: true});
      update();
    },
    stop() {
      running = false;
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameId);
      frameId = null;
      hero.style.removeProperty("--hero-scroll");
    }
  };
}

export default function initMotion() {
  const sections = document.querySelectorAll("[data-reveal]");
  const revealAll = () => sections.forEach((section) => section.classList.add("is-visible"));

  document.querySelectorAll("[data-hero-pattern]").forEach(timeHeroPattern);

  if (!("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  const rotators = [...document.querySelectorAll("[data-rotate]")].map(createRotator);
  const heroes = [...document.querySelectorAll("[data-hero]")].map(createHeroScroll);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15, rootMargin: "0px 0px -10% 0px"});

  let reelsBuilt = false;
  const applyPreference = () => {
    if (reducedMotion.matches) {
      // Show the final state straight away; the CSS lands any reels instantly
      observer.disconnect();
      revealAll();
      rotators.forEach((rotator) => rotator.stop());
      heroes.forEach((hero) => hero.stop());
      return;
    }

    // Reels are only built when motion is allowed; sections already revealed stay revealed
    if (!reelsBuilt) {
      document.querySelectorAll("[data-roll]").forEach(buildReels);
      reelsBuilt = true;
    }
    sections.forEach((section) => {
      if (!section.classList.contains("is-visible")) {
        observer.observe(section);
      }
    });
    rotators.forEach((rotator) => rotator.start());
    heroes.forEach((hero) => hero.start());
  };

  applyPreference();
  reducedMotion.addEventListener("change", applyPreference);
}
