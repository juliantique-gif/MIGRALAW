/* ==========================================================
   app.js (UNIFICADO + OPTIMIZADO + ORDENADO POR SECCIONES)
   FIXES IMPORTANTES (por lo que me dijiste):
   ✅ El dropdown de "Servicios" ya NO se cierra al instante (stopPropagation dentro del dropdown)
   ✅ El idioma funciona por:
      - URL ?lang=en / ?lang=es
      - o localStorage (si el usuario elige desde el menú)
      - y actualiza TODOS los textos: .nav__langtext y #lang-text
   ✅ Selectores más tolerantes: si tu trigger NO es <button>, igual funciona
   ========================================================== */


/* ==========================================================
   0) HELPERS
   ========================================================== */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);


/* ==========================================================
   1) NAV PRINCIPAL (nav__)
   - Hamburguesa
   - Dropdowns (Servicios + Idioma)
   - Activo según página
   - Idioma (ES/EN)
   ========================================================== */
(() => {
  /* ===== 1.1) Hamburguesa (nav__) ===== */
  const toggleBtn = qs(".nav__toggle");
  const linksMenu = qs(".nav__links");

  if (toggleBtn && linksMenu) {
    on(toggleBtn, "click", () => {
      const open = linksMenu.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(open));
    });
  }

  /* ===== 1.2) Dropdowns (Servicios + Idioma) =====
     PROBLEMA típico: abre y se cierra al instante porque el click "cae" al document.
     SOLUCIÓN: stopPropagation en:
       - el trigger
       - el contenedor del dropdown (dd)
  */
  const dropdowns = qsa(".nav__dropdown");

  const closeAllDropdowns = (except = null) => {
    dropdowns.forEach(d => {
      if (d !== except) d.classList.remove("is-open");
    });
  };

  const getDropdownTrigger = (dd) => {
    // Soporta distintos HTML: button, a, div con rol, etc.
    return (
      dd.querySelector("[data-dd-trigger]") ||
      dd.querySelector(".nav__dropbtn") ||
      dd.querySelector("button") ||
      dd.querySelector("a") ||
      null
    );
  };

  if (dropdowns.length) {
    dropdowns.forEach((dd) => {
      const trigger = getDropdownTrigger(dd);
      if (!trigger) return;

      // IMPORTANTÍSIMO: clic dentro del dropdown NO debe cerrar por el listener del document
      on(dd, "click", (e) => e.stopPropagation());

      on(trigger, "click", (e) => {
        e.preventDefault();  // por si es <a href="#">
        e.stopPropagation();

        // cerrar otros
        closeAllDropdowns(dd);

        // toggle actual
        dd.classList.toggle("is-open");
      });
    });

    // cerrar dropdown si clic fuera
    on(document, "click", () => closeAllDropdowns(null));
  }

  /* ===== 1.3) Activo según página ===== */
  const currentPage = location.pathname.split("/").pop() || "index.html";

  qsa(".nav__link[data-page]").forEach((a) => {
    if (a.dataset.page === currentPage) a.classList.add("is-active");
  });

  // (Opcional) si estás en páginas de servicios, marca "Servicios"
  const serviciosPages = new Set([
    "servicios-individuales-grupos.html",
    "servicios-empresas-profesionales.html",
    "homologacion-titulos.html"
  ]);

  if (serviciosPages.has(currentPage)) {
    // Soporta varias estructuras:
    // - botón con clase .nav__dropbtn
    // - link dentro del dropdown
    const serviciosBtn = qs(".nav__dropbtn") || qs("[data-servicios-trigger]");
    serviciosBtn?.classList.add("is-active");
  }

  /* ===== 1.4) Idioma (URL + localStorage + click en opciones) ===== */
  const LANG_KEY = "site_lang";

  const normalizeLang = (v) => (String(v || "").toLowerCase() === "en" ? "en" : "es");

  const readLang = () => {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get("lang");
    if (fromUrl) return normalizeLang(fromUrl);

    const fromStorage = localStorage.getItem(LANG_KEY);
    if (fromStorage) return normalizeLang(fromStorage);

    return "es";
  };

  const writeLangToUrl = (lang) => {
    // Opcional: mantener en URL sin recargar
    const u = new URL(location.href);
    u.searchParams.set("lang", lang);
    history.replaceState({}, "", u.toString());
  };

  const setLangLabels = (lang) => {
    const label = (lang === "en") ? "EN" : "ES";

    // nav
    const navLangText = qs(".nav__langtext");
    if (navLangText) navLangText.textContent = label;

    // inicio
    const homeLangText = qs("#lang-text");
    if (homeLangText) homeLangText.textContent = label;
  };

  const applyLang = (lang) => {
    const l = normalizeLang(lang);
    localStorage.setItem(LANG_KEY, l);
    setLangLabels(l);
    writeLangToUrl(l);

    // Si quieres cambiar contenido real por idioma, aquí disparas tu lógica:
    // window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: l } }));
  };

  // set inicial
  applyLang(readLang());

  // Click en opciones de idioma (soporta cualquier menú que tenga data-lang)
  // Ejemplos HTML:
  // <div data-lang="es">ES</div>   <div data-lang="en">EN</div>
  // <a data-lang="en" href="?lang=en">English</a>
  const langOptions = qsa("[data-lang]");
  langOptions.forEach(opt => {
    on(opt, "click", (e) => {
      const chosen = opt.dataset.lang;
      if (!chosen) return;

      // si es link, evitamos navegación para que no “se pierda” el dropdown
      e.preventDefault();
      e.stopPropagation();

      applyLang(chosen);

      // cerrar dropdowns tras elegir idioma (si aplica)
      closeAllDropdowns(null);

      // Si tu página depende del lang en backend y quieres recargar, descomenta:
      // location.reload();
    });
  });
})();


