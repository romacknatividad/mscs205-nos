# Network Operating Systems Learning Studio

An interactive static web project for teaching the fundamental concepts of Network Operating Systems, queueing behavior, and packet scheduling algorithms.

The project is organized as a three-page learning experience:

- `index.html`: slide-based introduction to Network Operating Systems
- `simulator.html`: interactive queueing and scheduling simulator
- `formal.html`: formal definitions with mathematical notation and schedule tables

## Project Goals

This project is designed to help learners move through three layers of understanding:

1. Conceptual understanding of what a Network Operating System does
2. Interactive observation of how scheduling policies affect packet flow
3. Formal mathematical reasoning about queueing and scheduling algorithms

## Features

- Animated slide deck for Network Operating Systems fundamentals
- Interactive simulation with staged packet arrivals
- Variable packet sizes and service quanta
- Multiple traffic scenarios
- Multiple scheduling algorithms
- Formal theory page with MathJax-rendered notation
- Per-algorithm example schedule tables similar to compact Gantt charts
- Static-site friendly structure for GitHub Pages deployment

## Pages

### 1. Slides Page

File: `index.html`

This page introduces:

- what a Network Operating System is
- resource sharing
- authentication and authorization
- communication services
- centralized administration
- why queueing and scheduling matter in shared network environments

### 2. Simulation Page

File: `simulator.html`

This page contains the interactive lab. Users can:

- choose a scheduling algorithm
- choose a traffic scenario
- generate traffic
- step the simulation one tick at a time
- run and pause the simulation
- inspect arrivals, active queues, service progress, and dispatch history

The simulator tracks:

- current tick
- packets arrived
- packets waiting
- link utilization
- packets sent
- average wait time
- fairness signal
- head-of-line delay

### 3. Formal Theory Page

File: `formal.html`

This page presents one algorithm per section. Each section includes:

- a verbal description
- formal notation
- rendered mathematical expressions using MathJax
- an example schedule table

## Scheduling Algorithms Included

The simulator and theory sections cover:

- `FIFO / FCFS`
- `Strict Priority Queueing`
- `Round Robin`
- `Weighted Fair Queueing (WFQ)`
- `Deficit Round Robin (DRR)`
- `Earliest Deadline First (EDF)`

## Traffic Model

The simulator uses a simplified but more realistic model than a basic static queue demo:

- packets arrive over time instead of appearing all at once
- each packet has a size
- packet size determines how long it occupies the transmission channel
- some algorithms use priority
- some algorithms use weights or quantum values
- `EDF` uses deadlines

Traffic classes used in the simulator:

- `Voice / Critical`
- `Video / Streaming`
- `Data / General`

## File Structure

```text
.
|-- .github/
|   `-- workflows/
|       `-- deploy-pages.yml
|-- formal.html
|-- index.html
|-- README.md
|-- script.js
|-- simulator.html
|-- slides.js
`-- styles.css
```

## Key Files

- `index.html`: slides page
- `simulator.html`: interactive simulator page
- `formal.html`: formal mathematical page
- `styles.css`: shared styling for all pages
- `slides.js`: reveal animation behavior for slides and theory content
- `script.js`: simulator logic and scheduling behavior
- `.github/workflows/deploy-pages.yml`: GitHub Pages deployment workflow

## How to Run Locally

This project is a static website. No build step is required.

You can open the pages directly in a browser:

- `index.html`
- `simulator.html`
- `formal.html`

If you prefer serving it over a local HTTP server, you can use one of the following:

### Python

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Node.js

```bash
npx serve .
```

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow for automatic deployment to GitHub Pages:

- Workflow file: `.github/workflows/deploy-pages.yml`
- Trigger: pushes to `main`

To make deployment work, ensure:

1. the workflow file is committed and pushed to GitHub
2. GitHub Pages is enabled in repository settings
3. the Pages source is set to `GitHub Actions`

## External Dependencies

This project is mostly self-contained, but it uses:

- Google Fonts for typography
- MathJax for mathematical rendering on `formal.html`

MathJax is loaded from:

```text
https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js
```

## Educational Design Notes

The project separates content by purpose:

- the slides page is for intuition and framing
- the simulator page is for experimentation and comparison
- the formal page is for rigorous algorithm discussion

This separation keeps the interface clearer than placing everything on a single long page.

## Limitations

This simulator is educational, not a production-grade network emulator.

It intentionally simplifies several real networking concerns, including:

- packet fragmentation
- multi-link routing
- retransmission behavior
- stochastic arrival distributions
- preemption details for every scheduling family
- full queueing-theory derivations

The goal is to make the main scheduling ideas visible and understandable.

## Possible Next Improvements

- add comparative charts across algorithms
- add user-editable packet streams
- add queue length plots over time
- add exportable simulation traces
- add more formal derivations for delay and fairness bounds
- add narrated slide transitions or guided walkthrough mode

## Authoring Notes

The project currently uses plain HTML, CSS, and JavaScript for portability and easy GitHub Pages hosting.

That makes it suitable for:

- classroom demos
- self-study
- lightweight deployment
- portfolio presentation of networking concepts
