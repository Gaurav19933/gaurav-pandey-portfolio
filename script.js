const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navLinks");
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll("section[id]");

function onScroll() {
  const scrollY = window.scrollY;

  navbar.classList.toggle("scrolled", scrollY > 60);
  backToTop.classList.toggle("visible", scrollY > 420);

  let currentSection = "";
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 120) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navMenu.classList.remove("open"));
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) {
      return;
    }

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

const revealElements = document.querySelectorAll(
  ".section-header, .about-text, .about-sidebar, .fact, .profile-link-card, .research-card, " +
    ".metrics-card, .pub-card, .timeline-item, .skills-group, .cert-card, .certifications, .document-card, .news-card, .contact-card"
);

revealElements.forEach((element) => {
  element.classList.add("reveal");
  const siblings = [...element.parentElement.children].filter((child) => child.classList.contains("reveal"));
  const index = siblings.indexOf(element);
  if (index > 0 && index <= 3) {
    element.classList.add(`reveal-delay-${index}`);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
);

revealElements.forEach((element) => revealObserver.observe(element));

const bars = document.querySelectorAll(".bar-fill");
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

bars.forEach((bar) => barObserver.observe(bar));

const documentViewer = document.getElementById("documentViewer");
const documentViewerTitle = document.getElementById("documentViewerTitle");
const documentViewerPages = document.getElementById("documentViewerPages");
let lastPreviewTrigger = null;

function closeDocumentViewer() {
  if (!documentViewer || documentViewer.hidden) return;
  documentViewer.hidden = true;
  documentViewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("viewer-open");
  documentViewerPages.replaceChildren();
  lastPreviewTrigger?.focus();
}

document.querySelectorAll(".preview-document").forEach((button) => {
  button.addEventListener("click", () => {
    lastPreviewTrigger = button;
    documentViewerTitle.textContent = button.dataset.previewTitle;
    const pageCount = Number(button.dataset.previewPages);
    const padding = Number(button.dataset.previewPadding || 0);
    const fragment = document.createDocumentFragment();

    for (let page = 1; page <= pageCount; page += 1) {
      const pageNumber = padding ? String(page).padStart(padding, "0") : String(page);
      const figure = document.createElement("figure");
      figure.className = "document-viewer__page";
      const image = document.createElement("img");
      image.src = button.dataset.previewPath.replace("{page}", pageNumber);
      image.alt = `${button.dataset.previewTitle}, page ${page} of ${pageCount}`;
      image.loading = page <= 2 ? "eager" : "lazy";
      image.draggable = false;
      const caption = document.createElement("figcaption");
      caption.textContent = `Page ${page} of ${pageCount}`;
      figure.append(image, caption);
      fragment.append(figure);
    }

    documentViewerPages.replaceChildren(fragment);
    documentViewer.hidden = false;
    documentViewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("viewer-open");
    documentViewer.querySelector(".document-viewer__close").focus();
  });
});

documentViewer?.querySelectorAll("[data-close-viewer]").forEach((control) => {
  control.addEventListener("click", closeDocumentViewer);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDocumentViewer();
});
