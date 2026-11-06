// Scroll animations: sections marked [data-reveal] fade/slide in as they enter the
// viewport, and digits inside [data-roll] spin like slot-machine reels to their value.
// With reduced motion (or no IntersectionObserver) everything is shown as-is.

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

export default function initMotion() {
  const sections = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  document.querySelectorAll("[data-roll]").forEach(buildReels);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15, rootMargin: "0px 0px -10% 0px"});

  sections.forEach((section) => observer.observe(section));
}