/* ==========================================================
   2) REVEAL (IntersectionObserver)
   ========================================================== */
(() => {
  const revealEls = qsa("[data-reveal]");
  if (!revealEls.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealEls.forEach(el => io.observe(el));
})();


/* ==========================================================
   3) VALORES: CARRUSEL (vc)
   ========================================================== */
(() => {
  const viewport = qs("#vcViewport");
  const track    = qs("#vcTrack");
  const prev     = qs("#vcPrev");
  const next     = qs("#vcNext");
  const dotsWrap = qs("#vcDots");
  if (!viewport || !track) return;

  const cards = qsa(".vc-card", track);
  if (!cards.length) return;

  const scrollToIndex = (i) => {
    const card = cards[i];
    if (!card) return;
    const left = card.offsetLeft - (viewport.clientWidth / 2) + (card.clientWidth / 2);
    viewport.scrollTo({ left, behavior: "smooth" });
  };

  const dots = cards.map((_, i) => {
    const b = document.createElement("button");
    b.className = "vc-dot";
    b.type = "button";
    b.setAttribute("aria-label", `Ir al valor ${i + 1}`);
    b.addEventListener("click", () => scrollToIndex(i));
    dotsWrap?.appendChild(b);
    return b;
  });

  const setActiveByCenter = () => {
    const vpRect = viewport.getBoundingClientRect();
    const center = vpRect.left + vpRect.width / 2;

    let bestIdx = 0;
    let bestDist = Infinity;

    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const cCenter = r.left + r.width / 2;
      const dist = Math.abs(center - cCenter);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    });

    cards.forEach(c => c.classList.remove("is-active"));
    dots.forEach(d => d.classList.remove("is-active"));

    cards[bestIdx]?.classList.add("is-active");
    dots[bestIdx]?.classList.add("is-active");
  };

  let raf = 0;
  viewport.addEventListener("scroll", () => {
    if (raf) return;
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
    if (!isDown) return;
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


/* ==========================================================
   4) CHATBOT (UNIFICADO + SEGURO)
   ========================================================== */
(() => {
  const fab   = qs("#chatbotFab");
  const win   = qs("#chatbotWindow");
  const close = qs("#chatbotClose");
  const form  = qs("#chatbotForm");
  const input = qs("#chatbotInput");
  const body  = qs("#chatbotBody");

  if (!fab || !win) return;

  const openChat  = () => { win.hidden = false; };
  const closeChat = () => { win.hidden = true; };

  const addMsg = (text, who = "bot", withPrefix = false) => {
    if (!body) return;

    const el = document.createElement("div");
    el.className = `msg ${who === "user" ? "msg-user" : "msg-bot"}`;

    if (withPrefix) {
      const strong = document.createElement("strong");
      strong.textContent = who === "user" ? "Tú: " : "Bot: ";
      el.appendChild(strong);

      const span = document.createElement("span");
      span.textContent = text; // seguro (anti-XSS)
      el.appendChild(span);
    } else {
      el.textContent = text;
    }

    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  };

  fab.addEventListener("click", () => {
    win.hidden ? openChat() : closeChat();
  });

  close?.addEventListener("click", closeChat);

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = (input?.value || "").trim();
    if (!msg) return;

    addMsg(msg, "user", true);
    addMsg("Gracias. Un asesor puede contactarte. Si quieres, agenda tu asesoría inicial.", "bot");
    input.value = "";
  });
})();


/* ==========================================================
   5) FORMULARIOS / BOTONES GENÉRICOS
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ===== 5.1) BOTÓN VOLVER UNIVERSAL ===== */
  const btnVolver = qs("#btnVolver");
  if (btnVolver) {
    btnVolver.addEventListener("click", () => {
      if (document.referrer && document.referrer !== "") window.history.back();
      else window.location.href = "index.html";
    });
  }

  /* ===== 5.2) SOLO NÚMEROS EN TELÉFONO ===== */
  const telefono = qs("#telefono");
  if (telefono) {
    telefono.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
    });
  }

  /* ===== 5.3) VALIDACIÓN DEL FORMULARIO (informini) ===== */
  const formulario = qs("#formulario");
  if (formulario) {
    formulario.addEventListener("submit", function (e) {
      e.preventDefault();

      const correoEl = qs("#correo");
      const mensaje  = qs("#mensaje");
      if (!correoEl || !mensaje) return;

      const correo = correoEl.value;
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regexCorreo.test(correo)) {
        mensaje.textContent = "Ingrese un correo válido (ej: usuario@gmail.com)";
        mensaje.style.color = "red";
        return;
      }

      mensaje.textContent = "Formulario enviado correctamente ✔";
      mensaje.style.color = "#1fd4d4";
    });
  }
});


