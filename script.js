(function () {
  "use strict";

  /* ============================================================
     Navbar scroll state
     ============================================================ */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 24) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============================================================
     Mobile menu
     ============================================================ */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ============================================================
     Scroll reveal
     ============================================================ */
  const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ============================================================
     Process connecting line fill
     ============================================================ */
  const processLine = document.getElementById("processLine");
  if (processLine) {
    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            processLine.classList.add("is-visible");
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    lineObserver.observe(processLine);
  }

  /* ============================================================
     Hero visual — miniature backend / AI architecture diagram
     ============================================================ */
  const heroVisual = document.getElementById("heroVisual");
  if (heroVisual) {
    const nodes = [
      { id: "client", x: 250, y: 40, label: "Client", r: 26 },
      { id: "api", x: 250, y: 150, label: "API", r: 32 },
      { id: "auth", x: 90, y: 230, label: "Auth", r: 24 },
      { id: "db", x: 250, y: 300, label: "SQL", r: 28 },
      { id: "ai", x: 410, y: 230, label: "AI Model", r: 26 },
      { id: "queue", x: 410, y: 380, label: "Jobs", r: 22 },
    ];
    const links = [
      ["client", "api"],
      ["api", "auth"],
      ["api", "db"],
      ["api", "ai"],
      ["ai", "queue"],
      ["db", "queue"],
    ];

    const find = (id) => nodes.find((n) => n.id === id);

    const linkPaths = links
      .map(([a, b], i) => {
        const A = find(a), B = find(b);
        return `<path class="net-link" d="M${A.x},${A.y} L${B.x},${B.y}" stroke="var(--border-strong)" stroke-width="1" fill="none" pathLength="100" />
                <circle class="net-pulse" r="3" fill="var(--accent-soft)">
                  <animateMotion dur="${3 + (i % 3)}s" repeatCount="indefinite" begin="${i * 0.4}s" path="M${A.x},${A.y} L${B.x},${B.y}" />
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="${3 + (i % 3)}s" repeatCount="indefinite" begin="${i * 0.4}s" />
                </circle>`;
      })
      .join("");

    const nodeShapes = nodes
      .map((n, i) => {
        return `<g class="net-node" style="animation: netFloat ${5 + (i % 3)}s ease-in-out ${i * 0.3}s infinite;">
                  <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1"/>
                  <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="none" stroke="var(--accent)" stroke-width="1" opacity="0.35"/>
                  <text x="${n.x}" y="${n.y + 4}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--text-dim)">${n.label}</text>
                </g>`;
      })
      .join("");

    heroVisual.innerHTML = `
      <svg viewBox="0 0 500 440" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.16" />
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="250" cy="200" r="220" fill="url(#heroGlow)" />
        ${linkPaths}
        ${nodeShapes}
      </svg>
    `;
  }

  /* Keyframe for node float, injected once */
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @keyframes netFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .net-node { animation: none !important; }
      .net-pulse animateMotion, .net-pulse animate { display: none; }
    }
  `;
  document.head.appendChild(styleTag);

  /* ============================================================
     About visual — layered engineering stack illustration
     ============================================================ */
  const aboutVisual = document.getElementById("aboutVisual");
  if (aboutVisual) {
    const layers = [
      { label: "Client / UI", sub: "Requests in, responses out" },
      { label: "API Layer", sub: "ASP.NET Core · REST endpoints" },
      { label: "Business Logic", sub: "Auth, RBAC, core services" },
      { label: "AI Layer", sub: "Python · LLM integration" },
      { label: "Data Layer", sub: "SQL Server · stored procedures" },
    ];

    const layerHeight = 76;
    const gap = 14;
    const totalH = layers.length * layerHeight + (layers.length - 1) * gap;

    const rects = layers
      .map((l, i) => {
        const y = i * (layerHeight + gap);
        return `
          <g class="stack-layer" tabindex="0" style="transition: transform .35s cubic-bezier(.16,1,.3,1);">
            <rect x="0" y="${y}" width="360" height="${layerHeight}" rx="14"
              fill="var(--surface)" stroke="var(--border)" stroke-width="1" />
            <rect x="0" y="${y}" width="4" height="${layerHeight}" rx="2" fill="var(--accent)" opacity="0.7" />
            <text x="26" y="${y + 32}" font-family="Manrope, sans-serif" font-weight="700" font-size="15" fill="var(--text)">${l.label}</text>
            <text x="26" y="${y + 54}" font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--text-faint)">${l.sub}</text>
          </g>`;
      })
      .join("");

    aboutVisual.innerHTML = `
      <svg viewBox="0 0 360 ${totalH}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        ${rects}
      </svg>
    `;

    aboutVisual.querySelectorAll(".stack-layer").forEach((layer) => {
      layer.addEventListener("mouseenter", () => {
        layer.style.transform = "translateX(6px)";
      });
      layer.addEventListener("mouseleave", () => {
        layer.style.transform = "translateX(0)";
      });
    });
  }
})();
