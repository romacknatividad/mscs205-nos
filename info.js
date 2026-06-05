function closeInfoTips(except) {
  document.querySelectorAll(".info-tip.is-open").forEach((tip) => {
    if (tip !== except) {
      tip.classList.remove("is-open");
      const trigger = tip.querySelector(".info-trigger");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    }
  });
}

function setupInfoTips() {
  const tips = document.querySelectorAll(".info-tip");
  if (!tips.length) return;

  tips.forEach((tip, index) => {
    const trigger = tip.querySelector(".info-trigger");
    const bubble = tip.querySelector(".info-bubble");
    if (!trigger || !bubble) return;

    if (!bubble.id) {
      bubble.id = `info-bubble-${index + 1}`;
    }

    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", bubble.id);

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const nextOpen = !tip.classList.contains("is-open");
      closeInfoTips(tip);
      tip.classList.toggle("is-open", nextOpen);
      trigger.setAttribute("aria-expanded", nextOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".info-tip")) {
      closeInfoTips();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeInfoTips();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupInfoTips, { once: true });
} else {
  setupInfoTips();
}