/* ==========================================================
   6) INICIO (si existe en esa página)
   - Hamburguesa simple (.hamburguesa -> nav)
   - Dropdown idioma (.idioma)
   ========================================================== */
(() => {
  const hamburguesa = qs(".hamburguesa");
  const menu = qs("nav");

  if (hamburguesa && menu) {
    hamburguesa.addEventListener("click", () => {
      menu.classList.toggle("activo-menu");
    });
  }

  const idiomaBtn = qs(".idioma");
  const opciones = qsa(".idioma-menu div, .idioma-menu [data-lang]");

  if (idiomaBtn) {
    idiomaBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      idiomaBtn.classList.toggle("activo");
    });

    // cerrar al click afuera
    document.addEventListener("click", () => idiomaBtn.classList.remove("activo"));
  }

  if (opciones.length) {
    opciones.forEach(op => {
      op.addEventListener("click", (e) => {
        const l = op.dataset.lang;
        if (!l) return;
        e.preventDefault();
        e.stopPropagation();

        // reutiliza el flujo general: setea localStorage y URL
        const u = new URL(location.href);
        u.searchParams.set("lang", (String(l).toLowerCase() === "en" ? "en" : "es"));
        history.replaceState({}, "", u.toString());
        localStorage.setItem("site_lang", u.searchParams.get("lang"));

        // actualiza labels visibles
        const label = (u.searchParams.get("lang") === "en") ? "EN" : "ES";
        qs(".nav__langtext") && (qs(".nav__langtext").textContent = label);
        qs("#lang-text") && (qs("#lang-text").textContent = label);

        idiomaBtn?.classList.remove("activo");
      });
    });
  }
})();


/* ==========================================================
   7) PERFIL (progreso de trámite)
   ========================================================== */
(() => {
  const linea = qs("#lineaVerde");
  if (!linea) return;

  let estadoProceso = 3; // debería venir del backend

  function actualizarProgreso(estado) {
    const totalPasos = 5;

    for (let i = 1; i <= totalPasos; i++) {
      qs("#paso" + i)?.classList.remove("completado");
    }

    for (let i = 1; i <= estado; i++) {
      qs("#paso" + i)?.classList.add("completado");
    }

    let porcentaje = 0;
    if (estado > 1) porcentaje = ((estado - 1) / (totalPasos - 1)) * 100;
    linea.style.width = porcentaje + "%";
  }

  document.addEventListener("DOMContentLoaded", () => {
    actualizarProgreso(estadoProceso);
  });
})();


/* ==========================================================
   8) REGISTRO (si existe #registroForm)
   ========================================================== */
(() => {
  const form = qs("#registroForm");
  if (!form) return;

  const numeroIdInput = qs("#numeroId");
  const telefonoInput = qs("#telefono");

  numeroIdInput?.addEventListener("input", () => {
    numeroIdInput.value = numeroIdInput.value.replace(/\D/g, "");
  });

  telefonoInput?.addEventListener("input", () => {
    telefonoInput.value = telefonoInput.value.replace(/\D/g, "");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const numeroId = (numeroIdInput?.value || "").trim();
    const tel = (telefonoInput?.value || "").trim();

    if (numeroId === "" || !/^\d+$/.test(numeroId)) {
      alert("Por favor ingrese un número de cédula válido (solo números).");
      return;
    }

    if (tel === "" || !/^\d+$/.test(tel)) {
      alert("Por favor ingrese un número de teléfono válido (solo números).");
      return;
    }

    alert("Formulario enviado correctamente ✅");

    const formData = new FormData(form);
    const datos = {
      rol: formData.get("rol"),
      tipoId: formData.get("tipoId"),
      numeroId,
      codigoPais: formData.get("codigoPais"),
      telefono: tel,
      email: formData.get("email")
    };

    console.log("Formulario enviado:", datos);
  });

  // para botones inline onclick="volver()"
  window.volver = () => window.history.back();
})();


/* ==========================================================
   9) SERVICIOS (funciones globales para onclick si las usas)
   ========================================================== */
(() => {
  const submenu = qs("#submenuVisados");

  window.toggleVisados = () => {
    if (!submenu) return;
    submenu.style.display = (submenu.style.display === "block") ? "none" : "block";
  };

  window.mostrarEstudios = () => location.reload();

  window.limpiarContenido = () => {
    const contenido = qs("#contenido");
    if (!contenido) return;
    contenido.innerHTML =
      "<h2>Contenido en actualización</h2><p>Estamos trabajando para mostrarte la información de esta categoría pronto.</p>";
  };
})();