// Generative hero for the Shop timeline: an endless wall of tiles you can drag around, after
// the Gift Shop canvas on Shop.com. Each tile nods to something built there: review cards
// whose stars fill in, parcels moving along a route, carts and gifts.
//
// The tiles spring out from the centre on load, drift slowly, and columns slide in opposite
// directions as the page scrolls. Only animates while on screen in a foreground tab. With
// reduced motion it draws one still frame.

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const COLOURS = ["#e8708a", "#c8282d", "#3a2340", "#4a474a", "#c98255", "#e8694f", "#2b55b8", "#8fb0d6", "#f2c14e", "#2f8f6b"];
const KINDS = ["review", "gift", "parcel", "bottle", "review", "cart", "heart", "orb"];
const ROWS = 8;
const HEIGHTS = [1, 1.3, 0.85, 1.15, 1.4, 0.95, 1.2, 1.05];

const WHITE = "rgba(255,255,255,0.92)";
const PURPLE = "#5433eb";
const LILAC = "#ddd8fb";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const mod = (value, size) => ((value % size) + size) % size;
const easeOutBack = (t) => 1 + 2.4 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2;

function star(ctx, x, y, radius) {
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 ? radius * 0.46 : radius;
    ctx[i ? "lineTo" : "moveTo"](x + Math.cos(angle) * r, y + Math.sin(angle) * r);
  }
  ctx.closePath();
}

const artwork = {
  review(ctx, w, h, t, phase) {
    const size = w * 0.075;
    const startX = -size * 5.2;
    const lit = clamp(Math.floor(mod(t * 0.9 + phase, 8)), 0, 5);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      star(ctx, startX + i * size * 2.6, -h * 0.14, size);
      ctx.fillStyle = i < lit ? PURPLE : LILAC;
      ctx.fill();
    }
    ctx.fillStyle = "#d8d6e0";
    ctx.beginPath();
    ctx.roundRect(startX - size, h * 0.04, w * 0.62, w * 0.05, w * 0.025);
    ctx.roundRect(startX - size, h * 0.04 + w * 0.1, w * 0.4, w * 0.05, w * 0.025);
    ctx.fill();
  },

  gift(ctx, w) {
    const s = w * 0.42;
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.roundRect(-s / 2, -s * 0.28, s, s * 0.78, s * 0.08);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(-s * 0.07, -s * 0.28, s * 0.14, s * 0.78);
    ctx.fillRect(-s / 2, s * 0.02, s, s * 0.1);
    ctx.strokeStyle = WHITE;
    ctx.lineWidth = s * 0.08;
    [[-0.17, 0.5], [0.17, -0.5]].forEach(([side, tilt]) => {
      ctx.beginPath();
      ctx.ellipse(s * side, -s * 0.42, s * 0.16, s * 0.1, tilt, 0, Math.PI * 2);
      ctx.stroke();
    });
  },

  parcel(ctx, w, h, t, phase) {
    const left = -w * 0.3;
    const top = -h * 0.26;
    const point = (p) => [left + p * w * 0.6, top + (1 - Math.cos(p * Math.PI)) * h * 0.26];
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i <= 10; i++) {
      const [x, y] = point(i / 10);
      ctx.beginPath();
      ctx.arc(x, y, w * 0.016, 0, Math.PI * 2);
      ctx.fill();
    }
    const [x, y] = point(mod(t * 0.14 + phase, 1));
    const s = w * 0.16;
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.roundRect(x - s / 2, y - s / 2, s, s, s * 0.16);
    ctx.fill();
  },

  bottle(ctx, w) {
    const s = w * 0.2;
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.roundRect(-s, -s * 0.9, s * 2, s * 2.6, s * 0.5);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.roundRect(-s * 0.55, -s * 1.7, s * 1.1, s * 0.75, s * 0.15);
    ctx.fill();
  },

  cart(ctx, w) {
    const s = w * 0.3;
    ctx.strokeStyle = WHITE;
    ctx.lineWidth = s * 0.15;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-s, -s * 0.8);
    ctx.lineTo(-s * 0.65, -s * 0.8);
    ctx.lineTo(-s * 0.3, s * 0.4);
    ctx.lineTo(s * 0.7, s * 0.4);
    ctx.lineTo(s * 0.95, -s * 0.45);
    ctx.lineTo(-s * 0.55, -s * 0.45);
    ctx.stroke();
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.arc(-s * 0.15, s * 0.8, s * 0.15, 0, Math.PI * 2);
    ctx.arc(s * 0.55, s * 0.8, s * 0.15, 0, Math.PI * 2);
    ctx.fill();
  },

  heart(ctx, w, h, t, phase) {
    const s = w * 0.26 * (1 + Math.sin(t * 2.2 + phase) * 0.05);
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.moveTo(0, s);
    ctx.bezierCurveTo(-s * 1.7, -s * 0.1, -s * 0.8, -s * 1.2, 0, -s * 0.35);
    ctx.bezierCurveTo(s * 0.8, -s * 1.2, s * 1.7, -s * 0.1, 0, s);
    ctx.fill();
  },

  orb(ctx, w) {
    const s = w * 0.27;
    const shine = ctx.createRadialGradient(-s * 0.35, -s * 0.4, s * 0.1, 0, 0, s);
    shine.addColorStop(0, "rgba(255,255,255,0.95)");
    shine.addColorStop(1, "rgba(255,255,255,0.3)");
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, Math.PI * 2);
    ctx.fill();
  }
};

