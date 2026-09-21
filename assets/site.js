(() => {
  const APK_URL =
    "https://github.com/AetherRealmApp/realm/releases/download/play-1.2.3-6/REALM-Play-app.aetherrealm.realm-1.2.3%2B6.apk";
  const APK_NAME = "REALM-Play-app.aetherrealm.realm-1.2.3+6.apk";
  const APK_FRAME = "realm-apk-download";

  const startApkDownload = () => {
    document.querySelectorAll(`iframe[name="${APK_FRAME}"]`).forEach((node) => node.remove());
    const frame = document.createElement("iframe");
    frame.name = APK_FRAME;
    frame.setAttribute("hidden", "");
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("title", "APK download");
    frame.src = APK_URL;
    document.body.appendChild(frame);
  };

  document.querySelectorAll("[data-apk]").forEach((node) => {
    node.setAttribute("href", APK_URL);
    node.setAttribute("download", APK_NAME);
    node.addEventListener("click", (event) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      startApkDownload();
    });
  });

  const detectLanguage = () => {
    const saved = localStorage.getItem("realm-lang");
    if (saved === "tr" || saved === "en") return saved;
    return "en";
  };

  let language = detectLanguage();

  const applyLanguage = () => {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-en]").forEach((node) => {
      const value = node.dataset[language];
      if (typeof value === "string") node.textContent = value;
    });
    document.querySelectorAll("[data-en-aria]").forEach((node) => {
      node.setAttribute(
        "aria-label",
        language === "tr" ? node.dataset.trAria : node.dataset.enAria
      );
    });
    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.setLang === language));
    });
    const groveImage = document.getElementById("grove-stage-image");
    const selected = document.querySelector(".day-rail [aria-selected='true']");
    if (groveImage && selected) {
      groveImage.alt =
        language === "tr" ? selected.dataset.altTr : selected.dataset.altEn;
    }
  };

  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      language = btn.dataset.setLang === "tr" ? "tr" : "en";
      localStorage.setItem("realm-lang", language);
      applyLanguage();
    });
  });

  document.querySelectorAll(".lang").forEach((btn) => {
    btn.addEventListener("click", () => {
      language = language === "en" ? "tr" : "en";
      localStorage.setItem("realm-lang", language);
      applyLanguage();
    });
  });

  const header = document.querySelector(".site-header");
  const menuBtn = document.querySelector(".menu-btn");
  const drawer = document.querySelector(".drawer");

  const setMenu = (open) => {
    if (!menuBtn || !drawer) return;
    drawer.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  };

  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", () => {
      setMenu(!drawer.classList.contains("open"));
    });
    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", (event) => {
      if (!drawer.classList.contains("open")) return;
      if (drawer.contains(event.target) || menuBtn.contains(event.target)) return;
      setMenu(false);
    });
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const groveImage = document.getElementById("grove-stage-image");
  const groveButtons = document.querySelectorAll("[data-grove-day]");
  if (groveImage && groveButtons.length) {
    groveButtons.forEach((btn) => {
      const preload = new Image();
      preload.src = btn.dataset.src;
      btn.addEventListener("click", () => {
        groveButtons.forEach((other) => other.setAttribute("aria-selected", "false"));
        btn.setAttribute("aria-selected", "true");
        groveImage.src = btn.dataset.src;
        groveImage.alt = language === "tr" ? btn.dataset.altTr : btn.dataset.altEn;
      });
    });
  }

  applyLanguage();
})();
