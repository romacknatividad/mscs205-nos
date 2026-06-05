const algorithmDefinitions = {
  fifo: {
    name: "FIFO / FCFS",
    shortFormula: "\\[p^*(t) = \\arg\\min_{p \\in Q(t)} a_p\\]",
    description: "First In, First Out serves packets in order of arrival time. It is easy to implement but does not protect latency-sensitive traffic.",
    strength: "Best when implementation simplicity is more important than differentiated service."
  },
  priority: {
    name: "Strict Priority Queueing",
    shortFormula: "\\[p^*(t) = \\arg\\max_{p \\in Q(t)} (\\pi_p, -a_p)\\]",
    description: "Strict Priority always serves the highest-priority eligible class first. This sharply reduces delay for critical flows while risking starvation for low-priority traffic.",
    strength: "Best when mission-critical or real-time traffic must dominate service decisions."
  },
  rr: {
    name: "Round Robin",
    shortFormula: "\\[i_{k+1} = (i_k + 1) \\bmod N\\]",
    description: "Round Robin visits non-empty queues cyclically. It is more equitable than strict priority, but equal turns do not mean equal bandwidth when packet sizes differ.",
    strength: "Best when bounded unfairness is more important than strict optimization for one class."
  },
  wfq: {
    name: "Weighted Fair Queueing",
    shortFormula: "\\[F_i^k = \\max(F_i^{k-1}, V(a_i^k)) + \\frac{L_i^k}{w_i}\\]",
    description: "WFQ approximates generalized processor sharing by assigning virtual finish times. Higher-weight classes receive more long-run service without excluding lower-weight classes.",
    strength: "Best when differentiated quality of service and fairness must both be maintained."
  },
  drr: {
    name: "Deficit Round Robin",
    shortFormula: "\\[D_i \\leftarrow D_i + Q_i\\]",
    description: "DRR extends Round Robin using deficit counters and per-class quantum values. A queue can send packets while its deficit covers packet size, which handles variable-size packets efficiently.",
    strength: "Best when you want scalable fairness with variable packet sizes and low scheduler overhead."
  },
  edf: {
    name: "Earliest Deadline First",
    shortFormula: "\\[p^*(t) = \\arg\\min_{p \\in Q(t)} d_p\\]",
    description: "EDF selects the eligible packet with the nearest deadline. It is effective when traffic has explicit timing constraints rather than only class priorities.",
    strength: "Best when deadlines are meaningful and lateness is the key performance metric."
  }
};

const trafficProfiles = [
  { key: "voice", label: "Voice", colorClass: "voice", priority: 3, sizeRange: [1, 2], weight: 4, quantum: 3, deadlineSlack: 4 },
  { key: "video", label: "Video", colorClass: "video", priority: 2, sizeRange: [2, 4], weight: 2, quantum: 4, deadlineSlack: 7 },
  { key: "data", label: "Data", colorClass: "data", priority: 1, sizeRange: [3, 5], weight: 1, quantum: 5, deadlineSlack: 10 }
];

const scenarioDefinitions = {
  balanced: {
    name: "Balanced Campus Traffic",
    arrivals: {
      voice: [0, 1, 2, 4, 7, 9],
      video: [0, 2, 3, 5, 7, 10],
      data: [1, 2, 4, 6, 8, 9, 11]
    }
  },
  bursty: {
    name: "Bursty Access Switch",
    arrivals: {
      voice: [0, 0, 1, 2, 4],
      video: [0, 1, 1, 2, 3, 4, 6],
      data: [0, 0, 1, 1, 2, 2, 3, 4, 5]
    }
  },
  realtime: {
    name: "Realtime Priority Mix",
    arrivals: {
      voice: [0, 1, 2, 3, 5, 7, 8, 10],
      video: [1, 3, 4, 7, 10],
      data: [0, 2, 4, 5, 6, 8, 9, 11]
    }
  }
};

const state = {
  futurePackets: [],
  queues: { voice: [], video: [], data: [] },
  tick: 0,
  sent: [],
  busyTicks: 0,
  timer: null,
  isRunning: false,
  currentService: null,
  rrPointer: 0,
  drrPointer: 0,
  deficits: { voice: 0, video: 0, data: 0 },
  flowFinishTags: { voice: 0, video: 0, data: 0 },
  dispatchLog: [],
  arrivedCount: 0,
  totalGenerated: 0
};

const queueOrder = ["voice", "video", "data"];

