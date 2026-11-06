// Scroll animations: sections marked [data-reveal] fade/slide in as they enter the
// viewport, digits inside [data-roll] spin like slot-machine reels to their value,
// and the [data-rotate] headline phrase cycles with a decode effect.
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

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function renderDecode(el, from, to, progress) {
  // Length morphs from the old phrase to the new one; characters resolve to the
  // new phrase left to right, anything not yet resolved shows a dimmed glyph.
  const length = Math.round(from.length + (to.length - from.length) * Math.min(progress * 1.5, 1));
  const resolved = Math.floor(to.length * Math.max(0, (progress - 0.25) / 0.75));

  el.textContent = "";
  el.append(to.slice(0, resolved));
  if (resolved < length) {
    const noise = document.createElement("span");
    noise.className = "decode-glyph";
    let text = "";
    for (let i = resolved; i < length; i++) {
      text += to[i] === " " || (from[i] === " " && progress < 0.25) ? " " : randomGlyph();
    }
    noise.textContent = text;
    el.append(noise);
  }
}

// Returns {start, stop} so the rotation can follow the reduced-motion setting
function createRotator(el) {
  const phrases = JSON.parse(el.dataset.rotate);
  const heading = el.closest("h1") || el.parentElement;

  // Reserve the height of the tallest phrase so wrapping never shifts the page
  const reserveHeight = () => {
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
    const from = phrases[index];
    const to = phrases[next];
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / DECODE_MS, 1);
      renderDecode(el, from, to, progress);
      if (progress < 1) {
        frameId = requestAnimationFrame(frame);
      } else {
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
      window.removeEventListener("resize", reserveHeight);
      heading.style.minHeight = "";
      index = 0;
      el.textContent = phrases[0];
    }
  };
}

export default function initMotion() {
  const sections = document.querySelectorAll("[data-reveal]");
  const revealAll = () => sections.forEach((section) => section.classList.add("is-visible"));

  if (!("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  const rotators = [...document.querySelectorAll("[data-rotate]")].map(createRotator);

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
  };

  applyPreference();
  reducedMotion.addEventListener("change", applyPreference);
}
