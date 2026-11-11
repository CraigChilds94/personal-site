// Generative-text effects for the AI parts of the timelines:
// - [data-terminal] panels play back an agent session: the prompt types out a character at a
//   time, "thinking" lines shimmer behind a spinner, and everything else streams in a token at
//   a time behind a blinking cursor. A "Run again" button replays it.
// - [data-stream] text streams in word by word, like a model's reply.
// - [data-decode] titles scramble through code glyphs before resolving, left to right.
//
// The full text is always in the page and laid out from the start (unplayed tokens are only
// hidden), so nothing shifts as it plays. Without JS, IntersectionObserver or with reduced
// motion, everything is simply shown; turning reduced motion on mid-play finishes it at once.

import {createDecodeOverlay} from "./motion";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const CODE_GLYPHS = "{}[]<>/\\=+*#$%&;:_01";
const SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
const DECODE_MS = 1100;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const between = (min, max) => min + Math.random() * (max - min);

// Wraps every character (or every word and run of spaces) in its own span, keeping any markup
function tokenize(root, perChar) {
  const tokens = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }
  nodes.forEach((node) => {
    const parts = perChar ? [...node.data] : node.data.match(/\s+|\S+/g) || [];
    const fragment = document.createDocumentFragment();
    parts.forEach((part) => {
      const span = document.createElement("span");
      span.className = "tk";
      span.textContent = part;
      fragment.appendChild(span);
      tokens.push(span);
    });
    node.replaceWith(fragment);
  });
  return tokens;
}

// How long to wait after each token, and after each line, by kind of line
const TOKEN_MS = {prompt: [22, 55], code: [30, 70], out: [35, 85], tool: [40, 90], ok: [40, 90], text: [22, 48]};
const LINE_MS = {prompt: 550, tool: 380, code: 90, out: 260, ok: 0, think: 200, text: 0};

function createStream(root, lines) {
  const cursor = document.createElement("span");
  cursor.className = "tm-cursor";
  cursor.setAttribute("aria-hidden", "true");
  const replay = root.querySelector("[data-replay]");

  let run = 0;

  const showAll = () => {
    lines.forEach((line) => {
      line.el.classList.add("is-started");
      line.el.classList.remove("is-thinking");
      line.tokens.forEach((token) => token.classList.add("on"));
      if (line.spinner) {
        line.spinner.textContent = line.spinnerText;
      }
    });
    const last = lines[lines.length - 1];
    last?.tokens[last.tokens.length - 1]?.after(cursor);
  };

  const finish = () => {
    run++;
    showAll();
    root.classList.add("is-done");
    if (replay) {
      replay.hidden = false;
    }
  };

  const play = async() => {
    const id = ++run;
    root.classList.remove("is-done");
    if (replay) {
      replay.hidden = true;
    }
    lines.forEach((line) => {
      line.el.classList.remove("is-started");
      line.tokens.forEach((token) => token.classList.remove("on"));
    });

    for (const line of lines) {
      line.el.classList.add("is-started");

      if (line.kind === "think") {
        line.tokens.forEach((token) => token.classList.add("on"));
        line.tokens[line.tokens.length - 1]?.after(cursor);
        line.el.classList.add("is-thinking");
        const started = performance.now();
        let frame = 0;
        while (performance.now() - started < 1400) {
          if (line.spinner) {
            line.spinner.textContent = SPINNER[frame++ % SPINNER.length];
          }
          await wait(80);
          if (id !== run) {
            return;
          }
        }
        line.el.classList.remove("is-thinking");
        if (line.spinner) {
          line.spinner.textContent = line.spinnerText;
        }
      } else {
        const [min, max] = TOKEN_MS[line.kind] || TOKEN_MS.out;
        for (const token of line.tokens) {
          token.classList.add("on");
          token.after(cursor);
          if (/^\s+$/.test(token.textContent)) {
            continue;
          }
          await wait(between(min, max));
          if (id !== run) {
            return;
          }
        }
      }

      await wait(LINE_MS[line.kind] ?? 200);
      if (id !== run) {
        return;
      }
    }
    finish();
  };

  replay?.addEventListener("click", () => play());

  root.classList.add("is-armed");
  return {play, finish};
}

function createTerminal(root) {
  const lines = [...root.querySelectorAll(".tm-line")].map((el) => {
    const spinner = el.querySelector(".tm-spin");
    const text = el.querySelector(".tm-text") || el;
    return {
      el,
      kind: el.dataset.kind,
      spinner,
      spinnerText: spinner?.textContent,
      tokens: tokenize(text, el.dataset.kind === "prompt")
    };
  });
  return createStream(root, lines);
}

function createTextStream(root) {
  return createStream(root, [{el: root, kind: "text", tokens: tokenize(root, false)}]);
}

// The text goes in an inner span so the overlay lands in the title itself and takes its font
function decode(el) {
  const text = el.textContent.trim();
  const inner = document.createElement("span");
  el.replaceChildren(inner);
  const overlay = createDecodeOverlay(inner, text, CODE_GLYPHS);
  const started = performance.now();
  const step = (now) => {
    const progress = Math.min(1, (now - started) / DECODE_MS);
    overlay.render(progress);
    if (progress < 1 && !reducedMotion.matches) {
      requestAnimationFrame(step);
    } else {
      overlay.remove();
    }
  };
  requestAnimationFrame(step);
}

export default function initGenerative() {
  const terminals = document.querySelectorAll("[data-terminal]");
  const texts = document.querySelectorAll("[data-stream]");
  const titles = document.querySelectorAll("[data-decode]");
  if (!(terminals.length + texts.length + titles.length) || !("IntersectionObserver" in window) || reducedMotion.matches) {
    return;
  }

  const streams = new Map();
  terminals.forEach((el) => streams.set(el, createTerminal(el)));
  texts.forEach((el) => streams.set(el, createTextStream(el)));

  // Plays once most of it is in view, after its moment has slid into place
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      observer.unobserve(entry.target);
      const stream = streams.get(entry.target);
      setTimeout(() => {
        if (reducedMotion.matches) {
          return;
        }
        if (stream) {
          stream.play();
        } else {
          decode(entry.target);
        }
      }, 450);
    });
  }, {threshold: 0.5});

  streams.forEach((_, el) => observer.observe(el));
  titles.forEach((el) => observer.observe(el));

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      observer.disconnect();
      streams.forEach((stream) => stream.finish());
    }
  });
}
