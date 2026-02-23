<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/cpu.svg" alt="FLUX Logo" width="120" height="120" />
  <h1>FLUX: CPU Scheduling Simulator</h1>
  <p><strong>A Modern, Interactive Web Application for Visualizing Operating System Scheduling Algorithms</strong></p>

  <p>
    <a href="#-about-flux">About</a> •
    <a href="#-features">Features</a> •
    <a href="#-algorithms">Algorithms</a> •
    <a href="#-project-structure">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-contributors">Contributors</a>
  </p>
</div>

---

## 📖 About FLUX

**FLUX** is a professionally crafted, educational CPU Scheduling Visualizer built to help students, developers, and OS enthusiasts deeply understand how modern Operating Systems handle process scheduling.

Created by **SRA** (Soumya Ranjan), FLUX bridges the gap between theoretical OS concepts and practical intuition through real-time Gantt chart visualization, performance metrics generation, and an extensive interactive "Learn" module.

## ✨ Features

### 🖥️ Core Simulator

- **Interactive Gantt Charts:** Color-coded timelines showing process execution, context switching, and idle states dynamically.
- **Real-Time Metrics Engine:** Instant calculation of Arrival Time (AT), Burst Time (BT), Completion Time (CT), Turnaround Time (TAT), and Waiting Time (WT).
- **Random Process Generator:** Instantly populate the ready queue with randomized processes to quickly test edge cases.
- **State Serialization:** Share your exact simulation setup with others via URL encoding.

### 📚 Dedicated Education Module

- **Comprehensive Docs:** A beautifully formatted, MDN-style `/learn` page featuring deep-dives into the mathematical logic, advantages, disadvantages, and trade-offs of each algorithm.
- **Scroll-Spy Table of Contents:** Context-aware sidebars that highlight your reading progress.

### 🎨 Premium User Experience

- **Theme Support:** Fluid Light and Dark mode toggling via `ThemeContext`.
- **Micro-Animations:** Powered by `framer-motion` for a silky-smooth, responsive desktop and mobile experience.
- **Instant Feedback:** Integrated `react-toastify` for real-time validation alerts.

## 🔄 Supported Algorithms

1. **FCFS (First Come First Serve)**
   - Strictly Non-preemptive. Processes are executed exactly in their order of arrival. Demonstrates the infamous _Convoy Effect_.
2. **SJF (Shortest Job First)**
   - Non-preemptive. Executes the process with the smallest execution time next. Provably optimal for minimizing average waiting time.
3. **SRTF (Shortest Remaining Time First)**
   - The highly preemptive version of SJF. Constantly monitors the ready queue to interrupt current processes if a shorter job arrives.
4. **Round Robin (RR)**
   - Preemptive and designed for time-sharing systems. Allocates a fixed _Time Quantum_ to each process in a circular queue.
5. **Priority Scheduling**
   - Supports both **Preemptive** and **Non-Preemptive** variants. Schedules processes based on an assigned priority integer.

## 📁 Project Structure

FLUX is built with React 19, TypeScript, Vite, and Tailwind CSS. The codebase is strictly modularized for maintainability and scalability.

```text
cpu_scheduler/
├── src/
│   ├── algorithms/          # Core mathematical logic for OS scheduling
│   │   ├── fcfs.ts
│   │   ├── priority.ts      # Handles both Preemptive & Non-Preemptive
│   │   ├── roundRobin.ts
│   │   ├── sjf.ts
│   │   └── srtf.ts
│   │
│   ├── components/          # Reusable React UI Components
│   │   ├── landing/         # Components specific to the Landing Page
│   │   ├── ui/              # Shadcn/Radix primitive UI elements
│   │   ├── AlgorithmSelector.tsx
│   │   ├── GanttChart.tsx   # Visualization engine
│   │   ├── MetricsTable.tsx # Data presentation
│   │   └── ProcessForm.tsx  # Input validation & handling
│   │
│   ├── contexts/            # Global State Management
│   │   └── ThemeContext.tsx # Handles Dark/Light mode preferences
│   │
│   ├── data/                # Static Data Stores
│   │   └── learnContent.tsx # High-density educational text for /learn
│   │
│   ├── pages/               # Main Route Views
│   │   ├── LandingPage.tsx  # Hero section & entry point
│   │   ├── LearnPage.tsx    # MDN-style documentation view
│   │   └── SimulatorPage.tsx# Core CPU Visualizer app
│   │
│   ├── types/               # Strict TypeScript Interfaces
│   │   └── process.ts       # Type definitions for PCB, GanttBlocks, etc.
│   │
│   ├── utils/
│   │   ├── colors.ts        # HSL color generation for Gantt segments
│   │   ├── cn.ts            # Tailwind class-merge utility
│   │   └── urlState.ts      # URL serialization/deserialization
│   │
│   ├── App.tsx              # Router Configuration (react-router-dom)
│   └── main.tsx             # React DOM root entry
│
├── public/                  # Static assets & favicons
├── package.json             # NPM dependencies
├── tailwind.config.js       # Design system tokens
└── vite.config.ts           # Bundler configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SRB77/cpu_scheduler.git
   cd cpu_scheduler
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Launch**
   Open your browser and navigate to `http://localhost:5173` to experience FLUX.

### Build and Deploy

To compile FLUX for production:

```bash
npm run build
npm run preview
```

The optimized bundles will be generated in the `/dist` directory.

## 👥 Contributors

- **SRB (Soumyaranjan)** - _Creator & Lead Developer_ - [@SRB77](https://github.com/SRB77)
- **Prashant** - _Contributor_ - [@nox-pie](https://github.com/nox-pie)

---

<div align="center">
  <sub>Built with ❤️ by Soumyranjan and prashant</sub>
</div>
