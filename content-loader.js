const SITE_CONTENT_URL = `site-content.json?ts=${Date.now()}`;

function setText(id, value) {
  const element = document.getElementById(id);
  if (!element || typeof value !== "string") {
    return;
  }

  element.textContent = value;
}

function setLink(id, href, label) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  if (typeof href === "string" && href.length > 0) {
    element.href = href;
  }

  if (typeof label === "string") {
    element.textContent = label;
  }
}

function setMailLink(id, email) {
  const element = document.getElementById(id);
  if (!element || typeof email !== "string") {
    return;
  }

  element.href = `mailto:${email}`;
  element.textContent = email;
}

function setPhoneLink(id, display, href) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  if (typeof href === "string" && href.length > 0) {
    element.href = `tel:${href}`;
  }

  if (typeof display === "string") {
    element.textContent = display;
  }
}

function applyFeaturedLinks(links) {
  if (!Array.isArray(links)) {
    return;
  }

  links.slice(0, 2).forEach((link, index) => {
    const number = index + 1;
    setText(`featuredTitle${number}`, link.title);
    setText(`featuredDescription${number}`, link.description);
    setLink(`featuredLink${number}`, link.url, link.label || "Open featured link");
  });
}

function applySiteContent(content) {
  if (!content || typeof content !== "object") {
    return;
  }

  if (content.hero) {
    setText("heroTag", content.hero.tag);
    setText("heroFocus", content.hero.focus);
  }

  if (content.about && Array.isArray(content.about.paragraphs)) {
    content.about.paragraphs.slice(0, 3).forEach((paragraph, index) => {
      setText(`aboutParagraph${index + 1}`, paragraph);
    });
  }

  if (content.contact) {
    setText("quickInfoLocation", content.contact.location);
    setText("contactLocation", content.contact.location);
    setMailLink("quickInfoEmail", content.contact.email);
    setMailLink("contactEmail", content.contact.email);
    setPhoneLink("quickInfoPhone", content.contact.phone_display, content.contact.phone_href);
    setPhoneLink("contactPhone", content.contact.phone_display, content.contact.phone_href);
  }

  applyFeaturedLinks(content.featured_links);
}

async function loadSiteContent() {
  try {
    const response = await fetch(SITE_CONTENT_URL, { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const content = await response.json();
    applySiteContent(content);
    window.__siteContent = content;
  } catch (error) {
    console.debug("Site content could not be loaded.", error);
  }
}

loadSiteContent();
