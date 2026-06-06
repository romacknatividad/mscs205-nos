const quizQuestions = [
  {
    prompt: "A school computer lab has one file server, shared printers, student logins, and folders that many users access from different PCs. What is the Network Operating System mainly doing in this situation?",
    options: [
      { text: "Coordinating shared resources, user identities, and network services across the connected machines", correct: true, explanation: "Correct. In this setting, the NOS manages shared access to files, devices, identities, permissions, and services across the networked environment." },
      { text: "Replacing all Internet routing protocols used outside the school", correct: false, explanation: "Incorrect. Routing protocols are part of wider network communication, but they are not the main role of the NOS in this local shared-service situation." },
      { text: "Making every request instantaneous so no delays can ever occur", correct: false, explanation: "Incorrect. A NOS can organize and schedule access, but it cannot remove all physical and queueing delay." },
      { text: "Assigning one dedicated server to every individual student computer", correct: false, explanation: "Incorrect. A NOS is valuable because it supports sharing, not one-server-per-device isolation." }
    ]
  },
  {
    prompt: "At lunch break, many students upload files to the same campus server at nearly the same time. Why do queues form?",
    options: [
      { text: "Because packets are processed alphabetically by filename", correct: false, explanation: "Incorrect. Queue formation is not based on naming order." },
      { text: "Because requests can arrive faster than the server or link can serve them at that moment", correct: true, explanation: "Correct. When arrivals temporarily exceed service capacity, a backlog forms and packets must wait." },
      { text: "Because authentication always has to fail before service starts", correct: false, explanation: "Incorrect. Authentication may add work, but it is not the basic reason queues form." },
      { text: "Because queues only appear when the scheduler is misconfigured", correct: false, explanation: "Incorrect. Even well-configured systems can form queues during bursts of demand." }
    ]
  },
  {
    prompt: "A printer server has jobs waiting from several teachers. If it follows FIFO / FCFS, which job should be served next?",
    options: [
      { text: "The job with the smallest file size", correct: false, explanation: "Incorrect. FIFO does not check job size before deciding." },
      { text: "The job that arrived earliest among the jobs still waiting", correct: true, explanation: "Correct. FIFO serves work in arrival order." },
      { text: "The job marked as most important by the teacher", correct: false, explanation: "Incorrect. That would require a priority-based scheduler." },
      { text: "The next job from the least recently served queue", correct: false, explanation: "Incorrect. That sounds more like a rotation rule than FIFO." }
    ]
  },
  {
    prompt: "A voice call queue and a normal file-download queue share the same output link. The administrator uses Strict Priority so voice is always served first. What is the main risk?",
    options: [
      { text: "Voice traffic may never be served if file downloads keep arriving", correct: false, explanation: "Incorrect. Strict Priority favors the urgent voice class, not the lower class." },
      { text: "The file-download queue may wait for a very long time if voice traffic stays heavy", correct: true, explanation: "Correct. Low-priority traffic can starve when high-priority arrivals remain continuous." },
      { text: "Both queues will automatically receive equal bandwidth", correct: false, explanation: "Incorrect. Equal sharing is not the goal of Strict Priority." },
      { text: "Urgency can no longer be represented in the scheduler", correct: false, explanation: "Incorrect. Strict Priority is specifically designed to represent urgency." }
    ]
  },
  {
    prompt: "Three departments share a networked application server. The scheduler gives each non-empty department queue one turn before moving to the next. Which algorithm is this most like?",
    options: [
      { text: "Round Robin, because each active queue gets a cyclic turn", correct: true, explanation: "Correct. Round Robin moves around the active queues and gives each one a service opportunity in order." },
      { text: "FIFO, because the oldest packet in the whole system always wins", correct: false, explanation: "Incorrect. FIFO looks at overall arrival order, not queue-by-queue turns." },
      { text: "Strict Priority, because one class always dominates the server", correct: false, explanation: "Incorrect. The scenario describes sharing by turns, not dominance by priority." },
      { text: "EDF, because the closest deadline automatically wins every time", correct: false, explanation: "Incorrect. Deadline-based choice is not described here." }
    ]
  },
  {
    prompt: "A campus network wants video classes to receive more bandwidth than background file sync, but still wants file sync to make progress. Which scheduler best matches that goal?",
    options: [
      { text: "Weighted Fair Queueing, because larger weights give more service share while lower-weight traffic still runs", correct: true, explanation: "Correct. WFQ is designed for differentiated but fair long-run sharing." },
      { text: "FIFO, because all traffic should always be treated identically", correct: false, explanation: "Incorrect. FIFO cannot intentionally favor one class while still controlling fairness." },
      { text: "Strict Priority, because lower classes should never be served", correct: false, explanation: "Incorrect. The goal says file sync should still make progress, which Strict Priority may fail to guarantee." },
      { text: "EDF, because deadlines are the only way to represent bandwidth policy", correct: false, explanation: "Incorrect. Weight-based service is a better fit than deadline scheduling for this policy." }
    ]
  },
  {
    prompt: "A network has mixed packet sizes. One queue often has larger packets, but the administrator still wants fair sharing without the complexity of exact virtual finish times. Why is DRR a good fit?",
    options: [
      { text: "It sorts packets alphabetically, which reduces overhead", correct: false, explanation: "Incorrect. DRR is not based on naming order." },
      { text: "It uses deficit counters and quanta so large packets can be served fairly over multiple rounds", correct: true, explanation: "Correct. DRR keeps service credit, making it practical and fair with variable-size packets." },
      { text: "It rejects any packet that is bigger than one service unit", correct: false, explanation: "Incorrect. DRR is built to support larger packets, not discard them for size alone." },
      { text: "It assigns every packet a strict deadline before entry", correct: false, explanation: "Incorrect. That describes deadline-oriented logic, not DRR's credit-based mechanism." }
    ]
  },
  {
    prompt: "An industrial monitoring network carries control packets that become useless if they arrive late. Which scheduling rule best fits that requirement?",
    options: [
      { text: "Serve the packet whose deadline is closest", correct: true, explanation: "Correct. EDF is designed for workloads where timeliness relative to a deadline matters most." },
      { text: "Serve the packet from the smallest queue", correct: false, explanation: "Incorrect. Queue size is not EDF's decision rule." },
      { text: "Serve the packet from the class with the largest configured weight", correct: false, explanation: "Incorrect. That describes a weight-based policy such as WFQ, not EDF." },
      { text: "Serve the oldest user account first", correct: false, explanation: "Incorrect. EDF is about packet deadlines, not account age." }
    ]
  },
  {
    prompt: "Hard question: In the simulator, one packet has size 4 while another has size 1. What should a student infer from that difference?",
    options: [
      { text: "The larger packet needs more service time on the link before it can finish transmission", correct: true, explanation: "Correct. In the simulator, size represents service demand, so a larger packet occupies the resource for more ticks." },
      { text: "The larger packet automatically has higher priority and must go first", correct: false, explanation: "Incorrect. Packet size affects service demand, not automatic priority." },
      { text: "The smaller packet must always be dropped when congestion appears", correct: false, explanation: "Incorrect. Packet size alone does not imply drop behavior in this simulator." },
      { text: "The larger packet belongs to more than one queue at the same time", correct: false, explanation: "Incorrect. A packet belongs to one traffic class queue, regardless of size." }
    ]
  },
  {
    prompt: "Hard question: A queue's head-of-line delay keeps increasing even though packets are arriving to other queues too. What does that metric specifically tell you?",
    options: [
      { text: "It measures how long the newest packet in the system has been traveling", correct: false, explanation: "Incorrect. Head-of-line delay is not about the newest packet or total travel time." },
      { text: "It shows how long the front packet of that queue has been waiting without being served", correct: true, explanation: "Correct. Head-of-line delay focuses on the packet currently blocking the front of a queue." },
      { text: "It counts how many algorithms are available in the simulator menu", correct: false, explanation: "Incorrect. This metric is about queue waiting, not interface options." },
      { text: "It tells you how long the traffic scenario took to generate", correct: false, explanation: "Incorrect. Scenario generation time is unrelated to head-of-line delay." }
    ]
  }
];

