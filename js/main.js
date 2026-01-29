document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     Mobile hamburger menu
  ================================ */
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  function closeNav() {
    if (!hamburger || !nav) return;
    hamburger.setAttribute("aria-expanded", "false");
    nav.classList.remove("active");
  }

  function toggleNav() {
    if (!hamburger || !nav) return;
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("active");
  }

  if (hamburger && nav) {
    hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      toggleNav();
    });

    // Κλείσε το menu όταν πατηθεί κάποιο link (mobile UX)
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) closeNav();
    });

    // ESC κλείνει το menu
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ===============================
     ESPA modal (delegated + accessible)
  ================================ */
  (function () {
    const modalId = "espa-modal";

    function openModal(modal) {
      if (!modal) return;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      const closeBtn = modal.querySelector(".modal-close");
      if (closeBtn) closeBtn.focus();
    }

    function closeModal(modal) {
      if (!modal) return;
      modal.hidden = true;
      document.body.style.overflow = "";
      const trigger = document.querySelector(".espa-trigger");
      if (trigger) trigger.focus();
    }

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(".espa-trigger");
      const modal = document.getElementById(modalId);

      if (trigger) {
        e.preventDefault();
        openModal(modal);
        return;
      }

      if (!modal || modal.hidden) return;

      if (e.target.closest(".modal-close")) {
        e.preventDefault();
        closeModal(modal);
        return;
      }

      // click στο overlay (έξω από το content)
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    document.addEventListener("keydown", (e) => {
      const modal = document.getElementById(modalId);
      if (e.key === "Escape" && modal && !modal.hidden) {
        closeModal(modal);
      }
    });
  })();

  /* ===============================
     Gallery groups for Clinic popup slideshow
  ================================ */
  const GALLERIES = {
    waiting: Array.from({ length: 9 }, (_, i) => ({
      src: `assets/images/waiting${i + 1}.jpg`,
      alt: `Χώρος αναμονής ιατρείου (${i + 1})`,
    })),
    office: Array.from({ length: 4 }, (_, i) => ({
      src: `assets/images/office${i + 1}.jpg`,
      alt: `Χώρος γραφείου ιατρείου (${i + 1})`,
    })),
    exam: Array.from({ length: 3 }, (_, i) => ({
      src: `assets/images/exam${i + 1}.jpg`,
      alt: `Εξεταστήριο ιατρείου (${i + 1})`,
    })),
    bathroom: Array.from({ length: 2 }, (_, i) => ({
      src: `assets/images/other${i + 1}.jpg`,
      alt: `Μπάνιο ιατρείου (${i + 1})`,
    })),
    obgyn: Array.from({ length: 4 }, (_, i) => ({
      src: `assets/images/obgyn${i + 1}.jpg`,
      alt: `Η ιατρός στο ιατρείο (${i + 1})`,
    })),
  };

  function openSlideshow({ images, startIndex = 0, returnFocusEl }) {
    let index = startIndex;

    // guard: μην ανοίγεις δεύτερο lightbox
    if (document.querySelector(".lightbox")) return;

    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const inner = document.createElement("div");
    inner.className = "lb-inner";

    const top = document.createElement("div");
    top.className = "lb-top";

    const closeBtn = document.createElement("button");
    closeBtn.className = "lb-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Κλείσιμο προβολής");
    closeBtn.textContent = "×";
    top.appendChild(closeBtn);

    const stage = document.createElement("div");
    stage.className = "lb-stage";

    const prevBtn = document.createElement("button");
    prevBtn.className = "lb-nav lb-prev";
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Προηγούμενη φωτογραφία");
    prevBtn.textContent = "‹";

    const img = document.createElement("img");
    img.className = "lb-img";

    const nextBtn = document.createElement("button");
    nextBtn.className = "lb-nav lb-next";
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Επόμενη φωτογραφία");
    nextBtn.textContent = "›";

    stage.appendChild(prevBtn);
    stage.appendChild(img);
    stage.appendChild(nextBtn);

    const caption = document.createElement("div");
    caption.className = "lb-caption";
    caption.setAttribute("aria-live", "polite");

    inner.appendChild(top);
    inner.appendChild(stage);
    inner.appendChild(caption);

    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function render() {
      const item = images[index];
      img.src = item.src;
      img.alt = item.alt;
      caption.textContent = `${index + 1} / ${images.length}`;
    }

    function prev() {
      index = (index - 1 + images.length) % images.length;
      render();
    }

    function next() {
      index = (index + 1) % images.length;
      render();
    }

    function close() {
      overlay.remove();
      document.body.style.overflow = prevBodyOverflow;
      if (returnFocusEl) returnFocusEl.focus();
      document.removeEventListener("keydown", onKey);
    }

    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
    closeBtn.addEventListener("click", close);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", onKey);

    render();
    closeBtn.focus();
  }

  function openSingleImage(imgEl, returnFocusEl) {
    if (document.querySelector(".lightbox")) return;

    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const bigImg = document.createElement("img");
    bigImg.className = "lb-img";
    bigImg.src = imgEl.src;
    bigImg.alt = imgEl.alt;

    const inner = document.createElement("div");
    inner.className = "lb-inner";
    inner.style.gridTemplateRows = "auto 1fr";

    const top = document.createElement("div");
    top.className = "lb-top";

    const closeBtn = document.createElement("button");
    closeBtn.className = "lb-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Κλείσιμο προβολής");
    closeBtn.textContent = "×";
    top.appendChild(closeBtn);

    inner.appendChild(top);
    inner.appendChild(bigImg);
    overlay.appendChild(inner);

    document.body.appendChild(overlay);

    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function close() {
      overlay.remove();
      document.body.style.overflow = prevBodyOverflow;
      if (returnFocusEl) returnFocusEl.focus();
      document.removeEventListener("keydown", onKey);
    }

    function onKey(e) {
      if (e.key === "Escape") close();
    }

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", onKey);

    closeBtn.focus();
  }

  document.querySelectorAll(".lightbox-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.getAttribute("data-group");
      const indexStr = btn.getAttribute("data-index");

      if (group && GALLERIES[group]) {
        const images = GALLERIES[group];
        const startIndex = Number(indexStr || "0");
        openSlideshow({ images, startIndex, returnFocusEl: btn });
        return;
      }

      const img = btn.querySelector("img");
      if (img) openSingleImage(img, btn);
    });
  });

  /* ===============================
     Cookies consent (όπως το είχες)
  ================================ */
  const COOKIE_KEY = "cookie_prefs_v1";

  function getCookiePrefs() {
    try {
      const raw = localStorage.getItem(COOKIE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setCookiePrefs(prefs) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
  }

  function buildCookieUI() {
    const banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Επιλογές cookies");

    banner.innerHTML = `
      <p>
        Χρησιμοποιούμε απολύτως απαραίτητα cookies για τη λειτουργία του ιστοτόπου.
        Προαιρετικά cookies (π.χ. στατιστικά) ενεργοποιούνται μόνο με τη συγκατάθεσή σας.
        <a class="cookie-link" href="cookies.html">Πολιτική Cookies</a>
        • <a class="cookie-link" href="privacy.html">Πολιτική Απορρήτου</a>
      </p>
      <div class="cookie-actions">
        <button class="cookie-btn primary" type="button" data-action="accept">Αποδοχή προαιρετικών</button>
        <button class="cookie-btn" type="button" data-action="reject">Απόρριψη προαιρετικών</button>
        <button class="cookie-btn" type="button" data-action="settings">Ρυθμίσεις</button>
      </div>
    `;

    const modal = document.createElement("div");
    modal.className = "cookie-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Ρυθμίσεις cookies");

    modal.innerHTML = `
      <div class="cookie-modal-card">
        <h2>Ρυθμίσεις cookies</h2>
        <p class="cookie-small">Μπορείτε να αλλάξετε τις επιλογές σας οποιαδήποτε στιγμή.</p>

        <div class="cookie-row">
          <div>
            <strong>Απολύτως απαραίτητα</strong>
            <div class="cookie-small">Απαιτούνται για λειτουργία & ασφάλεια.</div>
          </div>
          <div class="cookie-toggle">
            <input type="checkbox" checked disabled aria-label="Απολύτως απαραίτητα (πάντα ενεργά)">
            <label>Πάντα ενεργά</label>
          </div>
        </div>

        <div class="cookie-row">
          <div>
            <strong>Στατιστικά (Analytics)</strong>
            <div class="cookie-small">Βοηθούν στη βελτίωση του ιστοτόπου. (Προαιρετικά)</div>
          </div>
          <div class="cookie-toggle">
            <input id="cookie-analytics" type="checkbox" aria-label="Ενεργοποίηση στατιστικών cookies">
            <label for="cookie-analytics">Ενεργά</label>
          </div>
        </div>

        <div class="cookie-actions" style="margin-top:12px;">
          <button class="cookie-btn primary" type="button" data-action="save">Αποθήκευση</button>
          <button class="cookie-btn" type="button" data-action="cancel">Ακύρωση</button>
        </div>

        <p class="cookie-small">
          Για λεπτομέρειες δείτε την <a class="cookie-link" href="cookies.html">Πολιτική Cookies</a>.
        </p>
      </div>
    `;

    document.body.appendChild(banner);
    document.body.appendChild(modal);

    const btnAccept = banner.querySelector('[data-action="accept"]');
    const btnReject = banner.querySelector('[data-action="reject"]');
    const btnSettings = banner.querySelector('[data-action="settings"]');

    const analyticsToggle = modal.querySelector("#cookie-analytics");
    const btnSave = modal.querySelector('[data-action="save"]');
    const btnCancel = modal.querySelector('[data-action="cancel"]');

    let lastFocusEl = null;

    function openModal() {
      lastFocusEl = document.activeElement;
      modal.hidden = false;
      const prefs = getCookiePrefs();
      analyticsToggle.checked = !!(prefs && prefs.analytics);
      analyticsToggle.focus();
    }

    function closeModal() {
      modal.hidden = true;
      if (lastFocusEl && typeof lastFocusEl.focus === "function") lastFocusEl.focus();
    }

    function applyPrefs(prefs) {
      // εδώ θα φορτώσεις analytics μόνο αν prefs.analytics === true
    }

    btnAccept.addEventListener("click", () => {
      const prefs = { necessary: true, analytics: true, ts: Date.now() };
      setCookiePrefs(prefs);
      applyPrefs(prefs);
      banner.remove();
    });

    btnReject.addEventListener("click", () => {
      const prefs = { necessary: true, analytics: false, ts: Date.now() };
      setCookiePrefs(prefs);
      applyPrefs(prefs);
      banner.remove();
    });

    btnSettings.addEventListener("click", openModal);

    btnSave.addEventListener("click", () => {
      const prefs = { necessary: true, analytics: !!analyticsToggle.checked, ts: Date.now() };
      setCookiePrefs(prefs);
      applyPrefs(prefs);
      closeModal();
      banner.remove();
    });

    btnCancel.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    document.querySelectorAll(".cookie-settings-link").forEach((b) => {
      b.addEventListener("click", openModal);
    });
  }

 (function initCookies(){
  const prefs = getCookiePrefs();

  // ✅ ΠΑΝΤΑ χτίζουμε UI για να δουλεύει το footer "Ρυθμίσεις Cookies"
  buildCookieUI();

  // ✅ Αν υπάρχουν prefs, δεν θέλουμε να ξαναδείξουμε banner
  if (prefs) {
    const banner = document.querySelector(".cookie-banner");
    if (banner) banner.remove();
  }
})();

