/* Enquiry forms (contact page + furniture product page).
   Set these once you have real details:
   - whatsappNumber: digits only with country code, e.g. "919876543210"
   - formEndpoint: a form service URL (e.g. Formspree). If empty, the enquiry is sent via WhatsApp. */
window.SAIFSPACE_CONFIG = window.SAIFSPACE_CONFIG || { whatsappNumber: "", formEndpoint: "" };

(() => {
  const cfg = window.SAIFSPACE_CONFIG;
  const waLink = (text) => `https://wa.me/${cfg.whatsappNumber || ""}?text=${encodeURIComponent(text)}`;

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
    phone: (v) => (/^[+\d][\d\s\-()]{6,}$/.test(v.trim()) ? "" : "Please enter a valid phone number."),
    select: (v) => (v ? "" : "Please choose an option."),
    message: (v) => (v.trim().length >= 10 ? "" : "Please tell us a little more (10+ characters)."),
    date: (v) => (!v || new Date(v) >= new Date(new Date().toDateString()) ? "" : "Please choose today or a future date."),
  };

  const checkField = (input) => {
    const type = input.dataset.rule;
    if (!type) return true;
    const wrap = input.closest(".field");
    const msg = input.required || input.value ? rules[type](input.value) : "";
    wrap.classList.toggle("has-error", !!msg);
    wrap.querySelector(".err").textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  };

  document.querySelectorAll("form[data-enquiry]").forEach((form) => {
    const ok = form.querySelector(".alert--ok");
    const bad = form.querySelector(".alert--bad");
    const fields = [...form.querySelectorAll("[data-rule]")];
    fields.forEach((f) => f.addEventListener("blur", () => checkField(f)));
    fields.forEach((f) => f.addEventListener("input", () => f.closest(".field").classList.contains("has-error") && checkField(f)));

    const summary = () => {
      const lines = [`Enquiry for Saifspace Interior Design Studio`];
      if (form.dataset.subject) lines.push(`Product: ${form.dataset.subject}`);
      fields.forEach((f) => {
        const label = form.querySelector(`label[for="${f.id}"]`);
        const val = f.tagName === "SELECT" ? f.options[f.selectedIndex].text : f.value;
        if (val.trim() && label) lines.push(`${label.textContent.replace("*", "").trim()}: ${val.trim()}`);
      });
      return lines.join("\n");
    };

    form.querySelector("[data-wa]")?.addEventListener("click", () => {
      const valid = fields.map(checkField).every(Boolean);
      if (!valid) return showBad("Please fix the highlighted fields before sending on WhatsApp.");
      window.open(waLink(summary()), "_blank", "noopener");
    });

    const showBad = (t) => { ok.classList.remove("is-on"); bad.textContent = t; bad.classList.add("is-on"); };
    const showOk = (t) => { bad.classList.remove("is-on"); ok.textContent = t; ok.classList.add("is-on"); };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const valid = fields.map(checkField).every(Boolean);
      if (!valid) {
        showBad("Please correct the highlighted fields and try again.");
        form.querySelector(".has-error input, .has-error select, .has-error textarea")?.focus();
        return;
      }
      if (cfg.formEndpoint) {
        try {
          const res = await fetch(cfg.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
          if (!res.ok) throw new Error("bad response");
          showOk("Thank you! Your enquiry has been sent. We will get back to you shortly.");
          form.reset();
        } catch (err) {
          showBad("Sorry, we could not send your enquiry. Please try again or use WhatsApp.");
        }
      } else {
        // No form service configured yet: hand the enquiry over via WhatsApp so nothing is lost.
        showOk("Your enquiry is ready. WhatsApp has opened with your details. Press send there to reach us.");
        window.open(waLink(summary()), "_blank", "noopener");
      }
    });
  });

  // Min date for consultation picker
  document.querySelectorAll('input[type="date"]').forEach((d) => (d.min = new Date().toISOString().split("T")[0]));
})();
