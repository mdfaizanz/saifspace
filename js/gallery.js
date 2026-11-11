(() => {
  const grid = document.querySelector("[data-project-grid]");
  if (!grid) return;
  const projects = [...grid.querySelectorAll(".project")];

  // Category filters
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      projects.forEach((p) => p.classList.toggle("is-hidden", f !== "all" && p.dataset.category !== f));
    });
  });

  // Lightbox
  const box = document.querySelector(".lightbox");
  if (!box) return;
  const img = box.querySelector("img");
  const title = box.querySelector("[data-lb-title]");
  const cat = box.querySelector("[data-lb-cat]");
  const desc = box.querySelector("[data-lb-desc]");
  let list = [], idx = 0, lastFocus = null;

  const show = (n) => {
    idx = (n + list.length) % list.length;
    const p = list[idx];
    img.src = p.dataset.full;
    img.alt = p.dataset.title;
    title.firstChild.textContent = p.dataset.title;
    cat.textContent = p.dataset.label;
    if (desc) desc.textContent = p.dataset.desc || "";
  };
  const open = (p) => {
    list = projects.filter((x) => !x.classList.contains("is-hidden"));
    lastFocus = document.activeElement;
    box.classList.add("is-open");
    document.body.style.overflow = "hidden";
    show(list.indexOf(p));
    box.querySelector(".lightbox__close").focus();
  };
  const close = () => {
    box.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  projects.forEach((p) => p.querySelector(".project__open").addEventListener("click", () => open(p)));
  box.querySelector(".lightbox__close").addEventListener("click", close);
  box.querySelector(".lightbox__prev").addEventListener("click", () => show(idx - 1));
  box.querySelector(".lightbox__next").addEventListener("click", () => show(idx + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
})();
