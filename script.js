const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navLinks.classList.remove("is-open");
    });
  });
}

const videoFrame = document.querySelector(".video-frame");
const videoTrigger = document.querySelector(".video-trigger");

if (videoFrame && videoTrigger) {
  videoTrigger.addEventListener("click", () => {
    const player = document.createElement("iframe");
    player.src = "https://www.youtube.com/embed/YVzY_hSg2sU";
    player.title = "Not quite a Horse | Unsloppable Art | EP02";
    player.loading = "lazy";
    player.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    player.allowFullscreen = true;
    player.referrerPolicy = "strict-origin-when-cross-origin";
    videoFrame.replaceChildren(player);
  }, { once: true });
}

const year = document.querySelector("#copyright-year");
if (year) year.textContent = String(new Date().getFullYear());
