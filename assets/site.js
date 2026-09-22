(() => {
  const APK_URL =
    "https://github.com/AetherRealmApp/realm/releases/download/play-1.2.3-6/REALM-Play-app.aetherrealm.realm-1.2.3%2B6.apk";
  const APK_NAME = "REALM-Play-app.aetherrealm.realm-1.2.3+6.apk";
  const PLAUSIBLE_DOMAIN = "aetherrealmapp.github.io";
  const PLAUSIBLE_SRC = "https://plausible.io/js/script.js";

  document.documentElement.setAttribute("translate", "no");
  document.documentElement.classList.add("notranslate");
  if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "google");
    meta.setAttribute("content", "notranslate");
    document.head.appendChild(meta);
  }

  window.plausible =
    window.plausible ||
    function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };

  if (!document.querySelector('script[src="' + PLAUSIBLE_SRC + '"]')) {
    const script = document.createElement("script");
    script.defer = true;
    script.setAttribute("data-domain", PLAUSIBLE_DOMAIN);
    script.src = PLAUSIBLE_SRC;
    document.head.appendChild(script);
  }

  let apkBusy = false;

  const localApkUrl = () =>
    new URL("/apk/" + encodeURIComponent(APK_NAME), window.location.origin).href;

  const triggerFileDownload = (href, filename) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    link.rel = "noopener";
    link.type = "application/vnd.android.package-archive";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const fetchApkBlob = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("apk-fetch-failed");
    const blob = await response.blob();
    const type = String(blob.type || "");
    if (blob.size < 1024 || type.indexOf("text/html") !== -1) {
      throw new Error("apk-not-binary");
    }
    return blob;
  };

  const downloadApk = async (trigger) => {
    if (apkBusy) return;
    apkBusy = true;
    trigger.setAttribute("aria-busy", "true");
    let objectUrl = "";
    try {
      let blob;
      try {
        blob = await fetchApkBlob(APK_URL);
      } catch (error) {
        blob = await fetchApkBlob(localApkUrl());
      }
      objectUrl = URL.createObjectURL(blob);
      triggerFileDownload(objectUrl, APK_NAME);
    } catch (error) {
      triggerFileDownload(APK_URL, APK_NAME);
    } finally {
      if (objectUrl) {
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      }
      setTimeout(() => {
        trigger.removeAttribute("aria-busy");
        apkBusy = false;
      }, 1500);
    }
  };

  document.querySelectorAll("[data-apk]").forEach((node) => {
    node.setAttribute("href", APK_URL);
    node.setAttribute("download", APK_NAME);
    node.setAttribute("type", "application/vnd.android.package-archive");
    node.addEventListener("click", (event) => {
      event.preventDefault();
      if (apkBusy) return;
      window.plausible("REALM_APK_DOWNLOAD");
      void downloadApk(node);
    });
  });

  const detectLanguage = () => {
    const saved = localStorage.getItem("realm-lang");
    if (saved === "tr" || saved === "en") return saved;
    const nav = String(navigator.language || navigator.userLanguage || "en").toLowerCase();
    return nav.startsWith("tr") ? "tr" : "en";
  };

  let language = detectLanguage();

  const applyLanguage = () => {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-en]").forEach((node) => {
      if (node.closest(".lang-switch")) return;
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
      btn.textContent = btn.dataset.setLang === "tr" ? "TR" : "EN";
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
