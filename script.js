const SELECTORS = {
  faqAnswer: ".faq-answer",
  faqItem: ".faq-item",
  faqQuestion: ".faq-question",
  formStatus: ".form-status",
  navLink: ".nav-link",
  navToggle: ".nav-toggle",
  reveal: ".reveal",
  section: "section[id], header[id]",
  siteNav: ".site-nav",
};

const OPEN_CLASS = "is-open";
const VISIBLE_CLASS = "is-visible";
const ACTIVE_CLASS = "is-active";

const getElements = (selector) =>
  Array.from(document.querySelectorAll(selector));

const setMobileNavOpen = (button, nav, isOpen) => {
  button.setAttribute("aria-expanded", String(isOpen));
  button.classList.toggle(OPEN_CLASS, isOpen);
  nav.classList.toggle(OPEN_CLASS, isOpen);
};

const initMobileNavigation = () => {
  const navToggle = document.querySelector(SELECTORS.navToggle);
  const siteNav = document.querySelector(SELECTORS.siteNav);
  const navLinks = getElements(SELECTORS.navLink);

  if (!navToggle || !siteNav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMobileNavOpen(navToggle, siteNav, !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () =>
      setMobileNavOpen(navToggle, siteNav, false),
    );
  });
};

const initActiveNavigation = () => {
  const navLinks = getElements(SELECTORS.navLink);
  const sections = getElements(SELECTORS.section);

  if (!navLinks.length || !sections.length) return;

  const setActiveLink = () => {
    const currentY = window.scrollY + 140;
    const currentSection = sections
      .filter((section) => section.offsetTop <= currentY)
      .at(-1);
    const currentId = currentSection?.id || "top";

    navLinks.forEach((link) => {
      link.classList.toggle(ACTIVE_CLASS, link.hash === `#${currentId}`);
    });
  };

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();
};

const initRevealAnimations = () => {
  const revealElements = getElements(SELECTORS.reveal);

  if (!revealElements.length) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add(VISIBLE_CLASS));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add(VISIBLE_CLASS);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
};

const closeFaqItem = (item) => {
  const button = item.querySelector(SELECTORS.faqQuestion);
  const answer = item.querySelector(SELECTORS.faqAnswer);

  item.classList.remove(OPEN_CLASS);
  button?.setAttribute("aria-expanded", "false");
  if (answer) answer.style.maxHeight = null;
};

const openFaqItem = (item, button, answer) => {
  item.classList.add(OPEN_CLASS);
  button.setAttribute("aria-expanded", "true");
  answer.style.maxHeight = `${answer.scrollHeight}px`;
};

const initFaqAccordion = () => {
  const faqItems = getElements(SELECTORS.faqItem);

  faqItems.forEach((item) => {
    const button = item.querySelector(SELECTORS.faqQuestion);
    const answer = item.querySelector(SELECTORS.faqAnswer);

    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains(OPEN_CLASS);

      faqItems.forEach(closeFaqItem);
      if (!isOpen) openFaqItem(item, button, answer);
    });
  });
};

const initContactForm = () => {
  const form = document.querySelector("#contact-form");
  const status = form?.querySelector(SELECTORS.formStatus);

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const name = formData.get("name") || "Website enquiry";
    const messageLines = [
      `Name: ${name}`,
      `Phone: ${formData.get("phone") || ""}`,
      `Email: ${formData.get("email") || ""}`,
      `Number of tanks: ${formData.get("tank_count") || ""}`,
      "",
      "Message:",
      formData.get("message") || "",
    ];
    const subject = encodeURIComponent(`Water tank cleaning enquiry - ${name}`);
    const body = encodeURIComponent(messageLines.join("\n"));

    window.location.href = `mailto:hello@northtanks.co.nz?subject=${subject}&body=${body}`;

    if (status) {
      status.textContent = "Opening your email app to send the enquiry.";
    }
  });
};

initMobileNavigation();
initActiveNavigation();
initRevealAnimations();
initFaqAccordion();
initContactForm();
