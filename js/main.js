/* ============================================================
   Jonas von Essen — jonasvonessen.se
   Interaktivitet: π-himmel, räknare, reveal, π-utmaningen m.m.
   ============================================================ */

"use strict";

/* De första 100 decimalerna av π — används av både canvas och spelet. */
const PI_DECIMALS =
  "1415926535897932384626433832795028841971" +
  "6939937510582097494459230781640628620899" +
  "86280348253421170679";

/* Ändra till Jonas riktiga bokningsadress innan lansering. */
const BOOKING_EMAIL = "hej@jonasvonessen.se";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- π-himlen i hero ---------- */
(function piCanvas() {
  const canvas = document.getElementById("pi-canvas");
  if (!canvas || prefersReducedMotion) return;
  const ctx = canvas.getContext("2d");

  let w, h, dpr, digits = [];
  const COUNT = 90;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(i) {
    return {
      ch: PI_DECIMALS[i % PI_DECIMALS.length],
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: 11 + Math.random() * 16,
      alpha: 0.06 + Math.random() * 0.2,
      hue: Math.random() < 0.5 ? "124, 92, 255" : "34, 211, 238",
    };
  }

  function init() {
    resize();
    digits = Array.from({ length: COUNT }, (_, i) => spawn(i));
  }

  let mouse = { x: -9999, y: -9999 };
  canvas.parentElement.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener("pointerleave", () => {
    mouse.x = mouse.y = -9999;
  });

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const d of digits) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < -30) d.x = w + 30;
      if (d.x > w + 30) d.x = -30;
      if (d.y < -30) d.y = h + 30;
      if (d.y > h + 30) d.y = -30;

      /* Siffror nära muspekaren lyser upp — som minnen som väcks. */
      const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
      const boost = dist < 160 ? (1 - dist / 160) * 0.55 : 0;

      ctx.font = `700 ${d.size}px "JetBrains Mono", monospace`;
      ctx.fillStyle = `rgba(${d.hue}, ${Math.min(d.alpha + boost, 0.85)})`;
      ctx.fillText(d.ch, d.x, d.y);

      if (boost > 0.1) {
        ctx.strokeStyle = `rgba(${d.hue}, ${boost * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  init();
  tick();
})();

/* ---------- Huvudet som öppnas: klick = spela igen ---------- */
(function headReplay() {
  const head = document.getElementById("head-anim");
  if (!head) return;
  head.addEventListener("click", () => {
    head.classList.remove("play");
    void head.offsetWidth; /* tvinga omritning så animationen kan starta om */
    head.classList.add("play");
  });
})();

/* ---------- Scrollprogress + nav-skugga ---------- */
(function scrollUI() {
  const bar = document.getElementById("progress-bar");
  const nav = document.getElementById("nav");
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(window.scrollY / Math.max(max, 1)) * 100}%`;
    nav.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---------- Mobilmeny ---------- */
(function burger() {
  const btn = document.getElementById("nav-burger");
  const links = document.getElementById("nav-links");
  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      btn.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ---------- Aktiv länk i menyn ---------- */
(function activeNav() {
  const links = [...document.querySelectorAll(".nav-links a")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => obs.observe(s));
})();

/* ---------- Reveal vid scroll ---------- */
(function reveal() {
  const els = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => obs.observe(el));
})();

/* ---------- Animerade räknare ---------- */
(function counters() {
  const nums = document.querySelectorAll(".stat-num");
  const fmt = new Intl.NumberFormat("sv-SE");
  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReducedMotion) {
      el.textContent = fmt.format(target);
      return;
    }
    const dur = 1600;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt.format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  nums.forEach((el) => obs.observe(el));
})();

/* ---------- Spotlight på kort ---------- */
(function cardSpotlight() {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
})();

/* ---------- π-utmaningen ---------- */
(function piGame() {
  const btn = document.getElementById("game-btn");
  const msg = document.getElementById("game-msg");
  const digitsEl = document.getElementById("game-digits");
  const input = document.getElementById("game-input");
  const bestEl = document.getElementById("game-best");

  const START_LEN = 4;
  const STEP = 2;
  let level = START_LEN;
  let state = "idle"; // idle | showing | answering
  let timer = null;

  const best = parseInt(localStorage.getItem("pi-best") || "0", 10);
  if (best > 0) showBest(best);

  function showBest(n) {
    bestEl.hidden = false;
    bestEl.textContent = `Ditt rekord: ${n} decimaler ${n >= 20 ? "🤯" : "⭐"}`;
  }

  function saveBest(n) {
    const prev = parseInt(localStorage.getItem("pi-best") || "0", 10);
    if (n > prev) {
      localStorage.setItem("pi-best", String(n));
      showBest(n);
      return true;
    }
    return false;
  }

  function showDigits() {
    state = "showing";
    input.hidden = true;
    input.value = "";
    btn.textContent = "Visar…";
    btn.disabled = true;
    msg.classList.remove("win");
    msg.textContent = `Nivå: ${level} decimaler. Memorera!`;

    const seq = PI_DECIMALS.slice(0, level);
    let i = 0;
    digitsEl.textContent = "3,";
    clearInterval(timer);
    timer = setInterval(() => {
      digitsEl.textContent += seq[i];
      i++;
      if (i >= seq.length) {
        clearInterval(timer);
        /* Lästid: ungefär en halv sekund per siffra efter att alla visats. */
        setTimeout(hideAndAsk, Math.min(600 * level * 0.45, 6000));
      }
    }, 380);
  }

  function hideAndAsk() {
    state = "answering";
    digitsEl.textContent = "3,?";
    msg.textContent = "Skriv decimalerna — utan att kika!";
    input.hidden = false;
    input.focus();
    btn.textContent = "Rätta svaret";
    btn.disabled = false;
  }

  function check() {
    const answer = input.value.replace(/[^0-9]/g, "");
    const correct = PI_DECIMALS.slice(0, level);
    if (answer === correct) {
      const isRecord = saveBest(level);
      msg.classList.add("win");
      msg.textContent =
        `Rätt! ${level} decimaler — ${isRecord ? "nytt rekord! " : ""}` +
        `Jonas leder fortfarande med ${(100000 - level).toLocaleString("sv-SE")}… 😄`;
      digitsEl.textContent = `3,${correct}`;
      level += STEP;
      btn.textContent = `Nästa nivå (${level} decimaler)`;
      input.hidden = true;
      state = "idle";
    } else {
      let okCount = 0;
      while (okCount < answer.length && answer[okCount] === correct[okCount]) okCount++;
      msg.classList.remove("win");
      msg.textContent =
        okCount > 0
          ? `Nästan! ${okCount} rätt i rad. Rätt svar visas ovan — försök igen!`
          : "Hoppsan! Rätt svar visas ovan — försök igen!";
      digitsEl.textContent = `3,${correct}`;
      saveBest(okCount);
      level = Math.max(START_LEN, level - STEP);
      btn.textContent = "Försök igen";
      input.hidden = true;
      state = "idle";
    }
  }

  btn.addEventListener("click", () => {
    if (state === "answering") check();
    else showDigits();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && state === "answering") {
      e.preventDefault();
      check();
    }
  });
})();

/* ---------- Kontaktformulär → mailto ---------- */
(function contactForm() {
  const form = document.getElementById("kontakt-form");
  const note = document.getElementById("form-note");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Förfrågan: ${data.get("typ")} — ${data.get("namn")}`);
    const body = encodeURIComponent(
      `Namn: ${data.get("namn")}\nE-post: ${data.get("epost")}\nTyp: ${data.get("typ")}\n\n${data.get("meddelande")}`
    );
    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;
    note.hidden = false;
  });
})();