const quizState = {
  attempt: 1,
  currentIndex: 0,
  selections: Array(quizQuestions.length).fill(null)
};

const quizNav = document.getElementById("quizNav");
const quizStage = document.getElementById("quizStage");
const answeredCount = document.getElementById("answeredCount");
const scoreCount = document.getElementById("scoreCount");
const attemptCount = document.getElementById("attemptCount");
const quizResult = document.getElementById("quizResult");
const submitQuizBtn = document.getElementById("submitQuizBtn");
const retryQuizBtn = document.getElementById("retryQuizBtn");
const prevQuestionBtn = document.getElementById("prevQuestionBtn");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

function currentScore() {
  return quizQuestions.reduce((total, question, index) => {
    const selectedIndex = quizState.selections[index];
    if (selectedIndex === null) return total;
    return total + (question.options[selectedIndex].correct ? 1 : 0);
  }, 0);
}

function answeredTotal() {
  return quizState.selections.filter((value) => value !== null).length;
}

function updateSummary() {
  answeredCount.textContent = `${answeredTotal()} / ${quizQuestions.length}`;
  scoreCount.textContent = `${currentScore()} / ${quizQuestions.length}`;
  attemptCount.textContent = String(quizState.attempt);
}

function renderNav() {
  quizNav.innerHTML = quizQuestions.map((_, index) => {
    const selectedIndex = quizState.selections[index];
    const selectedOption = selectedIndex === null ? null : quizQuestions[index].options[selectedIndex];
    const stateClass = selectedIndex === null
      ? ""
      : selectedOption.correct ? "correct" : "incorrect";

    return `
      <button
        type="button"
        class="quiz-nav-item ${index === quizState.currentIndex ? "active" : ""} ${stateClass}"
        data-question-nav="${index}"
        aria-current="${index === quizState.currentIndex ? "true" : "false"}"
      >
        ${index + 1}
      </button>
    `;
  }).join("");
}

