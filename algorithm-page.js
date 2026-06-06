const algorithmOrder = ["fifo", "priority", "rr", "wfq", "drr", "edf"];
const algorithm = document.body.dataset.algorithm || "";
const algorithmItem = window.algorithmCatalog?.[algorithm];

function setHtml(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.innerHTML = value;
  }
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function populateAlgorithmPage() {
  if (!algorithmItem) return;

  document.title = `${algorithmItem.pageTitle} | DMMMSU SLUC`;
  setText("algorithmNumber", algorithmItem.number);
  setText("algorithmPageTitle", algorithmItem.pageTitle);
  setText("algorithmSummary", algorithmItem.summary);
  setText("algorithmTitle", algorithmItem.name);
  setText("algorithmDescription", algorithmItem.description);
  setText("algorithmStrength", algorithmItem.strength);
  setText("algorithmDefinition", algorithmItem.description);
  setText("algorithmInformalDefinition", algorithmItem.informalDefinition || "");
  setHtml("algorithmAnalogy", algorithmItem.analogyHtml || "");
  setHtml("algorithmFormula", algorithmItem.shortFormula);
  setText("algorithmPanelTitle", algorithmItem.name);
  setText("algorithmPanelDescription", algorithmItem.description);
  setText("algorithmPanelStrength", algorithmItem.strength);
  setHtml("algorithmPanelFormula", algorithmItem.shortFormula);
  setHtml("formalTheoryCard", algorithmItem.formalHtml + algorithmItem.notationHtml + (algorithmItem.tradeoffHtml || ""));
  setHtml("scheduleTheoryCard", algorithmItem.scheduleHtml);

  const currentIndex = algorithmOrder.indexOf(algorithm);
  const prev = currentIndex > 0 ? algorithmOrder[currentIndex - 1] : "";
  const next = currentIndex < algorithmOrder.length - 1 ? algorithmOrder[currentIndex + 1] : "";

  const prevLink = document.getElementById("prevAlgorithmLink");
  const nextLink = document.getElementById("nextAlgorithmLink");

  if (prevLink) {
    prevLink.href = prev ? `${prev}.html` : "algorithms.html";
    prevLink.textContent = prev ? `Previous: ${window.algorithmCatalog[prev].pageTitle}` : "Back to Algorithms";
  }

  if (nextLink) {
    nextLink.href = next ? `${next}.html` : "quiz.html";
    nextLink.textContent = next ? `Next: ${window.algorithmCatalog[next].pageTitle}` : "Next Section: Quiz";
  }

  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise().catch(() => {});
  }
}

populateAlgorithmPage();
