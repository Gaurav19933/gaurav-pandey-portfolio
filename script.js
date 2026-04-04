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
    ".metrics-card, .pub-card, .timeline-item, .skills-group, .cert-card, .certifications, .document-card, .contact-card"
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