const algorithmSelect = document.getElementById("algorithmSelect");
const scenarioSelect = document.getElementById("scenarioSelect");
const speedRange = document.getElementById("speedRange");
const speedLabel = document.getElementById("speedLabel");
const generateBtn = document.getElementById("generateBtn");
const stepBtn = document.getElementById("stepBtn");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const queueList = document.getElementById("queueList");
const arrivalTimeline = document.getElementById("arrivalTimeline");
const activePacket = document.getElementById("activePacket");
const sentCount = document.getElementById("sentCount");
const avgWait = document.getElementById("avgWait");
const fairnessLabel = document.getElementById("fairnessLabel");
const algorithmTitle = document.getElementById("algorithmTitle");
const algorithmDescription = document.getElementById("algorithmDescription");
const algorithmStrength = document.getElementById("algorithmStrength");
const algorithmFormula = document.getElementById("algorithmFormula");
const simulationInsight = document.getElementById("simulationInsight");
const tickCount = document.getElementById("tickCount");
const arrivedCount = document.getElementById("arrivedCount");
const queuedCount = document.getElementById("queuedCount");
const utilizationLabel = document.getElementById("utilizationLabel");
const futureCount = document.getElementById("futureCount");
const serviceProgressBar = document.getElementById("serviceProgressBar");
const serviceLabel = document.getElementById("serviceLabel");
const holDelay = document.getElementById("holDelay");
const dispatchLog = document.getElementById("dispatchLog");
const dispatchCount = document.getElementById("dispatchCount");

function infoTipMarkup(label, description, position = "") {
  const positionClass = position ? ` ${position}` : "";
  return `<span class="info-tip info-tip-inline${positionClass}"><button class="info-trigger" type="button" aria-label="${label}">i</button><span class="info-bubble">${description}</span></span>`;
}

function initAlgorithms() {
  Object.entries(algorithmDefinitions).forEach(([value, item]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = item.name;
    algorithmSelect.appendChild(option);
  });
  algorithmSelect.value = "wfq";
}

function initScenarios() {
  Object.entries(scenarioDefinitions).forEach(([value, item]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = item.name;
    scenarioSelect.appendChild(option);
  });
  scenarioSelect.value = "balanced";
}

function resetState() {
  state.futurePackets = [];
  state.queues = { voice: [], video: [], data: [] };
  state.tick = 0;
  state.sent = [];
  state.busyTicks = 0;
  state.currentService = null;
  state.rrPointer = 0;
  state.drrPointer = 0;
  state.deficits = { voice: 0, video: 0, data: 0 };
  state.flowFinishTags = { voice: 0, video: 0, data: 0 };
  state.dispatchLog = [];
  state.arrivedCount = 0;
  state.totalGenerated = 0;
}

