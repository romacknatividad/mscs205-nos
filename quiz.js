const quizQuestions = [
  {
    prompt: "What is the main role of a Network Operating System?",
    options: [
      { text: "To coordinate shared network resources, identities, and services across connected machines", correct: true, explanation: "Correct. A NOS manages access to shared files, devices, identities, and services across a networked environment." },
      { text: "To replace all routing protocols used by the Internet", correct: false, explanation: "Incorrect. A NOS may work with routing or network services, but it does not replace Internet routing protocols." },
      { text: "To eliminate all delays by sending packets instantly", correct: false, explanation: "Incorrect. A NOS can manage contention, but it cannot remove physical and queueing delays." },
      { text: "To ensure every device has its own dedicated server", correct: false, explanation: "Incorrect. NOS design is built around sharing resources, not dedicating one server per device." }
    ]
  },
  {
    prompt: "Why do queues form in a networked system?",
    options: [
      { text: "Because packets always travel in alphabetical order", correct: false, explanation: "Incorrect. Packet names do not determine queue formation." },
      { text: "Because demand can temporarily exceed the service capacity of a link or server", correct: true, explanation: "Correct. Queues appear whenever arrivals come faster than the system can serve them at that moment." },
      { text: "Because authentication always fails first", correct: false, explanation: "Incorrect. Authentication is a control step, not the root cause of queue buildup." },
      { text: "Because scheduling algorithms require empty buffers", correct: false, explanation: "Incorrect. Scheduling algorithms exist because queues are not empty." }
    ]
  },
  {
    prompt: "What is the defining behavior of FIFO / FCFS scheduling?",
    options: [
      { text: "It always chooses the smallest packet size first", correct: false, explanation: "Incorrect. That would be a size-based policy, not FIFO." },
      { text: "It chooses the earliest-arriving packet among those waiting", correct: true, explanation: "Correct. FIFO serves packets in arrival order." },
      { text: "It serves the highest-priority class before others", correct: false, explanation: "Incorrect. That describes strict priority queueing." },
      { text: "It rotates evenly through queues regardless of arrival time", correct: false, explanation: "Incorrect. That describes round robin style behavior." }
    ]
  },
  {
    prompt: "What is the main risk of Strict Priority Queueing?",
    options: [
      { text: "High-priority traffic may starve while low-priority traffic dominates", correct: false, explanation: "Incorrect. Strict priority favors high-priority traffic, not low-priority traffic." },
      { text: "Low-priority traffic may wait indefinitely if urgent traffic keeps arriving", correct: true, explanation: "Correct. Strict priority can starve lower classes when higher-priority demand is sustained." },
      { text: "Every class always receives identical bandwidth", correct: false, explanation: "Incorrect. Strict priority is not designed for equal sharing." },
      { text: "It cannot represent urgency at all", correct: false, explanation: "Incorrect. Urgency is exactly what strict priority emphasizes." }
    ]
  },
  {
    prompt: "What fairness idea does Round Robin try to enforce?",
    options: [
      { text: "Each non-empty queue gets a turn in cyclic order", correct: true, explanation: "Correct. Round Robin cycles through queues so each one gets a service opportunity." },
      { text: "Every packet must finish before another may start", correct: false, explanation: "Incorrect. That would serialize everything and is not the RR rule." },
      { text: "Only the largest queue receives service first", correct: false, explanation: "Incorrect. RR does not rank queues by backlog size." },
      { text: "Deadlines always override queue rotation", correct: false, explanation: "Incorrect. Deadline-based service is EDF, not RR." }
    ]
  },
  {
    prompt: "Why is Weighted Fair Queueing useful?",
    options: [
      { text: "It gives more long-run service share to classes with larger weights while still serving others", correct: true, explanation: "Correct. WFQ uses weights to differentiate service while preserving fairness." },
      { text: "It ignores packet size so implementation becomes less fair", correct: false, explanation: "Incorrect. WFQ specifically accounts for packet size through finish tags." },
      { text: "It always behaves exactly like strict priority", correct: false, explanation: "Incorrect. WFQ is a fairness-oriented weighted scheduler, not a strict urgency-only rule." },
      { text: "It removes the need for queues entirely", correct: false, explanation: "Incorrect. WFQ is a queue scheduling method, not a replacement for queues." }
    ]
  },
  {
    prompt: "What extra mechanism makes Deficit Round Robin practical for variable packet sizes?",
    options: [
      { text: "A fixed alphabetical packet ordering", correct: false, explanation: "Incorrect. Alphabetical ordering is unrelated to DRR." },
      { text: "A deficit counter and per-queue quantum that carry service credit across rounds", correct: true, explanation: "Correct. DRR uses saved credit so larger packets eventually become eligible without losing fairness." },
      { text: "A rule that drops every packet larger than one unit", correct: false, explanation: "Incorrect. DRR is meant to handle different sizes, not reject them." },
      { text: "A deadline table for every arriving packet", correct: false, explanation: "Incorrect. Deadline tables belong to EDF-style reasoning, not DRR's credit model." }
    ]
  },
  {
    prompt: "What does Earliest Deadline First optimize around?",
    options: [
      { text: "The oldest user account in the system", correct: false, explanation: "Incorrect. EDF works with packet deadlines, not account age." },
      { text: "The packet whose deadline is closest in time", correct: true, explanation: "Correct. EDF selects the waiting packet with the nearest deadline." },
      { text: "The queue with the smallest number of packets", correct: false, explanation: "Incorrect. Queue length is not the defining EDF rule." },
      { text: "The class with the largest configured weight", correct: false, explanation: "Incorrect. Weight-based service belongs to WFQ, not EDF." }
    ]
  },
  {
    prompt: "In the simulator, what does packet size represent?",
    options: [
      { text: "How many users created the packet", correct: false, explanation: "Incorrect. Packet size reflects service demand, not the number of users." },
      { text: "How many ticks of service the packet needs before completion", correct: true, explanation: "Correct. Larger packets occupy the link for more service ticks in the simulation." },
      { text: "How strongly the packet is encrypted", correct: false, explanation: "Incorrect. Encryption level is not modeled in the simulator." },
      { text: "How many queues the packet can enter at once", correct: false, explanation: "Incorrect. Each packet belongs to one traffic class queue at a time." }
    ]
  },
  {
    prompt: "What does head-of-line delay measure?",
    options: [
      { text: "The travel time of the newest packet in the system", correct: false, explanation: "Incorrect. Head-of-line delay focuses on the oldest packet at the front of a queue." },
      { text: "The number of algorithms available in the scheduler menu", correct: false, explanation: "Incorrect. This metric has nothing to do with menu size." },
      { text: "How long the front packet in a queue has waited without service", correct: true, explanation: "Correct. It captures the waiting time of the queue's leading packet." },
      { text: "The time required to generate the traffic scenario", correct: false, explanation: "Incorrect. Scenario generation time is not what this metric means." }
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
