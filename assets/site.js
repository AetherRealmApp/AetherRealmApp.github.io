(() => {
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
  }

  applyLanguage();
})();