function renderStage() {
  const question = quizQuestions[quizState.currentIndex];
  const selectedIndex = quizState.selections[quizState.currentIndex];
  const selectedOption = selectedIndex === null ? null : question.options[selectedIndex];

  const optionsMarkup = question.options.map((option, optionIndex) => {
    const isSelected = selectedIndex === optionIndex;
    const stateClass = isSelected
      ? option.correct ? "correct" : "incorrect"
      : "";

    return `
      <button
        type="button"
        class="quiz-option ${stateClass}"
        data-question-index="${quizState.currentIndex}"
        data-option-index="${optionIndex}"
        aria-pressed="${isSelected ? "true" : "false"}"
      >
        <span class="quiz-option-letter">${String.fromCharCode(65 + optionIndex)}</span>
        <span>${option.text}</span>
      </button>
    `;
  }).join("");

  let feedbackTitle = "Answer Insight";
  let feedbackClass = "neutral";
  let feedbackBody = "Pick one option to reveal why that choice is correct or incorrect for this item.";

  if (selectedOption) {
    feedbackTitle = selectedOption.correct ? "Correct Choice" : "Why This Choice Is Incorrect";
    feedbackClass = selectedOption.correct ? "correct" : "incorrect";
    feedbackBody = selectedOption.explanation;
  }

  quizStage.innerHTML = `
    <article class="quiz-card reveal visible">
      <div class="quiz-stage-layout">
        <div class="quiz-question-panel">
          <div class="quiz-question-number">Question ${quizState.currentIndex + 1} of ${quizQuestions.length}</div>
          <h3>${question.prompt}</h3>
          <div class="quiz-options">${optionsMarkup}</div>
        </div>
        <aside class="quiz-feedback-panel">
          <div class="quiz-feedback ${feedbackClass}">
            <strong>${feedbackTitle}</strong>
            <span>${feedbackBody}</span>
          </div>
          <div class="quiz-feedback quiz-feedback-summary">
            <strong>Progress on this attempt</strong>
            <span>You have answered ${answeredTotal()} of ${quizQuestions.length} questions and currently have ${currentScore()} correct.</span>
          </div>
        </aside>
      </div>
    </article>
  `;

  prevQuestionBtn.disabled = quizState.currentIndex === 0;
  nextQuestionBtn.disabled = quizState.currentIndex === quizQuestions.length - 1;
}

function renderQuiz() {
  renderNav();
  renderStage();
  updateSummary();
}

function chooseOption(questionIndex, optionIndex) {
  quizState.selections[questionIndex] = optionIndex;
  renderQuiz();
}

function goToQuestion(index) {
  quizState.currentIndex = Math.max(0, Math.min(index, quizQuestions.length - 1));
  renderQuiz();
}

function submitQuiz() {
  const answered = answeredTotal();
  const score = currentScore();

  if (answered < quizQuestions.length) {
    quizResult.className = "quiz-result warning reveal visible";
    quizResult.innerHTML = `You have answered <strong>${answered}</strong> of <strong>${quizQuestions.length}</strong> questions. Use the numbered navigation to finish the remaining items.`;
    return;
  }

  const percentage = Math.round((score / quizQuestions.length) * 100);
  let message = `You scored <strong>${score} / ${quizQuestions.length}</strong> (${percentage}%). `;

  if (score === quizQuestions.length) {
    message += "You have a strong grasp of NOS fundamentals, queueing, and scheduling behavior.";
  } else if (score >= 8) {
    message += "Your understanding is solid. Review the numbered items marked incorrect to tighten the weaker concepts.";
  } else if (score >= 6) {
    message += "You understand the basics, but some algorithm distinctions still need reinforcement.";
  } else {
    message += "Use the per-question explanation panel on the right, then retry the quiz for another attempt.";
  }

  quizResult.className = "quiz-result reveal visible";
  quizResult.innerHTML = message;
}

function retryQuiz() {
  quizState.attempt += 1;
  quizState.currentIndex = 0;
  quizState.selections = Array(quizQuestions.length).fill(null);
  quizResult.className = "quiz-result reveal visible";
  quizResult.innerHTML = `Attempt <strong>${quizState.attempt}</strong> started. Move through the numbered items one at a time and use the right-hand panel to read the explanation for each selected answer.`;
  renderQuiz();
}

function setupQuizEvents() {
  quizStage.addEventListener("click", (event) => {
    const button = event.target.closest(".quiz-option");
    if (!button) return;

    const questionIndex = Number(button.dataset.questionIndex);
    const optionIndex = Number(button.dataset.optionIndex);
    chooseOption(questionIndex, optionIndex);
  });

  quizNav.addEventListener("click", (event) => {
    const button = event.target.closest(".quiz-nav-item");
    if (!button) return;
    goToQuestion(Number(button.dataset.questionNav));
  });

  prevQuestionBtn.addEventListener("click", () => goToQuestion(quizState.currentIndex - 1));
  nextQuestionBtn.addEventListener("click", () => goToQuestion(quizState.currentIndex + 1));
  submitQuizBtn.addEventListener("click", submitQuiz);
  retryQuizBtn.addEventListener("click", retryQuiz);
}

setupQuizEvents();
renderQuiz();