function stopRun() {
  state.isRunning = false;
  runBtn.textContent = "Run";
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

function resetSimulation() {
  stopRun();
  resetState();
  updateAlgorithmCopy();
  updateInsight("Generate traffic to compare how different algorithms treat staged arrivals and variable packet sizes.");
  render();
}

function profileByKey(key) {
  return trafficProfiles.find((profile) => profile.key === key);
}

function getAlgorithm() {
  return algorithmSelect.value;
}

function createPacket(profile, index, arrivalTick) {
  const [minSize, maxSize] = profile.sizeRange;
  const span = maxSize - minSize + 1;
  const size = minSize + ((index + arrivalTick) % span);
  const deadline = arrivalTick + profile.deadlineSlack + size;
  const packet = {
    id: `${profile.label[0]}${index}`,
    type: profile.key,
    label: profile.label,
    colorClass: profile.colorClass,
    priority: profile.priority,
    size,
    weight: profile.weight,
    quantum: profile.quantum,
    arrivalTick,
    deadline
  };

  const previousFinish = state.flowFinishTags[profile.key];
  const virtualStart = Math.max(previousFinish, arrivalTick);
  packet.finishTag = virtualStart + packet.size / packet.weight;
  state.flowFinishTags[profile.key] = packet.finishTag;
  return packet;
}

function generateTraffic() {
  stopRun();
  resetState();

  const scenario = scenarioDefinitions[scenarioSelect.value];
  let counter = 1;

  trafficProfiles.forEach((profile) => {
    const arrivals = scenario.arrivals[profile.key] || [];
    arrivals.forEach((arrivalTick) => {
      state.futurePackets.push(createPacket(profile, counter, arrivalTick));
      counter += 1;
    });
  });

  state.futurePackets.sort((a, b) => a.arrivalTick - b.arrivalTick || b.priority - a.priority);
  state.totalGenerated = state.futurePackets.length;
  releaseArrivalsAtCurrentTick();
  updateInsight(`${scenario.name} loaded. Packets now arrive over time, so the scheduler must react to both urgency and backlog.`);
  render();
}

function releaseArrivalsAtCurrentTick() {
  const ready = state.futurePackets.filter((packet) => packet.arrivalTick <= state.tick);
  state.futurePackets = state.futurePackets.filter((packet) => packet.arrivalTick > state.tick);

  ready.forEach((packet) => {
    state.queues[packet.type].push(packet);
    state.arrivedCount += 1;
    state.dispatchLog.unshift({
      event: "arrival",
      packet,
      tick: state.tick,
      text: `${packet.label} ${packet.id} arrived with size ${packet.size} and deadline ${packet.deadline}.`
    });
  });

  state.dispatchLog = state.dispatchLog.slice(0, 10);
}

function removePacket(target) {
  const queue = state.queues[target.type];
  const index = queue.findIndex((packet) => packet.id === target.id);
  if (index >= 0) {
    return queue.splice(index, 1)[0];
  }
  return null;
}

function allQueuedPackets() {
  return queueOrder.flatMap((queueKey) => state.queues[queueKey]);
}

function selectNextPacket() {
  const algorithm = getAlgorithm();
  const candidates = allQueuedPackets();
  if (!candidates.length) return null;

  if (algorithm === "fifo") {
    const selected = candidates.slice().sort((a, b) => a.arrivalTick - b.arrivalTick || b.priority - a.priority)[0];
    return removePacket(selected);
  }

  if (algorithm === "priority") {
    const selected = candidates.slice().sort((a, b) => b.priority - a.priority || a.arrivalTick - b.arrivalTick)[0];
    return removePacket(selected);
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
    const selected = candidates.slice().sort((a, b) => a.finishTag - b.finishTag || a.arrivalTick - b.arrivalTick)[0];
    return removePacket(selected);
  }

  if (algorithm === "drr") {
    for (let rounds = 0; rounds < queueOrder.length * 2; rounds += 1) {
      const key = queueOrder[state.drrPointer];
      const queue = state.queues[key];
      if (queue.length) {
        state.deficits[key] += profileByKey(key).quantum;
        if (queue[0].size <= state.deficits[key]) {
          state.deficits[key] -= queue[0].size;
          const packet = queue.shift();
          state.drrPointer = (state.drrPointer + 1) % queueOrder.length;
          return packet;
        }
      }
      state.drrPointer = (state.drrPointer + 1) % queueOrder.length;
    }
    return null;
  }

  const selected = candidates.slice().sort((a, b) => a.deadline - b.deadline || a.arrivalTick - b.arrivalTick)[0];
  return removePacket(selected);
}

function beginService(packet) {
  state.currentService = {
    ...packet,
    remainingService: packet.size,
    totalService: packet.size,
    serviceStartTick: state.tick
  };
  updateInsight(buildSelectionInsight(packet));
}

function advanceService() {
  if (!state.currentService) return;

  state.busyTicks += 1;
  state.currentService.remainingService -= 1;

  if (state.currentService.remainingService <= 0) {
    const completed = state.currentService;
    const waitTime = completed.serviceStartTick - completed.arrivalTick;
    const turnaround = state.tick - completed.arrivalTick;
    state.sent.push({ ...completed, waitTime, turnaround });
    state.dispatchLog.unshift({
      event: "dispatch",
      packet: completed,
      tick: state.tick,
      text: `${completed.label} ${completed.id} completed after waiting ${waitTime} ticks and using ${completed.totalService} service quanta.`
    });
    state.dispatchLog = state.dispatchLog.slice(0, 10);
    updateInsight(buildCompletionInsight(completed, waitTime, turnaround));
    state.currentService = null;
  }
}

function totalQueuedPackets() {
  return queueOrder.reduce((sum, key) => sum + state.queues[key].length, 0);
}

function stepSimulation() {
  if (!state.totalGenerated && !totalQueuedPackets()) {
    updateInsight("No scenario is loaded. Generate traffic first so the scheduler has arrivals to process.");
    render();
    return;
  }

  state.tick += 1;
  releaseArrivalsAtCurrentTick();

  if (!state.currentService) {
    const packet = selectNextPacket();
    if (packet) beginService(packet);
  }

  advanceService();

  if (!state.currentService && !state.futurePackets.length && !totalQueuedPackets()) {
    stopRun();
    updateInsight("The scenario is complete. All packets have arrived and been transmitted.");
  }

  render();
}

function buildSelectionInsight(packet) {
  const algorithm = getAlgorithm();
  if (algorithm === "fifo") {
    return `${packet.label} ${packet.id} entered service because it has the earliest arrival time among all queued packets.`;
  }
  if (algorithm === "priority") {
    return `${packet.label} ${packet.id} entered service because its class priority outranks the others currently waiting.`;
  }
  if (algorithm === "rr") {
    return `${packet.label} ${packet.id} entered service on its queue's turn in the cyclic rotation.`;
  }
  if (algorithm === "wfq") {
    return `${packet.label} ${packet.id} entered service because it has the smallest virtual finish tag ${packet.finishTag.toFixed(2)} among eligible packets.`;
  }
  if (algorithm === "drr") {
    return `${packet.label} ${packet.id} entered service after its queue accumulated enough deficit credit to cover size ${packet.size}.`;
  }
  return `${packet.label} ${packet.id} entered service because it has the nearest deadline at tick ${packet.deadline}.`;
}

function buildCompletionInsight(packet, waitTime, turnaround) {
  const slack = packet.deadline - state.tick;
  if (getAlgorithm() === "edf") {
    return `${packet.label} ${packet.id} finished at tick ${state.tick}. Deadline slack is ${slack} and total turnaround is ${turnaround} ticks.`;
  }
  return `${packet.label} ${packet.id} finished at tick ${state.tick} after waiting ${waitTime} ticks. Turnaround was ${turnaround} ticks.`;
}

function updateAlgorithmCopy() {
  const item = algorithmDefinitions[getAlgorithm()];
  algorithmTitle.textContent = item.name;
  algorithmDescription.textContent = item.description;
  algorithmStrength.textContent = item.strength;
  algorithmFormula.innerHTML = item.shortFormula;
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise([algorithmFormula]).catch(() => {});
  }
}

