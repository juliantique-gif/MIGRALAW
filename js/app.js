const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Menú hamburguesa */
(() => {
  const btn = qs("#navToggle");
  const panel = qs("#navPanel");
  if(!btn || !panel) return;

  const open = () => { panel.classList.add("is-open"); btn.setAttribute("aria-expanded","true"); };
  const close = () => { panel.classList.remove("is-open"); btn.setAttribute("aria-expanded","false"); };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.contains("is-open") ? close() : open();
  });

  document.addEventListener("click", (e) => {
    if(!panel.contains(e.target) && !btn.contains(e.target)) close();
  });

  qsa("a", panel).forEach(a => a.addEventListener("click", close));

  window.addEventListener("resize", () => {
    if(window.innerWidth > 920) close();
  });

  window.__closeNavPanel = close;
})();

/* Dropdown servicios */
(() => {
  const dd = qs("#servicesDropdown");
  const toggle = qs("#servicesToggle");
  const menu = qs("#servicesMenu");
  if(!dd || !toggle || !menu) return;

  const isMobile = () => window.matchMedia("(max-width: 920px)").matches;

  const open = () => { dd.classList.add("is-open"); toggle.setAttribute("aria-expanded","true"); };
  const close = () => { dd.classList.remove("is-open"); toggle.setAttribute("aria-expanded","false"); };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dd.classList.contains("is-open") ? close() : open();
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

  window.addEventListener("resize", () => { if(!isMobile()) close(); });
})();

/* Reveal */
(() => {
  const items = qsa("[data-reveal]");
  if(!items.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  items.forEach(el => io.observe(el));
})();

/* Chatbot */
(() => {
  const fab = qs("#chatbotFab");
  const win = qs("#chatbotWindow");
  const closeBtn = qs("#chatbotClose");
  const form = qs("#chatbotForm");
  const input = qs("#chatbotInput");
  const body = qs("#chatbotBody");

  if(!fab || !win) return;

  const openChat = () => { win.hidden = false; };
  const closeChat = () => { win.hidden = true; };

  const addMsg = (html, who="bot") => {
    if(!body) return;
    const el = document.createElement("div");
    el.className = `msg ${who === "user" ? "msg-user" : "msg-bot"}`;
    el.innerHTML = html;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  };

  fab.addEventListener("click", () => { win.hidden ? openChat() : closeChat(); });
  closeBtn?.addEventListener("click", closeChat);

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = (input?.value || "").trim();
    if(!msg) return;

    addMsg(`<strong>Tú:</strong> ${msg}`, "user");
    addMsg("Gracias. Un asesor puede contactarte. Si quieres, agenda tu asesoría inicial.", "bot");
    input.value = "";
  });
})();
