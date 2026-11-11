(() => {
  if (window.lucide) window.lucide.createIcons();

  // Loader
  const loader = document.querySelector(".loader");
  const hideLoader = () => loader && loader.classList.add("is-done");
  window.addEventListener("load", () => setTimeout(hideLoader, 350));
  setTimeout(hideLoader, 3000); // safety net if an image is slow

  // Image fallback: if a photo fails to load, show a soft beige block instead of a broken icon
  document.querySelectorAll("img[data-photo]").forEach((img) => {
    img.addEventListener("error", () => {
      img.removeAttribute("src");
      img.classList.add("img-fallback");
    });
  });

  // Scroll reveal
  const items = document.querySelectorAll(".reveal, .img-reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }

  // Gentle parallax
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const layers = document.querySelectorAll("[data-parallax]");
  if (!reduce && layers.length) {
    let ticking = false;
    const run = () => {
      layers.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const shift = (r.top + r.height / 2 - window.innerHeight / 2) * -0.08;
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(run); ticking = true; } }, { passive: true });
    run();
  }

  // Back to top
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", () => toTop.classList.toggle("is-visible", window.scrollY > 700), { passive: true });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Testimonial slider
  const root = document.querySelector("[data-testi]");
  if (root) {
    const track = root.querySelector(".testi__track");
    const slides = root.querySelectorAll(".testi__slide");
    const dotsWrap = root.querySelector(".dots");
    let i = 0, timer;
    slides.forEach((_, n) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", `Show testimonial ${n + 1}`);
      b.addEventListener("click", () => { go(n); restart(); });
      dotsWrap.appendChild(b);
    });
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      slides.forEach((s, k) => s.setAttribute("aria-hidden", String(k !== i)));
      dotsWrap.querySelectorAll("button").forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
    };
    const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(i + 1), 7000); };
    root.querySelector("[data-prev]").addEventListener("click", () => { go(i - 1); restart(); });
    root.querySelector("[data-next]").addEventListener("click", () => { go(i + 1); restart(); });
    go(0); restart();
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
