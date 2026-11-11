(() => {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (!nav || !toggle || !links) return;

  const solidAfter = document.querySelector("[data-nav-solid]") ? 60 : 0; // pages without a hero start solid
  const update = () => nav.classList.toggle("is-solid", !document.querySelector(".hero") || window.scrollY > solidAfter + 20);
  update();
  window.addEventListener("scroll", update, { passive: true });

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    links.classList.toggle("is-open", open);
    nav.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 960) setMenu(false); });
})();
