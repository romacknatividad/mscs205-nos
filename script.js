const algorithmDefinitions = {
  fifo: {
    name: "FIFO / FCFS",
    description: "First In, First Out serves packets in arrival order. It is simple and predictable, but urgent traffic may wait behind less important packets.",
    strength: "Best when simplicity matters and all traffic is treated equally.",
    insight: "FIFO preserves arrival order. This is fair in a basic sense, but it does not distinguish critical traffic from background traffic."
  },
  priority: {
    name: "Priority Queueing",
    description: "Priority Queueing always serves the highest-priority packets first. Voice or control traffic gets lower delay, but low-priority packets can starve.",
    strength: "Best when time-sensitive traffic must be delivered quickly.",
    insight: "Priority scheduling minimizes delay for critical packets, but repeated high-priority arrivals can block general traffic for too long."
  },
  rr: {
    name: "Round Robin",
    description: "Round Robin rotates across non-empty queues, giving each traffic class a turn. It improves fairness, although a large packet still consumes full service time.",
    strength: "Best when balanced sharing across traffic classes is the goal.",
    insight: "Round Robin prevents one active queue from dominating the channel because service rotates in a fixed cycle."
  },
  wfq: {
    name: "Weighted Fair Queueing",
    description: "Weighted Fair Queueing gives each flow or class a share of service proportional to its weight. Important traffic gets more bandwidth without completely excluding others.",
    strength: "Best when fairness and quality of service must coexist.",
    insight: "WFQ balances differentiation and fairness by serving all classes while favoring higher-weight traffic over time."
  }
};

const trafficProfiles = [
  { key: "voice", label: "Voice", colorClass: "voice", priority: 3, size: 1, weight: 3 },
  { key: "video", label: "Video", colorClass: "video", priority: 2, size: 2, weight: 2 },
  { key: "data", label: "Data", colorClass: "data", priority: 1, size: 3, weight: 1 }
];

const state = {
  queues: { voice: [], video: [], data: [] },
  tick: 0,
  sent: [],
  timer: null,
  isRunning: false,
  rrPointer: 0,
  wfqCredits: { voice: 0, video: 0, data: 0 }
};

const queueOrder = ["voice", "video", "data"];

const algorithmSelect = document.getElementById("algorithmSelect");
const speedRange = document.getElementById("speedRange");
const speedLabel = document.getElementById("speedLabel");
const generateBtn = document.getElementById("generateBtn");
const stepBtn = document.getElementById("stepBtn");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const queueList = document.getElementById("queueList");
const activePacket = document.getElementById("activePacket");
const sentCount = document.getElementById("sentCount");
const avgWait = document.getElementById("avgWait");
const fairnessLabel = document.getElementById("fairnessLabel");
const algorithmTitle = document.getElementById("algorithmTitle");
const algorithmDescription = document.getElementById("algorithmDescription");
const algorithmStrength = document.getElementById("algorithmStrength");
const simulationInsight = document.getElementById("simulationInsight");

function initAlgorithms() {
  Object.entries(algorithmDefinitions).forEach(([value, item]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = item.name;
    algorithmSelect.appendChild(option);
  });
  algorithmSelect.value = "fifo";
  updateAlgorithmCopy();
}

function createPacket(profile, index) {
  return {
    id: `${profile.label[0]}${index}`,
    type: profile.key,
    label: profile.label,
    colorClass: profile.colorClass,
    priority: profile.priority,
    size: profile.size,
    weight: profile.weight,
    arrivalTick: state.tick
  };
}

function generateTraffic() {
  stopRun();
  state.tick = 0;
  state.sent = [];
  state.rrPointer = 0;
  state.wfqCredits = { voice: 0, video: 0, data: 0 };
  state.queues = { voice: [], video: [], data: [] };

  let counter = 1;
  trafficProfiles.forEach((profile) => {
    const packetCount = profile.key === "voice" ? 3 : profile.key === "video" ? 4 : 5;
    for (let i = 0; i < packetCount; i += 1) {
      const packet = createPacket(profile, counter);
      packet.arrivalTick = i;
      state.queues[profile.key].push(packet);
      counter += 1;
    }
  });

  updateInsight("Traffic generated. Compare how the same packet mix behaves under different scheduling rules.");
  render();
}

function resetSimulation() {
  stopRun();
  state.queues = { voice: [], video: [], data: [] };
  state.tick = 0;
  state.sent = [];
  state.rrPointer = 0;
  state.wfqCredits = { voice: 0, video: 0, data: 0 };
  activePacket.textContent = "Idle";
  activePacket.className = "channel-packet idle";
  updateInsight("Generate traffic to compare how different algorithms treat the same set of packets.");
  render();
}

function getAlgorithm() {
  return algorithmSelect.value;
}

