// script.js
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ===== helpers: cerrar dropdowns (técnica limpia) ===== */
const closeServicesDropdown = () => {
  const dd = qs("#servicesDropdown");
  const toggle = qs("#servicesToggle");
  if(!dd || !toggle) return;
  dd.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
};

const closeLangDropdown = () => {
  const langSwitch = qs("#langSwitch");
  const langBtn = qs("#langBtn");
  if(!langSwitch || !langBtn) return;
  langSwitch.classList.remove("is-open");
  langBtn.setAttribute("aria-expanded", "false");
};

/* ===== 1) Menú hamburguesa ===== */
(() => {
  const btn = qs("#navToggle");
  const navPanel = qs("#navPanel");
  if(!btn || !navPanel) return;

  const open = () => {
    navPanel.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    navPanel.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");

    // ✅ buena técnica: al cerrar el panel, reseteo submenús
    closeServicesDropdown();
    closeLangDropdown();
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    navPanel.classList.contains("is-open") ? close() : open();
  });

  document.addEventListener("click", (e) => {
    if(!navPanel.contains(e.target) && !btn.contains(e.target)) close();
  });

  // cerrar con Escape también
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") close();
  });

  // cerrar al click en links (anchors)
  qsa("a", navPanel).forEach(a => a.addEventListener("click", close));

  window.addEventListener("resize", () => {
    if(window.innerWidth > 920) close();
  });

  window.__closeNavPanel = close;
})();

/* ===== ✅ 1.05) Selector de idioma (ES/EN) ===== */
(() => {
  const langSwitch = qs("#langSwitch");
  const langBtn = qs("#langBtn");
  const langMenu = qs("#langMenu");
  const langCurrent = qs("#langCurrent");

  if(!langSwitch || !langBtn || !langMenu || !langCurrent) return;

  const isMobile = () => window.matchMedia("(max-width: 920px)").matches;

  const open = () => {
    // ✅ cierro el otro dropdown para evitar solapes
    closeServicesDropdown();
    langSwitch.classList.add("is-open");
    langBtn.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    langSwitch.classList.remove("is-open");
    langBtn.setAttribute("aria-expanded", "false");
  };

  const toggleOpen = () => (langSwitch.classList.contains("is-open") ? close() : open());

  const saved = localStorage.getItem("lang");
  langCurrent.textContent = saved === "en" ? "EN" : "ES";

  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleOpen();
  });

  document.addEventListener("click", (e) => {
    if(!langSwitch.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") close();
  });

  langMenu.addEventListener("click", (e) => {
    const btn = e.target.closest?.("button[data-lang]");
    if(!btn) return;

    const lang = btn.getAttribute("data-lang") || "es";
    localStorage.setItem("lang", lang);
    langCurrent.textContent = lang.toUpperCase();

    close();

    if(isMobile() && typeof window.__closeNavPanel === "function") window.__closeNavPanel();
  });

  window.addEventListener("resize", () => {
    if(!isMobile()) close();
  });
})();

/* ===== ✅ 1.1) Dropdown Servicios (Desktop + Mobile accordion) ===== */
(() => {
  const dd = qs("#servicesDropdown");
  const toggle = qs("#servicesToggle");
  const menu = qs("#servicesMenu");
  if(!dd || !toggle || !menu) return;

  const isMobile = () => window.matchMedia("(max-width: 920px)").matches;

  const open = () => {
    // ✅ cierro idioma para evitar solapes/recortes
    closeLangDropdown();
    dd.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    dd.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const toggleOpen = () => (dd.classList.contains("is-open") ? close() : open());

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleOpen();
  });

  document.addEventListener("click", (e) => {
    if(!dd.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") close();
  });

  qsa("a", menu).forEach(a => a.addEventListener("click", () => {
    close();
    if(isMobile() && typeof window.__closeNavPanel === "function") window.__closeNavPanel();
  }));

  window.addEventListener("resize", () => {
    if(!isMobile()) close();
  });
})();

/* ===== 2) Servicios: detalle ===== */
(() => {
  const buttons = qsa(".service-btn");
  const servicePanel = qs("#serviceDetailPanel");
  const closeBtn = qs("#closeServiceDetail");
  const cards = qsa(".detail-card");

  if(!buttons.length || !servicePanel || !cards.length) return;

  const openService = (key) => {
    buttons.forEach(b => {
      const isActive = b.dataset.service === key;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-expanded", isActive ? "true" : "false");
    });

    cards.forEach(c => c.classList.toggle("is-active", c.dataset.detail === key));
    servicePanel.classList.add("is-open");
    servicePanel.scrollIntoView({ behavior:"smooth", block:"center" });
  };

  const closeService = () => {
    servicePanel.classList.remove("is-open");
    buttons.forEach(b => { b.classList.remove("is-active"); b.setAttribute("aria-expanded", "false"); });
    cards.forEach(c => c.classList.remove("is-active"));
  };

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.service;
      const isSameOpen = servicePanel.classList.contains("is-open") && btn.classList.contains("is-active");
      isSameOpen ? closeService() : openService(key);
    });
  });

  closeBtn?.addEventListener("click", closeService);

  document.addEventListener("click", (e) => {
    const clickedServiceBtn = e.target.closest?.(".service-btn");
    if(clickedServiceBtn) return;
    if(servicePanel.classList.contains("is-open") && !servicePanel.contains(e.target)) closeService();
  });
})();

