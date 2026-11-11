(() => {
  const grid = document.querySelector("[data-catalog]");
  if (!grid) return;

  const U = "https://images.unsplash.com/photo-";
  const img = (id, w = 900) => `${U}${id}?auto=format&fit=crop&w=${w}&q=75`;

  // Sample catalogue. Replace names, photos and specs with Saifspace's real pieces.
  const P = [
    { id: "lounge-sofa", cat: "Sofas & Seating", name: "Lounge Sofa", desc: "Deep, relaxed seating in textured neutral upholstery.", mat: "Solid wood frame · Linen blend", imgs: ["1593987314040-8e0ac84ae724", "1598928506311-c55ded91a20c"] },
    { id: "accent-chair", cat: "Sofas & Seating", name: "Accent Armchair", desc: "A sculpted chair that anchors a reading corner.", mat: "Hardwood legs · Bouclé fabric", imgs: ["1757924461488-ef9ad0670978", "1638885930125-85350348d266"] },
    { id: "upholstered-bed", cat: "Beds & Bedroom Furniture", name: "Upholstered Bed", desc: "A softly padded headboard with clean, tailored lines.", mat: "Fabric upholstery · Walnut legs", imgs: ["1766245456897-5c86726d084d", "1768946131535-b90bad125f16"] },
    { id: "timber-bed", cat: "Beds & Bedroom Furniture", name: "Timber Headboard Bed", desc: "Warm wood headboard for a calm, grounded bedroom.", mat: "Solid timber · Matte lacquer", imgs: ["1731336478850-6bce7235e320", "1779903726446-6f796d533d47"] },
    { id: "oak-dining", cat: "Dining Tables", name: "Oak Dining Table", desc: "A warm wooden table paired with upholstered chairs.", mat: "Natural oak · Matte finish", imgs: ["1758977404039-6e834be8eca8", "1657524398377-567034729507"] },
    { id: "long-dining", cat: "Dining Tables", name: "Long Dining Table", desc: "Generous proportions for gatherings of every size.", mat: "Timber top · Powder-coated base", imgs: ["1723750290151-164cb19ebab7", "1773578978637-c9771e7a9913"] },
    { id: "wood-coffee", cat: "Coffee Tables", name: "Wooden Coffee Table", desc: "A low timber table that grounds the seating area.", mat: "Solid wood · Natural oil finish", imgs: ["1593987314040-8e0ac84ae724", "1687180498602-5a1046defaa4"] },
    { id: "kitchen-wardrobe", cat: "Wardrobes", name: "Fitted Wardrobe", desc: "Floor-to-ceiling storage with a quiet, seamless front.", mat: "Veneer · Soft-close hardware", imgs: ["1731336478850-6bce7235e320"] },
    { id: "tv-unit", cat: "TV Units", name: "Media Console", desc: "Low, long unit with concealed cable management.", mat: "Veneer · Metal detailing", imgs: ["1697947656193-a87d460b5fb5", "1757924461488-ef9ad0670978"] },
    { id: "slat-wall", cat: "Custom Furniture", name: "Slatted Feature Panel", desc: "Made-to-measure timber panelling and joinery.", mat: "Veneer · Hand-finished", imgs: ["1777613359399-d13a513aa571"] },
    { id: "bespoke-desk", cat: "Custom Furniture", name: "Bespoke Executive Desk", desc: "Built to your workspace, from drawer layout to finish.", mat: "Timber · Leather inlay", imgs: ["1497366811353-6870744d04b2"] },
    { id: "decor-console", cat: "Decorative Furniture", name: "Marble Console", desc: "A statement piece for entrances and living rooms.", mat: "Marble top · Brushed brass", imgs: ["1758448500688-3ababa93fd67", "1598928506311-c55ded91a20c"] },
  ];

  const cats = ["All", ...new Set(P.map((p) => p.cat))];
  const filterWrap = document.querySelector("[data-cat-filters]");
  const search = document.querySelector("[data-search]");
  const empty = document.querySelector(".empty");
  const listView = document.querySelector("[data-list-view]");
  const detail = document.querySelector("[data-detail]");
  let activeCat = "All";

  filterWrap.innerHTML = cats.map((c, i) => `<button type="button" class="filter-btn${i ? "" : " is-active"}" data-cat="${c}" aria-pressed="${i === 0}">${c}</button>`).join("");
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const render = () => {
    const q = search.value.trim().toLowerCase();
    const items = P.filter((p) => (activeCat === "All" || p.cat === activeCat) && (!q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)));
    grid.innerHTML = items.map((p) => `
      <article class="furn-card">
        <div class="furn-card__img"><img data-photo src="${img(p.imgs[0], 700)}" alt="${esc(p.name)}" loading="lazy" width="700" height="700"></div>
        <div class="furn-card__body"><span class="furn-card__cat">${esc(p.cat)}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><p class="furn-card__mat">${esc(p.mat)}</p>
          <div class="furn-card__foot"><span class="furn-card__quote">Request a Quote</span><a class="link-arrow" href="#product=${p.id}">View Details</a></div></div>
      </article>`).join("");
    grid.querySelectorAll("img[data-photo]").forEach((i) => i.addEventListener("error", () => { i.removeAttribute("src"); i.classList.add("img-fallback"); }));
    empty.classList.toggle("is-on", !items.length);
  };

  filterWrap.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    activeCat = b.dataset.cat;
    filterWrap.querySelectorAll("button").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
    render();
  });
  search.addEventListener("input", render);

  const showDetail = (id) => {
    const p = P.find((x) => x.id === id);
    if (!p) return showList();
    listView.hidden = true;
    detail.classList.add("is-open");
    document.title = `${p.name} | Saifspace Furniture`;
    detail.querySelector("[data-d-img]").src = img(p.imgs[0], 1200);
    detail.querySelector("[data-d-img]").alt = p.name;
    detail.querySelector("[data-d-cat]").textContent = p.cat;
    detail.querySelector("[data-d-name]").textContent = p.name;
    detail.querySelector("[data-d-desc]").textContent = p.desc;
    detail.querySelector("[data-d-mat]").textContent = p.mat;
    const thumbs = detail.querySelector("[data-d-thumbs]");
    thumbs.innerHTML = p.imgs.length > 1 ? p.imgs.map((x, i) => `<button type="button" aria-current="${i === 0}" aria-label="Show image ${i + 1}"><img src="${img(x, 300)}" alt=""></button>`).join("") : "";
    thumbs.onclick = (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const i = [...thumbs.children].indexOf(b);
      detail.querySelector("[data-d-img]").src = img(p.imgs[i], 1200);
      [...thumbs.children].forEach((t, k) => t.setAttribute("aria-current", String(k === i)));
    };
    const form = detail.querySelector("form");
    form.dataset.subject = p.name;
    window.scrollTo({ top: 0 });
  };
  const showList = () => { listView.hidden = false; detail.classList.remove("is-open"); document.title = "Furniture Catalogue | Saifspace Interior Design Studio"; };
  const route = () => { const m = location.hash.match(/^#product=(.+)$/); m ? showDetail(m[1]) : showList(); };
  window.addEventListener("hashchange", route);
  render();
  route();
  if (window.lucide) window.lucide.createIcons();
})();
