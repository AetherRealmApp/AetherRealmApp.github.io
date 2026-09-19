(() => {
  const APK_URL =
    "https://github.com/AetherRealmApp/realm/releases/download/play-1.2.3-6/REALM-Play-app.aetherrealm.realm-1.2.3%2B6.apk";
  const APK_NAME = "REALM-Play-app.aetherrealm.realm-1.2.3+6.apk";

  document.querySelectorAll("[data-apk]").forEach((node) => {
    node.setAttribute("href", APK_URL);
    node.setAttribute("download", APK_NAME);
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
    document.querySelectorAll(".lang").forEach((btn) => {
      btn.textContent = language === "en" ? "TR" : "EN";
    });
    document.querySelectorAll("[data-en]").forEach((node) => {
      const value = node.dataset[language];
      if (typeof value === "string") node.textContent = value;
    });
    document.querySelectorAll("[data-en-aria]").forEach((node) => {
      node.setAttribute("aria-label", language === "tr" ? node.dataset.trAria : node.dataset.enAria);
    });
  };

  document.querySelectorAll(".lang").forEach((btn) => {
    btn.addEventListener("click", () => {
      language = language === "en" ? "tr" : "en";
      localStorage.setItem("realm-lang", language);
      applyLanguage();
    });
  });

  const menuBtn = document.querySelector(".menu-btn");
  const drawer = document.querySelector(".drawer");
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", () => {
      const open = drawer.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        drawer.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  applyLanguage();
})();