/* ===== 3) Reveal ===== */
(() => {
  const revealEls = qsa("[data-reveal]");
  if(!revealEls.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealEls.forEach(el => io.observe(el));
})();

/* ===== 4) Valores: carrusel ===== */
(() => {
  const viewport = qs("#vcViewport");
  const track = qs("#vcTrack");
  const prev = qs("#vcPrev");
  const next = qs("#vcNext");
  const dotsWrap = qs("#vcDots");
  if(!viewport || !track) return;

  const cards = qsa(".vc-card", track);
  if(!cards.length) return;

  const dots = cards.map((_, i) => {
    const b = document.createElement("button");
    b.className = "vc-dot";
    b.type = "button";
    b.setAttribute("aria-label", `Ir al valor ${i + 1}`);
    b.addEventListener("click", () => scrollToIndex(i));
    dotsWrap?.appendChild(b);
    return b;
  });

  const scrollToIndex = (i) => {
    const card = cards[i];
    if(!card) return;
    const left = card.offsetLeft - (viewport.clientWidth / 2) + (card.clientWidth / 2);
    viewport.scrollTo({ left, behavior:"smooth" });
  };

  const setActiveByCenter = () => {
    const vpRect = viewport.getBoundingClientRect();
    const center = vpRect.left + vpRect.width / 2;

    let bestIdx = 0;
    let bestDist = Infinity;

    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const cCenter = r.left + r.width / 2;
      const dist = Math.abs(center - cCenter);
      if(dist < bestDist){ bestDist = dist; bestIdx = i; }
    });

    cards.forEach(c => c.classList.remove("is-active"));
    dots.forEach(d => d.classList.remove("is-active"));

    cards[bestIdx].classList.add("is-active");
    dots[bestIdx]?.classList.add("is-active");
  };

  let raf = 0;
  viewport.addEventListener("scroll", () => {
    if(raf) return;
    raf = requestAnimationFrame(() => {
      setActiveByCenter();
      raf = 0;
    });
  });

  prev?.addEventListener("click", () => {
    const idx = cards.findIndex(c => c.classList.contains("is-active"));
    const nextIdx = (idx - 1 + cards.length) % cards.length;
    scrollToIndex(nextIdx);
  });

  next?.addEventListener("click", () => {
    const idx = cards.findIndex(c => c.classList.contains("is-active"));
    const nextIdx = (idx + 1) % cards.length;
    scrollToIndex(nextIdx);
  });

  cards.forEach((c, i) => c.addEventListener("click", () => scrollToIndex(i)));

  let isDown = false, startX = 0, startScroll = 0;

  viewport.addEventListener("pointerdown", (e) => {
    isDown = true;
    viewport.classList.add("is-dragging");
    startX = e.pageX;
    startScroll = viewport.scrollLeft;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener("pointermove", (e) => {
    if(!isDown) return;
    viewport.scrollLeft = startScroll - (e.pageX - startX);
  });

  const stop = () => {
    isDown = false;
    viewport.classList.remove("is-dragging");
  };

  viewport.addEventListener("pointerup", stop);
  viewport.addEventListener("pointercancel", stop);

  window.addEventListener("load", () => {
    const def = qs(".vc-card[data-default='true']", track);
    const idx = def ? cards.indexOf(def) : 1;
    scrollToIndex(Math.max(0, idx));
    setTimeout(setActiveByCenter, 80);
  });

  window.addEventListener("resize", () => {
    const idx = cards.findIndex(c => c.classList.contains("is-active"));
    scrollToIndex(Math.max(0, idx));
    setTimeout(setActiveByCenter, 80);
  });
})();

/* ===== 5) Chatbot ===== */
(() => {
  const fab = qs("#chatbotFab");
  const win = qs("#chatbotWindow");
  const close = qs("#chatbotClose");
  const form = qs("#chatbotForm");
  const input = qs("#chatbotInput");
  const body = qs("#chatbotBody");

  if(!fab || !win) return;

  const openChat = () => { win.hidden = false; };
  const closeChat = () => { win.hidden = true; };

  const addMsg = (text, who = "bot") => {
    if(!body) return;
    const el = document.createElement("div");
    el.className = `msg ${who === "user" ? "msg-user" : "msg-bot"}`;
    el.innerHTML = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  };

  fab.addEventListener("click", () => { win.hidden ? openChat() : closeChat(); });
  close?.addEventListener("click", closeChat);

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = (input?.value || "").trim();
    if(!msg) return;

    addMsg(`<strong>Tú:</strong> ${msg}`, "user");
    addMsg("Gracias. Un asesor puede contactarte. Si quieres, agenda tu asesoría inicial.", "bot");
    input.value = "";
  });
})();