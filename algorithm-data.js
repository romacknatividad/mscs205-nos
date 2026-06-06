window.algorithmCatalog = {
  fifo: {
    slug: "fifo",
    number: "Algorithm 1",
    name: "FIFO / FCFS",
    pageTitle: "FIFO / FCFS",
    summary: "FIFO dispatches the packet with the earliest arrival time and ignores class, weight, and deadlines.",
    shortFormula: "\\[p^*(t) = \\arg\\min_{p \\in Q(t)} a_p\\]",
    description: "First In, First Out serves packets in order of arrival time. It is easy to implement but does not protect latency-sensitive traffic.",
    informalDefinition: "FIFO is like a single line where whoever arrives first gets served first, even if someone behind has a shorter or more urgent request.",
    analogyHtml: `<p>Imagine a school canteen with only one cashier. Students are served in the exact order they join the line. A student buying one bottle of water still has to wait behind someone ordering a full meal.</p>`,
    strength: "Best when implementation simplicity is more important than differentiated service.",
    formalHtml: `<strong>Formal Definition</strong>
      <div class="math-block">\\[
        p^*(t) = \\arg\\min_{p \\in Q(t)} a_p
      \\]</div>
      <p>The waiting time and turnaround time are written as \\(W_p = s_p - a_p\\) and \\(T_p = c_p - a_p\\).</p>
      <div class="math-block">\\[
        W_p = s_p - a_p,\\qquad T_p = c_p - a_p
      \\]</div>
      <p>FIFO is simple, but it suffers from the convoy effect when a long packet blocks shorter packets behind it.</p>`,
    notationHtml: `<details class="notation-help">
      <summary>Read this notation informally</summary>
      <div class="notation-help-body">
        <p><strong>Main rule:</strong> pick the packet that arrived first among everything currently waiting.</p>
        <p><strong>Wait time \\(W_p\\):</strong> how long packet \\(p\\) sat in line before service began.</p>
        <p><strong>Turnaround time \\(T_p\\):</strong> total time from arrival until the packet finishes.</p>
      </div>
    </details>`,
    tradeoffHtml: `<div class="tradeoff-grid">
      <article class="tradeoff-card advantage-card">
        <strong>Advantages</strong>
        <ul class="tradeoff-list">
          <li>Very simple to implement and explain.</li>
          <li>Arrival order is transparent and easy to audit.</li>
          <li>Works well when traffic classes are treated equally.</li>
        </ul>
      </article>
      <article class="tradeoff-card disadvantage-card">
        <strong>Disadvantages</strong>
        <ul class="tradeoff-list">
          <li>Critical short packets can wait behind long packets.</li>
          <li>Provides no class differentiation or deadline awareness.</li>
          <li>Convoy effects can increase delay under bursty traffic.</li>
        </ul>
      </article>
    </div>`,
    scheduleHtml: `<strong>Example Schedule</strong>
      <table class="schedule-table">
        <thead>
          <tr><th>Tick</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
        </thead>
        <tbody>
          <tr><th>Packet in Service</th><td>P1</td><td>P1</td><td>P2</td><td>P3</td><td>P3</td><td>P4</td></tr>
          <tr><th>Reason</th><td colspan="2">Earliest arrival</td><td>Next arrival</td><td colspan="2">Still at head</td><td>Last remaining</td></tr>
        </tbody>
      </table>`
  },
  priority: {
    slug: "priority",
    number: "Algorithm 2",
    name: "Strict Priority Queueing",
    pageTitle: "Strict Priority Queueing",
    summary: "Strict Priority serves the highest-priority queue first and resolves ties by earlier arrival.",
    shortFormula: "\\[p^*(t) = \\arg\\max_{p \\in Q(t)} (\\pi_p, -a_p)\\]",
    description: "Strict Priority always serves the highest-priority eligible class first. This sharply reduces delay for critical flows while risking starvation for low-priority traffic.",
    informalDefinition: "Strict Priority asks which traffic is most important right now and serves that class first, even if lower classes have been waiting longer.",
    analogyHtml: `<p>Think of a hospital triage desk. Emergency patients are taken first, while routine cases wait until urgent cases are cleared. That protects critical cases, but routine cases may wait a very long time.</p>`,
    strength: "Best when mission-critical or real-time traffic must dominate service decisions.",
    formalHtml: `<strong>Formal Definition</strong>
      <div class="math-block">\\[
        p^*(t) = \\arg\\max_{p \\in Q(t)} \\left(\\pi_p,\\,-a_p\\right)
      \\]</div>
      <p>Here \\(\\pi_p\\) is a class priority with \\(\\pi_{\\text{voice}} > \\pi_{\\text{video}} > \\pi_{\\text{data}}\\).</p>
      <div class="math-block">\\[
        \\lambda_{\\text{high}} \\ge \\mu \\;\\Rightarrow\\; \\text{possible starvation of low-priority classes}
      \\]</div>
      <p>The model is effective for urgent traffic, but starvation becomes possible when high-priority load is sustained.</p>`,
    notationHtml: `<details class="notation-help">
      <summary>Read this notation informally</summary>
      <div class="notation-help-body">
        <p><strong>Main rule:</strong> first look for the highest-priority traffic class, then within that class pick the earliest arrival.</p>
        <p><strong>\\(\\pi_p\\):</strong> the importance label attached to packet \\(p\\).</p>
        <p><strong>\\(\\lambda_{\\text{high}} \\ge \\mu\\):</strong> if urgent traffic arrives at least as fast as the system can serve it, lower classes may keep waiting indefinitely.</p>
      </div>
    </details>`,
    tradeoffHtml: `<div class="tradeoff-grid">
      <article class="tradeoff-card advantage-card">
        <strong>Advantages</strong>
        <ul class="tradeoff-list">
          <li>Protects mission-critical traffic with very low delay.</li>
          <li>Easy to configure when classes have obvious urgency levels.</li>
          <li>Useful for voice, control, or alarm traffic.</li>
        </ul>
      </article>
      <article class="tradeoff-card disadvantage-card">
        <strong>Disadvantages</strong>
        <ul class="tradeoff-list">
          <li>Low-priority queues can starve during sustained overload.</li>
          <li>Fairness is weak because urgency dominates all other goals.</li>
          <li>Poor fit when many classes need meaningful service guarantees.</li>
        </ul>
      </article>
    </div>`,
    scheduleHtml: `<strong>Example Schedule</strong>
      <table class="schedule-table">
        <thead>
          <tr><th>Tick</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
        </thead>
        <tbody>
          <tr><th>Packet in Service</th><td>V1</td><td>V2</td><td>V3</td><td>M1</td><td>M2</td><td>D1</td></tr>
          <tr><th>Meaning</th><td colspan="3">Voice dominates</td><td colspan="2">Medium class after voice empties</td><td>Data waits longest</td></tr>
        </tbody>
      </table>`
  },
  rr: {
    slug: "rr",
    number: "Algorithm 3",
    name: "Round Robin",
    pageTitle: "Round Robin",
    summary: "Round Robin rotates across non-empty queues, giving one service opportunity per visit.",
    shortFormula: "\\[i_{k+1} = (i_k + 1) \\bmod N\\]",
    description: "Round Robin visits non-empty queues cyclically. It is more equitable than strict priority, but equal turns do not mean equal bandwidth when packet sizes differ.",
    informalDefinition: "Round Robin gives each non-empty queue a turn in rotation, so service moves around the active queues instead of staying with one queue for too long.",
    analogyHtml: `<p>Imagine three student groups presenting in class. The teacher gives Group A one turn, then Group B, then Group C, and then cycles back to Group A. Everyone gets a chance, but one group can still use more total time if its turn is heavier.</p>`,
    strength: "Best when bounded unfairness is more important than strict optimization for one class.",
    formalHtml: `<strong>Formal Definition</strong>
      <div class="math-block">\\[
        i_{k+1} = (i_k + 1) \\bmod N
      \\]</div>
      <p>If queue \\(q_i\\) is non-empty at its turn, one packet is dispatched from that queue.</p>
      <div class="math-block">\\[
        B_i(t) > 0 \\Rightarrow \\text{serve head}(q_i)
      \\]</div>
      <p>Queue-level fairness is strong, but byte-level fairness is weak when packets have unequal sizes.</p>`,
    notationHtml: `<details class="notation-help">
      <summary>Read this notation informally</summary>
      <div class="notation-help-body">
        <p><strong>Main rule:</strong> move to the next queue in a circle, then give that queue one chance to send.</p>
        <p><strong>\\((i_k + 1) \\bmod N\\):</strong> after the last queue, wrap around to the first queue again.</p>
        <p><strong>\\(B_i(t) > 0\\):</strong> if queue \\(i\\) actually has a packet waiting, send the front packet; otherwise skip it.</p>
      </div>
    </details>`,
    tradeoffHtml: `<div class="tradeoff-grid">
      <article class="tradeoff-card advantage-card">
        <strong>Advantages</strong>
        <ul class="tradeoff-list">
          <li>Prevents one active queue from dominating every turn.</li>
          <li>Behavior is easy for students to follow visually.</li>
          <li>Improves fairness compared with strict priority.</li>
        </ul>
      </article>
      <article class="tradeoff-card disadvantage-card">
        <strong>Disadvantages</strong>
        <ul class="tradeoff-list">
          <li>Equal turns do not imply equal bandwidth with unequal packet sizes.</li>
          <li>Does not account for deadlines or traffic importance.</li>
          <li>Can still delay urgent traffic behind less important packets.</li>
        </ul>
      </article>
    </div>`,
    scheduleHtml: `<strong>Example Schedule</strong>
      <table class="schedule-table">
        <thead>
          <tr><th>Tick</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
        </thead>
        <tbody>
          <tr><th>Queue Served</th><td>Q1</td><td>Q2</td><td>Q3</td><td>Q1</td><td>Q2</td><td>Q3</td></tr>
          <tr><th>Packet in Service</th><td>A1</td><td>B1</td><td>C1</td><td>A2</td><td>B2</td><td>C2</td></tr>
        </tbody>
      </table>`
  },
  wfq: {
    slug: "wfq",
    number: "Algorithm 4",
    name: "Weighted Fair Queueing",
    pageTitle: "Weighted Fair Queueing",
    summary: "WFQ approximates Generalized Processor Sharing by computing a virtual finish tag for each packet.",
    shortFormula: "\\[F_i^k = \\max(F_i^{k-1}, V(a_i^k)) + \\frac{L_i^k}{w_i}\\]",
    description: "WFQ approximates generalized processor sharing by assigning virtual finish times. Higher-weight classes receive more long-run service without excluding lower-weight classes.",
    informalDefinition: "WFQ tries to be fair over time by giving each class a weighted share of service instead of simply rotating equally or always choosing urgency first.",
    analogyHtml: `<p>Think of a budget planner dividing study-room time among student organizations. Larger organizations or more important activities receive larger shares, but smaller groups still get scheduled instead of being ignored.</p>`,
    strength: "Best when differentiated quality of service and fairness must both be maintained.",
    formalHtml: `<strong>Formal Definition</strong>
      <div class="math-block">\\[
        F_i^k = \\max\\left(F_i^{k-1}, V(a_i^k)\\right) + \\frac{L_i^k}{w_i}
      \\]</div>
      <p>The next packet selected is the eligible packet with the smallest finish tag.</p>
      <div class="math-block">\\[
        p^*(t) = \\arg\\min_i F_i^{\\text{head}}(t)
      \\]</div>
      <p>In long-run service, class \\(i\\) receives approximately \\(w_i / \\sum_j w_j\\) of the capacity.</p>`,
    notationHtml: `<details class="notation-help">
      <summary>Read this notation informally</summary>
      <div class="notation-help-body">
        <p><strong>Main rule:</strong> give every head packet a score that estimates when it would finish in an ideal fair system, then send the packet with the smallest score.</p>
        <p><strong>\\(\\frac{L_i^k}{w_i}\\):</strong> larger packets add more cost, while larger weights reduce that cost and make a class reappear sooner.</p>
        <p><strong>\\(w_i / \\sum_j w_j\\):</strong> over time, a class gets roughly its weight-share of the link.</p>
      </div>
    </details>`,
    tradeoffHtml: `<div class="tradeoff-grid">
      <article class="tradeoff-card advantage-card">
        <strong>Advantages</strong>
        <ul class="tradeoff-list">
          <li>Balances fairness and differentiated service using weights.</li>
          <li>Handles variable packet sizes better than plain Round Robin.</li>
          <li>Lower-weight traffic still receives service over time.</li>
        </ul>
      </article>
      <article class="tradeoff-card disadvantage-card">
        <strong>Disadvantages</strong>
        <ul class="tradeoff-list">
          <li>More complex to explain and implement than FIFO or RR.</li>
          <li>Requires careful weight design to match policy goals.</li>
          <li>Virtual-time calculations add scheduler overhead.</li>
        </ul>
      </article>
    </div>`,
    scheduleHtml: `<strong>Example Schedule</strong>
      <table class="schedule-table">
        <thead>
          <tr><th>Tick</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
        </thead>
        <tbody>
          <tr><th>Smallest Tag</th><td>V1</td><td>M1</td><td>V2</td><td>D1</td><td>V3</td><td>M2</td></tr>
          <tr><th>Interpretation</th><td colspan="6">Higher weight classes reappear more often, but data is still scheduled.</td></tr>
        </tbody>
      </table>`
  },
  drr: {
    slug: "drr",
    number: "Algorithm 5",
    name: "Deficit Round Robin",
    pageTitle: "Deficit Round Robin",
    summary: "DRR extends Round Robin by carrying deficit credit across rounds, making it practical for unequal packet sizes.",
    shortFormula: "\\[D_i \\leftarrow D_i + Q_i\\]",
    description: "DRR extends Round Robin using deficit counters and per-class quantum values. A queue can send packets while its deficit covers packet size, which handles variable-size packets efficiently.",
    informalDefinition: "DRR gives each queue service credit every round. If a packet is too large for the current credit, the queue saves the unused credit and can try again next round.",
    analogyHtml: `<p>Imagine each student organization receives printing credits every week. A group that cannot afford a large poster this week keeps its unused credits, so eventually it can print the poster without being permanently blocked by small jobs from others.</p>`,
    strength: "Best when you want scalable fairness with variable packet sizes and low scheduler overhead.",
    formalHtml: `<strong>Formal Definition</strong>
      <div class="math-block">\\[
        D_i(t^+) = D_i(t) + Q_i
      \\]</div>
      <p>Queue \\(i\\) transmits while its head packet length does not exceed its current deficit counter.</p>
      <div class="math-block">\\[
        L_i^{\\text{head}} \\le D_i \\Rightarrow D_i \\leftarrow D_i - L_i^{\\text{head}}
      \\]</div>
      <p>Unused credit is not discarded, so large packets eventually become eligible without losing fairness.</p>`,
    notationHtml: `<details class="notation-help">
      <summary>Read this notation informally</summary>
      <div class="notation-help-body">
        <p><strong>Main rule:</strong> each round, add credit to a queue; if the queue has enough credit to pay for its front packet, it can send.</p>
        <p><strong>\\(Q_i\\):</strong> the fixed amount of service credit queue \\(i\\) receives each visit.</p>
        <p><strong>\\(L_i^{\\text{head}} \\le D_i\\):</strong> the front packet can go only when its size is no larger than the saved credit.</p>
      </div>
    </details>`,
    tradeoffHtml: `<div class="tradeoff-grid">
      <article class="tradeoff-card advantage-card">
        <strong>Advantages</strong>
        <ul class="tradeoff-list">
          <li>Scales well with variable-size packets and many queues.</li>
          <li>Saved deficit credit prevents permanent exclusion of large packets.</li>
          <li>Lower overhead than exact virtual-time fair queueing.</li>
        </ul>
      </article>
      <article class="tradeoff-card disadvantage-card">
        <strong>Disadvantages</strong>
        <ul class="tradeoff-list">
          <li>Fairness depends on sensible quantum values.</li>
          <li>Less intuitive than FIFO or basic Round Robin.</li>
          <li>Short-term service order can still look uneven to beginners.</li>
        </ul>
      </article>
    </div>`,
    scheduleHtml: `<strong>Example Schedule</strong>
      <table class="schedule-table">
        <thead>
          <tr><th>Round</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Deficit Outcome</th></tr>
        </thead>
        <tbody>
          <tr><th>1</th><td>send A1</td><td>skip</td><td>send C1</td><td>Q2 saves credit</td></tr>
          <tr><th>2</th><td>send A2</td><td>send B1</td><td>send C2</td><td>Accumulated deficit unlocks B1</td></tr>
          <tr><th>3</th><td>send A3</td><td>send B2</td><td>idle</td><td>Weighted rotation continues</td></tr>
        </tbody>
      </table>`
  },
  edf: {
    slug: "edf",
    number: "Algorithm 6",
    name: "Earliest Deadline First",
    pageTitle: "Earliest Deadline First",
    summary: "EDF selects the packet whose absolute deadline is nearest, regardless of static class labels.",
    shortFormula: "\\[p^*(t) = \\arg\\min_{p \\in Q(t)} d_p\\]",
    description: "EDF selects the eligible packet with the nearest deadline. It is effective when traffic has explicit timing constraints rather than only class priorities.",
    informalDefinition: "EDF looks at which waiting packet will become late the soonest and serves that packet first, regardless of its static class label.",
    analogyHtml: `<p>Think of a student working on several assignments with different due dates. The assignment due tomorrow is handled before one due next week, even if both are equally important in general.</p>`,
    strength: "Best when deadlines are meaningful and lateness is the key performance metric.",
    formalHtml: `<strong>Formal Definition</strong>
      <div class="math-block">\\[
        p^*(t) = \\arg\\min_{p \\in Q(t)} d_p
      \\]</div>
      <p>The lateness of packet \\(p\\) is measured relative to its deadline.</p>
      <div class="math-block">\\[
        L_p = c_p - d_p
      \\]</div>
      <p>EDF is optimal for many uniprocessor feasibility models, but only when the workload is not admitted beyond capacity.</p>`,
    notationHtml: `<details class="notation-help">
      <summary>Read this notation informally</summary>
      <div class="notation-help-body">
        <p><strong>Main rule:</strong> choose the waiting packet whose deadline arrives soonest.</p>
        <p><strong>\\(d_p\\):</strong> the absolute deadline assigned to packet \\(p\\).</p>
        <p><strong>\\(L_p = c_p - d_p\\):</strong> positive lateness means the packet finished after its deadline, while negative lateness means it finished early.</p>
      </div>
    </details>`,
    tradeoffHtml: `<div class="tradeoff-grid">
      <article class="tradeoff-card advantage-card">
        <strong>Advantages</strong>
        <ul class="tradeoff-list">
          <li>Directly targets deadline-sensitive traffic.</li>
          <li>Adapts to time urgency rather than only fixed class labels.</li>
          <li>Can minimize lateness when workloads are feasible.</li>
        </ul>
      </article>
      <article class="tradeoff-card disadvantage-card">
        <strong>Disadvantages</strong>
        <ul class="tradeoff-list">
          <li>Weak fit when packets do not carry meaningful deadlines.</li>
          <li>Can behave poorly if the system is overloaded beyond capacity.</li>
          <li>Deadline management adds policy and implementation complexity.</li>
        </ul>
      </article>
    </div>`,
    scheduleHtml: `<strong>Example Schedule</strong>
      <table class="schedule-table">
        <thead>
          <tr><th>Tick</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
        </thead>
        <tbody>
          <tr><th>Nearest Deadline</th><td>P2</td><td>P2</td><td>P4</td><td>P1</td><td>P3</td><td>P5</td></tr>
          <tr><th>Interpretation</th><td colspan="6">Urgency in time overrides static traffic class.</td></tr>
        </tbody>
      </table>`
  }
};
