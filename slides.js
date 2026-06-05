function setupReveals() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.12 });

  nodes.forEach((node) => observer.observe(node));
}

function setupHeroNetworkAnimation() {
  const layer = document.getElementById("requestLayer");
  if (!layer) return;

  const nodeElements = [
    document.querySelector(".node.one"),
    document.querySelector(".node.two"),
    document.querySelector(".node.three"),
    document.querySelector(".node.four")
  ].filter(Boolean);
  const server = document.querySelector(".node.server");
  if (!server || !nodeElements.length) return;

  const liveRequests = document.getElementById("liveRequests");
  const completedRequests = document.getElementById("completedRequests");
  const failedRequests = document.getElementById("failedRequests");
  const burstRequests = document.getElementById("burstRequests");

  const counters = {
    live: 0,
    completed: 0,
    failed: 0,
    bursts: 0
  };

  function updateCounters() {
    if (liveRequests) liveRequests.textContent = String(counters.live);
    if (completedRequests) completedRequests.textContent = String(counters.completed);
    if (failedRequests) failedRequests.textContent = String(counters.failed);
    if (burstRequests) burstRequests.textContent = String(counters.bursts);
  }

  function getCenterRelativeToLayer(element) {
    const elementRect = element.getBoundingClientRect();
    const layerRect = layer.getBoundingClientRect();
    return {
      x: elementRect.left - layerRect.left + (elementRect.width / 2),
      y: elementRect.top - layerRect.top + (elementRect.height / 2)
    };
  }

  function animateParticle(el, start, end, duration, onDone) {
    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const x = start.x + ((end.x - start.x) * eased);
      const y = start.y + ((end.y - start.y) * eased);

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.opacity = `${1 - (progress * 0.15)}`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        onDone();
      }
    }

    requestAnimationFrame(frame);
  }

  function createBurstWave(origin) {
    const wave = document.createElement("span");
    wave.className = "burst-wave";
    wave.style.left = `${origin.x}px`;
    wave.style.top = `${origin.y}px`;
    layer.appendChild(wave);
    window.setTimeout(() => wave.remove(), 700);
  }

  function pulseNode(node) {
    node.classList.remove("bursting");
    void node.offsetWidth;
    node.classList.add("bursting");
    window.setTimeout(() => node.classList.remove("bursting"), 650);
  }

  function spawnReturnParticle(originNode, outcome) {
    const origin = getCenterRelativeToLayer(originNode);
    const serverCenter = getCenterRelativeToLayer(server);
    const result = document.createElement("span");
    result.className = `request-result ${outcome}`;
    layer.appendChild(result);

    animateParticle(
      result,
      serverCenter,
      origin,
      700 + Math.random() * 400,
      () => {
        result.remove();
      }
    );
  }

  function spawnRequest(originNode, isBurst = false) {
    const origin = getCenterRelativeToLayer(originNode);
    const serverCenter = getCenterRelativeToLayer(server);
    const packet = document.createElement("span");
    packet.className = `request-packet${isBurst ? " burst" : ""}`;
    layer.appendChild(packet);

    counters.live += 1;
    updateCounters();

    animateParticle(
      packet,
      origin,
      serverCenter,
      850 + Math.random() * 500,
      () => {
        packet.remove();
        counters.live = Math.max(0, counters.live - 1);

        const failed = Math.random() < (isBurst ? 0.3 : 0.18);
        if (failed) {
          counters.failed += 1;
          spawnReturnParticle(originNode, "failed");
        } else {
          counters.completed += 1;
          spawnReturnParticle(originNode, "success");
        }

        updateCounters();
      }
    );
  }

  function spawnBurst() {
    const originNode = nodeElements[Math.floor(Math.random() * nodeElements.length)];
    const origin = getCenterRelativeToLayer(originNode);
    counters.bursts += 1;
    updateCounters();
    pulseNode(originNode);
    createBurstWave(origin);

    const burstSize = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < burstSize; i += 1) {
      window.setTimeout(() => spawnRequest(originNode, true), i * 110);
    }
  }

  function spawnRegularTraffic() {
    const originNode = nodeElements[Math.floor(Math.random() * nodeElements.length)];
    if (Math.random() < 0.35) {
      pulseNode(originNode);
    }
    spawnRequest(originNode, false);
  }

  updateCounters();

  window.setInterval(spawnRegularTraffic, 520);
  window.setInterval(() => {
    if (Math.random() < 0.75) {
      spawnBurst();
    }
  }, 3600);

  for (let i = 0; i < 5; i += 1) {
    window.setTimeout(spawnRegularTraffic, i * 180);
  }
}

function setupSlideKeyboardNavigation() {
  if (!document.body.classList.contains("slides-page")) return;

  const slideAnchors = [
    "slide-hero",
    "fundamentals",
    "slide-flow",
    "slide-queueing",
    "slide-scheduling",
    "slide-study-path"
  ]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!slideAnchors.length) return;

  function nearestSlideIndex() {
    const viewportMid = window.innerHeight * 0.35;
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    slideAnchors.forEach((node, index) => {
      const rect = node.getBoundingClientRect();
      const distance = Math.abs(rect.top - viewportMid);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  window.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    const currentIndex = nearestSlideIndex();
    const nextIndex = event.key === "ArrowRight"
      ? Math.min(currentIndex + 1, slideAnchors.length - 1)
      : Math.max(currentIndex - 1, 0);

    if (nextIndex === currentIndex) return;
    slideAnchors[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

setupReveals();
setupHeroNetworkAnimation();
setupSlideKeyboardNavigation();