function createTileWall(canvas) {
  const ctx = canvas.getContext("2d");
  const wall = canvas.parentElement;

  let width = 0;
  let height = 0;
  let tileWidth = 150;
  let gap = 14;
  let columns = [];
  let worldWidth = 1;

  let frameId = null;
  let inView = true;
  let startedAt = null;
  let last = null;

  const offset = {x: 0, y: 0};
  const velocity = {x: 0, y: 0};
  const pointer = {x: -9999, y: -9999, dragging: false, id: null};

  const layout = () => {
    tileWidth = clamp(width / 7.5, 112, 190);
    gap = tileWidth * 0.09;
    const count = Math.ceil(width / (tileWidth + gap)) + 4;
    worldWidth = count * (tileWidth + gap);

    columns = Array.from({length: count}, (_, c) => {
      let y = 0;
      const tiles = Array.from({length: ROWS}, (__, r) => {
        const tileHeight = tileWidth * HEIGHTS[(r + c * 3) % ROWS];
        const tile = {
          y,
          height: tileHeight,
          kind: KINDS[(r * 3 + c * 5) % KINDS.length],
          colour: COLOURS[(r * 7 + c * 3) % COLOURS.length],
          phase: (r * 2.3 + c * 1.7) % 8,
          hover: 0
        };
        y += tileHeight + gap;
        return tile;
      });
      return {tiles, length: y, stagger: c * tileWidth * 0.37};
    });
  };

  const drawTile = (tile, x, y, scale, t) => {
    const {height: tileHeight, kind} = tile;
    ctx.save();
    ctx.translate(x + tileWidth / 2, y + tileHeight / 2);
    ctx.scale(scale, scale);

    ctx.fillStyle = kind === "review" ? "#fff" : tile.colour;
    ctx.beginPath();
    ctx.roundRect(-tileWidth / 2, -tileHeight / 2, tileWidth, tileHeight, tileWidth * 0.15);
    ctx.fill();

    artwork[kind](ctx, tileWidth, tileHeight, t, tile.phase);
    ctx.restore();
  };

  const draw = (now) => {
    const animated = !reducedMotion.matches;
    const t = animated ? now / 1000 : 3;
    const elapsed = animated ? (now - startedAt) / 1000 : 99;
    const dt = last === null ? 16 : Math.min(now - last, 50);
    last = now;

    if (animated && !pointer.dragging) {
      offset.x += velocity.x - dt * 0.012;
      offset.y += velocity.y;
      velocity.x *= 0.94;
      velocity.y *= 0.94;
    }

    const scrolled = animated ? window.scrollY * 0.3 : 0;
    const stepX = tileWidth + gap;
    const maxDistance = Math.hypot(width / 2, height / 2) || 1;

    ctx.clearRect(0, 0, width, height);

    columns.forEach((column, c) => {
      const x = mod(c * stepX + offset.x, worldWidth) - stepX * 2;
      if (x > width || x + tileWidth < 0) {
        return;
      }
      const slide = offset.y + column.stagger + (c % 2 ? scrolled : -scrolled);

      column.tiles.forEach((tile) => {
        const y = mod(tile.y + slide, column.length) - tileWidth * 1.6;
        if (y > height || y + tile.height < 0) {
          return;
        }

        const centreX = x + tileWidth / 2;
        const centreY = y + tile.height / 2;
        const distance = Math.hypot(centreX - width / 2, centreY - height / 2) / maxDistance;
        const intro = clamp((elapsed - distance * 0.7) / 0.6, 0, 1);
        if (intro <= 0) {
          return;
        }

        const hovered = !pointer.dragging
          && pointer.x >= x && pointer.x <= x + tileWidth
          && pointer.y >= y && pointer.y <= y + tile.height;
        tile.hover = lerp(tile.hover, hovered ? 1 : 0, 0.18);

        drawTile(tile, x, y, easeOutBack(intro) * (1 + tile.hover * 0.05), t);
      });
    });
  };

  const loop = (now) => {
    draw(now);
    frameId = requestAnimationFrame(loop);
  };

  const stop = () => {
    cancelAnimationFrame(frameId);
    frameId = null;
    last = null;
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

  new ResizeObserver(() => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    layout();
    sync();
  }).observe(canvas);

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(canvas);

  const endDrag = () => {
    pointer.dragging = false;
    pointer.id = null;
    wall.classList.remove("is-dragging");
  };

  canvas.addEventListener("pointerdown", (event) => {
    if (reducedMotion.matches) {
      return;
    }
    pointer.dragging = true;
    pointer.id = event.pointerId;
    velocity.x = 0;
    velocity.y = 0;
    canvas.setPointerCapture(event.pointerId);
    wall.classList.add("is-dragging", "has-dragged");
  });

  canvas.addEventListener("pointermove", (event) => {
    pointer.x = event.offsetX;
    pointer.y = event.offsetY;
    if (pointer.dragging && event.pointerId === pointer.id) {
      offset.x += event.movementX;
      offset.y += event.movementY;
      velocity.x = event.movementX;
      velocity.y = event.movementY;
    }
  });

  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", sync);
}

export default function initTileWall() {
  document.querySelectorAll("[data-tile-wall]").forEach(createTileWall);
}