function selectNextPacket() {
  const algorithm = getAlgorithm();

  if (algorithm === "fifo") {
    const candidates = queueOrder
      .flatMap((queueKey) => state.queues[queueKey])
      .sort((a, b) => a.arrivalTick - b.arrivalTick || b.priority - a.priority);

    if (!candidates.length) return null;
    return removePacket(candidates[0]);
  }

  if (algorithm === "priority") {
    for (const queueKey of queueOrder) {
      if (state.queues[queueKey].length) {
        return state.queues[queueKey].shift();
      }
    }
    return null;
  }

  if (algorithm === "rr") {
    for (let offset = 0; offset < queueOrder.length; offset += 1) {
      const index = (state.rrPointer + offset) % queueOrder.length;
      const key = queueOrder[index];
      if (state.queues[key].length) {
        state.rrPointer = (index + 1) % queueOrder.length;
        return state.queues[key].shift();
      }
    }
    return null;
  }

  if (algorithm === "wfq") {
    queueOrder.forEach((key) => {
      state.wfqCredits[key] += state.queues[key].length ? trafficProfiles.find((profile) => profile.key === key).weight : 0;
    });

    const eligible = queueOrder
      .filter((key) => state.queues[key].length)
      .sort((a, b) => state.wfqCredits[b] - state.wfqCredits[a]);

    if (!eligible.length) return null;
    const selectedKey = eligible[0];
    state.wfqCredits[selectedKey] -= state.queues[selectedKey][0].size;
    return state.queues[selectedKey].shift();
  }

  return null;
}

function removePacket(target) {
  const queue = state.queues[target.type];
  const index = queue.findIndex((packet) => packet.id === target.id);
  if (index >= 0) {
    return queue.splice(index, 1)[0];
  }
  return null;
}

function stepSimulation() {
  const packet = selectNextPacket();
  if (!packet) {
    activePacket.textContent = "Idle";
    activePacket.className = "channel-packet idle";
    updateInsight("All queues are empty. Reset or generate new traffic to run another comparison.");
    render();
    stopRun();
    return;
  }

  state.tick += 1;
  const waitTime = Math.max(0, state.tick - packet.arrivalTick - 1);
  state.sent.push({ ...packet, waitTime });
  activePacket.textContent = `${packet.label} ${packet.id}`;
  activePacket.className = `channel-packet ${packet.colorClass}`;
  updateInsight(buildInsight(packet, waitTime));
  render();
}

function buildInsight(packet, waitTime) {
  const algorithm = getAlgorithm();
  if (algorithm === "fifo") {
    return `${packet.label} ${packet.id} was sent next because it arrived earliest in the overall traffic stream. Its wait time was ${waitTime} ticks.`;
  }
  if (algorithm === "priority") {
    return `${packet.label} ${packet.id} moved first because higher-priority queues are always checked before lower-priority ones. Its wait time was ${waitTime} ticks.`;
  }
  if (algorithm === "rr") {
    return `${packet.label} ${packet.id} was sent on its queue's turn in the rotation. This keeps service moving across classes with a wait time of ${waitTime} ticks.`;
  }
  return `${packet.label} ${packet.id} was selected because its queue had the strongest weighted share at this tick. Its wait time was ${waitTime} ticks.`;
}

function updateAlgorithmCopy() {
  const item = algorithmDefinitions[getAlgorithm()];
  algorithmTitle.textContent = item.name;
  algorithmDescription.textContent = item.description;
  algorithmStrength.textContent = item.strength;
  updateInsight(item.insight);
}

function updateInsight(text) {
  simulationInsight.textContent = text;
}

function render() {
  renderQueues();
  sentCount.textContent = String(state.sent.length);
  avgWait.textContent = `${getAverageWait().toFixed(1)} ticks`;
  fairnessLabel.textContent = getFairnessLabel();
}

function renderQueues() {
  queueList.innerHTML = "";
  trafficProfiles.forEach((profile) => {
    const row = document.createElement("div");
    row.className = "queue-row";

    const label = document.createElement("div");
    label.innerHTML = `<strong>${profile.label}</strong><span class="queue-label">Priority ${profile.priority} | Weight ${profile.weight}</span>`;

    const track = document.createElement("div");
    track.className = "queue-track";

    state.queues[profile.key].forEach((packet) => {
      const chip = document.createElement("div");
      chip.className = `packet waiting ${packet.colorClass}`;
      chip.textContent = `${packet.id}`;
      track.appendChild(chip);
    });

    if (!state.queues[profile.key].length) {
      const empty = document.createElement("span");
      empty.className = "queue-label";
      empty.textContent = "No packets waiting";
      track.appendChild(empty);
    }

    row.appendChild(label);
    row.appendChild(track);
    queueList.appendChild(row);
  });
}

function getAverageWait() {
  if (!state.sent.length) return 0;
  const totalWait = state.sent.reduce((sum, packet) => sum + packet.waitTime, 0);
  return totalWait / state.sent.length;
}

function getFairnessLabel() {
  const counts = queueOrder.map((key) => state.sent.filter((packet) => packet.type === key).length);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  if (max === 0) return "Balanced";
  if (max - min >= 4) return "Biased";
  if (max - min >= 2) return "Skewed";
  return "Balanced";
}

function runSimulation() {
  if (state.isRunning) {
    stopRun();
    return;
  }

  state.isRunning = true;
  runBtn.textContent = "Pause";
  state.timer = window.setInterval(stepSimulation, Number(speedRange.value));
}

function stopRun() {
  state.isRunning = false;
  runBtn.textContent = "Run";
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

function setupEvents() {
  algorithmSelect.addEventListener("change", () => {
    updateAlgorithmCopy();
    render();
  });

  speedRange.addEventListener("input", () => {
    speedLabel.textContent = `${speedRange.value} ms / tick`;
    if (state.isRunning) {
      stopRun();
      runSimulation();
    }
  });

  generateBtn.addEventListener("click", generateTraffic);
  stepBtn.addEventListener("click", stepSimulation);
  runBtn.addEventListener("click", runSimulation);
  resetBtn.addEventListener("click", resetSimulation);
}

function setupReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
}

initAlgorithms();
setupEvents();
setupReveals();
resetSimulation();