function updateInsight(text) {
  simulationInsight.textContent = text;
}

function renderQueues() {
  queueList.innerHTML = "";
  trafficProfiles.forEach((profile) => {
    const row = document.createElement("div");
    row.className = "queue-row";

    const label = document.createElement("div");
    const deficitText = getAlgorithm() === "drr" ? ` | Deficit ${state.deficits[profile.key]}` : "";
    label.innerHTML = `
      <div class="queue-heading">
        <strong>${profile.label}</strong>
        ${infoTipMarkup(
          `Explain ${profile.label} queue`,
          `${profile.label} traffic uses priority ${profile.priority}, weight ${profile.weight}, and quantum ${profile.quantum}. In DRR, deficit is the saved service credit for this queue.`,
          "info-tip-right"
        )}
      </div>
      <span class="queue-label">Priority ${profile.priority} | Weight ${profile.weight} | Quantum ${profile.quantum}${deficitText}</span>
    `;

    const track = document.createElement("div");
    track.className = "queue-track";

    state.queues[profile.key].forEach((packet) => {
      const chip = document.createElement("div");
      chip.className = `packet waiting ${packet.colorClass}`;
      chip.innerHTML = `
        <span class="packet-label">
          <span>${packet.id} | ${packet.size}</span>
          ${infoTipMarkup(
            `Explain packet ${packet.id}`,
            `${packet.label} packet ${packet.id} arrived at tick ${packet.arrivalTick}, has size ${packet.size}, and deadline ${packet.deadline}. In the simulator, size controls how many service ticks it needs.`,
            "info-tip-right"
          )}
        </span>
      `;
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

function renderArrivalTimeline() {
  arrivalTimeline.innerHTML = "";
  futureCount.textContent = `${state.futurePackets.length} pending`;

  const preview = state.futurePackets.slice(0, 8);
  if (!preview.length) {
    const empty = document.createElement("div");
    empty.className = "arrival-item";
    empty.innerHTML = "<strong>No future arrivals</strong><span class='queue-label'>All generated packets have already entered the system.</span>";
    arrivalTimeline.appendChild(empty);
    return;
  }

  preview.forEach((packet) => {
    const item = document.createElement("div");
    item.className = "arrival-item";
    item.innerHTML = `
      <strong>${packet.label} ${packet.id} ${infoTipMarkup(
        `Explain future packet ${packet.id}`,
        `${packet.label} packet ${packet.id} has not arrived yet. It is scheduled to enter the queue at tick ${packet.arrivalTick}.`,
        "info-tip-right"
      )}</strong>
      <span class="queue-label">tick ${packet.arrivalTick} | size ${packet.size} | deadline ${packet.deadline}</span>
    `;
    arrivalTimeline.appendChild(item);
  });
}

function renderDispatchLog() {
  dispatchLog.innerHTML = "";
  dispatchCount.textContent = `${state.dispatchLog.length} events`;

  if (!state.dispatchLog.length) {
    const empty = document.createElement("div");
    empty.className = "dispatch-item";
    empty.innerHTML = "<strong>No events yet</strong><span class='queue-label'>Arrivals and completions will appear here as the simulation runs.</span>";
    dispatchLog.appendChild(empty);
    return;
  }

  state.dispatchLog.slice(0, 6).forEach((entry) => {
    const item = document.createElement("div");
    item.className = "dispatch-item";
    item.innerHTML = `
      <div class="log-meta">
        <strong>${entry.packet.label} ${entry.packet.id} ${infoTipMarkup(
          `Explain log entry for ${entry.packet.id}`,
          `This log entry describes what happened to ${entry.packet.label} packet ${entry.packet.id} at tick ${entry.tick}.`,
          "info-tip-right"
        )}</strong>
        <span>tick ${entry.tick}</span>
      </div>
      <span class="queue-label">${entry.text}</span>
    `;
    dispatchLog.appendChild(item);
  });
}

function renderServiceState() {
  if (!state.currentService) {
    activePacket.textContent = "Idle";
    activePacket.className = "channel-packet idle";
    serviceProgressBar.style.width = "0%";
    serviceLabel.textContent = "No packet in service";
    return;
  }

  const packet = state.currentService;
  const completion = ((packet.totalService - packet.remainingService) / packet.totalService) * 100;
  activePacket.innerHTML = `
    <span class="packet-label">
      <span>${packet.label} ${packet.id}</span>
      ${infoTipMarkup(
        `Explain active packet ${packet.id}`,
        `${packet.label} packet ${packet.id} is currently being transmitted. It began service at tick ${packet.serviceStartTick}, needs ${packet.totalService} ticks total, and still has ${packet.remainingService} ticks remaining.`,
        "info-tip-right"
      )}
    </span>
  `;
  activePacket.className = `channel-packet ${packet.colorClass}`;
  serviceProgressBar.style.width = `${completion}%`;
  serviceLabel.textContent = `size ${packet.totalService} | remaining ${packet.remainingService} | deadline ${packet.deadline}`;
}

function getAverageWait() {
  if (!state.sent.length) return 0;
  const totalWait = state.sent.reduce((sum, packet) => sum + packet.waitTime, 0);
  return totalWait / state.sent.length;
}

function getHeadOfLineDelay() {
  const headPackets = queueOrder.map((key) => state.queues[key][0]).filter(Boolean);
  if (!headPackets.length) return 0;
  return Math.max(...headPackets.map((packet) => Math.max(0, state.tick - packet.arrivalTick)));
}

function getFairnessLabel() {
  const counts = queueOrder.map((key) => state.sent.filter((packet) => packet.type === key).length);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  if (max === 0) return "Balanced";
  if (max - min >= 5) return "Highly Skewed";
  if (max - min >= 3) return "Skewed";
  return "Balanced";
}

function renderMetrics() {
  tickCount.textContent = String(state.tick);
  arrivedCount.textContent = String(state.arrivedCount);
  queuedCount.textContent = String(totalQueuedPackets());
  sentCount.textContent = String(state.sent.length);
  avgWait.textContent = `${getAverageWait().toFixed(1)} ticks`;
  fairnessLabel.textContent = getFairnessLabel();
  holDelay.textContent = `${getHeadOfLineDelay()} ticks`;
  utilizationLabel.textContent = state.tick ? `${Math.round((state.busyTicks / state.tick) * 100)}%` : "0%";
}

function render() {
  updateAlgorithmCopy();
  renderQueues();
  renderArrivalTimeline();
  renderDispatchLog();
  renderServiceState();
  renderMetrics();
  if (typeof setupInfoTips === "function") {
    setupInfoTips();
  }
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

function setupEvents() {
  algorithmSelect.addEventListener("change", () => {
    updateAlgorithmCopy();
    render();
  });

  scenarioSelect.addEventListener("change", () => {
    updateInsight(`${scenarioDefinitions[scenarioSelect.value].name} is selected. Generate traffic to load this scenario into the simulator.`);
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
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
}

initAlgorithms();
initScenarios();
setupEvents();
setupReveals();
resetSimulation();
