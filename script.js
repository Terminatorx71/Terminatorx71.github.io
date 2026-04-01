const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress");
const hero = document.querySelector(".hero");
const parallaxLayers = document.querySelectorAll(".parallax-layer");
const revealItems = document.querySelectorAll(".reveal, .reveal-text");

const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
const interactiveTargets = document.querySelectorAll("a, button");

// Smooth section scrolling with sticky-header offset.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    const offset = header ? header.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - offset + 2;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  });
});

// Hero load animation.
if (hero) {
  requestAnimationFrame(() => {
    hero.classList.add("loaded");
  });
}

// Reveal sections and text when they enter the viewport.
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -42px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

let ticking = false;

function animateOnScroll() {
  const scrollTop = window.scrollY;
  const fullHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = fullHeight > 0 ? scrollTop / fullHeight : 0;

  if (progressBar) {
    progressBar.style.transform = `scaleX(${progress})`;
  }

  if (header) {
    header.classList.toggle("scrolled", scrollTop > 16);
  }

  parallaxLayers.forEach((layer) => {
    const depth = Number(layer.dataset.depth) || 0;
    layer.style.transform = `translateY(${scrollTop * depth}px)`;
  });

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(animateOnScroll);
    ticking = true;
  }
});

animateOnScroll();

// Cursor tuning:
// - ringEase controls how delayed the circle is. Lower = more delay.
// - dotHoverScale and ringHoverScale control hover enlargement.
if (dot && ring && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  let dotScale = 1;
  let ringScale = 1;
  const ringEase = 0.075;
  const dotHoverScale = 1.28;
  const ringHoverScale = 1.2;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${dotScale})`;
    dot.classList.add("visible");
    ring.classList.add("visible");
  });

  interactiveTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      dotScale = dotHoverScale;
      ringScale = ringHoverScale;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${dotScale})`;
      ring.style.boxShadow = "0 0 32px rgba(179, 255, 0, 0.28)";
      ring.style.borderColor = "rgba(179, 255, 0, 0.95)";
    });

    target.addEventListener("mouseleave", () => {
      dotScale = 1;
      ringScale = 1;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${dotScale})`;
      ring.style.boxShadow = "0 0 24px rgba(179, 255, 0, 0.18)";
      ring.style.borderColor = "rgba(179, 255, 0, 0.68)";
    });
  });

  const followRing = () => {
    ringX += (mouseX - ringX) * ringEase;
    ringY += (mouseY - ringY) * ringEase;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${ringScale})`;
    requestAnimationFrame(followRing);
  };

  requestAnimationFrame(followRing);
}
