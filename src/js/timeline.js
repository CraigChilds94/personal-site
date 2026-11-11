// Role timelines: the spine fills to a line just below the middle of the viewport, each
// node lights up as the spine reaches it, the current chapter's year is picked out, and
// key-moment images drift inside their frames. Moment reveals come from [data-reveal] in
// motion.js. With reduced motion the spine is simply full and nothing tracks the scroll.

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const ANCHOR = 0.62; // how far down the viewport the spine is drawn to
const PARALLAX = 7; // furthest an image drifts, as a % of its own height

// Offset from the top of the page, ignoring transforms so that a card
// measured part-way through its entrance reports where it will end up
function pageTop(el) {
  let top = 0;
  for (let node = el; node; node = node.offsetParent) {
    top += node.offsetTop;
  }
  return top;
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function createTimeline(root) {
  const track = root.querySelector("[data-timeline-track]");
  const nodes = [...track.querySelectorAll("[data-node]")].map((el) => ({el, top: 0}));
  const chapters = [...track.querySelectorAll("[data-chapter]")].map((el) => ({el, top: 0, bottom: 0}));
  const images = [...track.querySelectorAll("[data-parallax]")].map((el) => ({el, frame: el.parentElement, top: 0, height: 0}));

  let trackTop = 0;
  let trackHeight = 1;
  let frameId = null;

  const measure = () => {
    trackTop = pageTop(track);
    trackHeight = track.offsetHeight || 1;
    nodes.forEach((node) => {
      node.top = pageTop(node.el);
    });
    chapters.forEach((chapter) => {
      chapter.top = pageTop(chapter.el);
      chapter.bottom = chapter.top + chapter.el.offsetHeight;
    });
    images.forEach((image) => {
      image.top = pageTop(image.frame);
      image.height = image.frame.offsetHeight;
    });
  };

  const update = () => {
    frameId = null;
    const viewport = window.innerHeight;
    const line = window.scrollY + viewport * ANCHOR;
    const progress = clamp((line - trackTop) / trackHeight, 0, 1);

    track.style.setProperty("--tl-progress", progress.toFixed(4));
    track.style.setProperty("--tl-head", `${(progress * trackHeight).toFixed(1)}px`);
    track.style.setProperty("--tl-head-opacity", progress > 0 && progress < 1 ? "1" : "0");

    nodes.forEach(({el, top}) => el.classList.toggle("is-reached", top <= line));
    chapters.forEach(({el, top, bottom}) => el.classList.toggle("is-current", top <= line && line < bottom));

    images.forEach(({el, top, height}) => {
      const centre = top + height / 2 - window.scrollY;
      const travel = viewport / 2 + height / 2;
      const offset = centre - viewport / 2;
      if (Math.abs(offset) < travel) {
        el.style.transform = `translate3d(0, ${(-offset / travel * PARALLAX).toFixed(2)}%, 0)`;
      }
    });
  };

  const onScroll = () => {
    if (frameId === null) {
      frameId = requestAnimationFrame(update);
    }
  };

  const onResize = () => {
    measure();
    update();
  };

  // Catches anything that changes the page's height: web fonts, window resizes, reels
  const resizeObserver = new ResizeObserver(onResize);

  const start = () => {
    window.addEventListener("scroll", onScroll, {passive: true});
    resizeObserver.observe(track);
    onResize();
  };

  const stop = () => {
    window.removeEventListener("scroll", onScroll);
    resizeObserver.disconnect();
    cancelAnimationFrame(frameId);
    frameId = null;
    track.style.removeProperty("--tl-progress");
    track.style.removeProperty("--tl-head");
    track.style.removeProperty("--tl-head-opacity");
    nodes.forEach(({el}) => el.classList.add("is-reached"));
    chapters.forEach(({el}) => el.classList.remove("is-current"));
    images.forEach(({el}) => el.style.removeProperty("transform"));
  };

  const applyPreference = () => (reducedMotion.matches ? stop() : start());

  applyPreference();
  reducedMotion.addEventListener("change", applyPreference);
}

export default function initTimeline() {
  document.querySelectorAll("[data-timeline]").forEach(createTimeline);
}
