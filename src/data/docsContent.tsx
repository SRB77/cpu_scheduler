import type { ReactNode } from "react";

export interface ContentSection {
  id: string;
  title: string;
  content: string | ReactNode;
}

export interface DocsTopic {
  id: string;
  title: string;
  description: string;
  sections: ContentSection[];
}

export const docsContent: Record<string, DocsTopic> = {
  introduction: {
    id: "introduction",
    title: "Introduction to FLUX",
    description:
      "Welcome to the official documentation for FLUX, the sophisticated CPU Scheduling Simulator and Analytical Tool.",
    sections: [
      {
        id: "abstract",
        title: "Abstract",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              CPU scheduling is a fundamental operating system construct
              governing the assignment of CPU time to concurrent processes.
              Despite its theoretical importance, the dynamic nature of these
              algorithms makes them challenging to conceptualize.
            </p>
            <p className="leading-7">
              <strong>FLUX</strong> presents a robust, interactive web-based CPU
              Scheduling Visualizer designed to simulate and analyze classic
              scheduling algorithms: FCFS, SJF, SRTF, Priority Scheduling, and
              Round Robin. The application provides real-time visualization
              through dynamic Gantt charts, ready queue monitoring, and a
              comprehensive comparison matrix.
            </p>
          </div>
        ),
      },
      {
        id: "problem-statement",
        title: "Problem Statement",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              There is a tangible lack of accessible, visually intuitive, and
              analytically comprehensive tools that not only simulate algorithms
              but also provide simultaneous side-by-side performance
              comparisons. Traditionally, static examples fail to capture the
              dynamic preemption found in algorithms like SRTF and Round Robin.
            </p>
            <p className="leading-7">
              By migrating simulation to the browser using React and TypeScript,
              FLUX addresses the accessibility gap while providing a highly
              interactive user interface.
            </p>
          </div>
        ),
      },
      {
        id: "objectives",
        title: "Core Objectives",
        content: (
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
            <li>
              To implement core CPU scheduling algorithms computationally using
              TypeScript.
            </li>
            <li>
              To develop an interactive, responsive front-end using React.
            </li>
            <li>
              To visually map execution timelines using dynamically generated
              Gantt Charts.
            </li>
            <li>
              To generate a Comparison Matrix contrasting algorithm efficiencies
              in real-time.
            </li>
          </ul>
        ),
      },
    ],
  },
  architecture: {
    id: "architecture",
    title: "System Design & Architecture",
    description:
      "An overview of the technologies and paradigms powering the FLUX execution engine.",
    sections: [
      {
        id: "tech-stack",
        title: "Technology Stack",
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="border border-border p-4 rounded-lg bg-muted/20">
              <h4 className="font-bold text-lg mb-2 text-primary">
                Front-End UI
              </h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>
                  <strong>React 19</strong>: Declarative, component-based UI.
                </li>
                <li>
                  <strong>Tailwind CSS</strong>: Utility-first styling for
                  themes.
                </li>
                <li>
                  <strong>Framer Motion</strong>: Fluid micro-animations.
                </li>
                <li>
                  <strong>Vite</strong>: Blazing fast HMR and optimized builds.
                </li>
              </ul>
            </div>
            <div className="border border-border p-4 rounded-lg bg-muted/20">
              <h4 className="font-bold text-lg mb-2 text-primary">
                Execution Engine
              </h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>
                  <strong>TypeScript</strong>: Strict static typing for process
                  interfaces and algorithm functions to prevent runtime crashes
                  during simulation loops.
                </li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "system-design",
        title: "System Design",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              The architecture of FLUX strictly isolates the mathematical
              simulation logic from the UI rendering layer.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Front-End Architecture:</strong> State is managed
                globally using modern React Hooks and the Context API for
                seamless synchronization (e.g., ThemeContext).
              </li>
              <li>
                <strong>Execution Engine:</strong> Written entirely in
                TypeScript, independent functions ingest process arrays,
                calculate block timings, and return strongly-typed
                `AlgorithmResult` objects containing exact start/end times and
                preemption gaps.
              </li>
              <li>
                <strong>Analytical Matrix:</strong> A background hook uses
                `useMemo` to silently run the active dataset through{" "}
                <em>every</em> available algorithm instantly, rendering a
                side-by-side performance comparison table without blocking the
                main thread.
              </li>
            </ul>
          </div>
        ),
      },
    ],
  },
  usage: {
    id: "usage",
    title: "Getting Started & Usage Guide",
    description:
      "Learn how to configure your environment and run your first CPU scheduling simulation.",
    sections: [
      {
        id: "prerequisites",
        title: "Prerequisites & Installation",
        content: (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              To run FLUX locally, ensure you have{" "}
              <strong>Node.js (v18.0.0+)</strong> and an package manager like
              `npm` installed.
            </p>
            <div className="bg-zinc-950 dark:bg-zinc-900 rounded-md border p-4 font-mono text-sm text-zinc-50 overflow-x-auto space-y-2">
              <div className="text-zinc-500"># 1. Clone the repository</div>
              <div>git clone https://github.com/SRB77/cpu_scheduler.git</div>
              <div>cd cpu_scheduler</div>
              <div className="text-zinc-500 mt-2">
                # 2. Install dependencies
              </div>
              <div>npm install</div>
              <div className="text-zinc-500 mt-2">
                # 3. Start the dev server
              </div>
              <div>npm run dev</div>
            </div>
          </div>
        ),
      },
      {
        id: "running",
        title: "Running a Simulation",
        content: (
          <div className="space-y-6 mt-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-foreground">
                  Add Processes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use the input forms to specify Process IDs, Arrival Times,
                  Burst Times, and optionally Priority levels. Alternatively,
                  use the <strong>Randomizer</strong> to instantly generate a
                  complex dataset.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-foreground">
                  Configure Algorithm
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select the algorithm you wish to visualize using the dropdown.
                  If picking Round Robin, define the Time Quantum parameter.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-foreground">
                  Visualize
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click <strong>Simulate</strong>. Watch the dynamic Gantt chart
                  construct the exact timeline sequence, complete with colored
                  IDLE blocks representing CPU downtime and context switches.
                </p>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  evaluation: {
    id: "evaluation",
    title: "Evaluation & Results",
    description:
      "Empirical results and validation of the FLUX scheduling engine.",
    sections: [
      {
        id: "accuracy",
        title: "Visualization Accuracy",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              Rigorous testing was conducted to ensure the mathematical accuracy
              of the execution engine. Tests successfully confirmed that FLUX
              maps complex preemptions—specifically those found in Shortest
              Remaining Time First (SRTF) and Round Robin—in real-time without
              logical errors.
            </p>
            <p className="leading-7">
              The Gantt visualization scales proportionally to the burst times,
              accurately reflecting realistic processor timelines and capturing
              all edge-case IDLE gaps.
            </p>
          </div>
        ),
      },
      {
        id: "performance",
        title: "Performance Analysis",
        content: (
          <div className="space-y-4">
            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded text-sm text-foreground">
              <strong>Key Finding:</strong> Across randomized, multi-process
              datasets featuring varied arrival times, Shortest Remaining Time
              First (SRTF) consistently achieved the optimal (minimum) Average
              Waiting Time, explicitly validating the theoretical axioms
              established in Operating Systems literature.
            </div>
            <p className="leading-7 mt-4">
              Conversely, non-preemptive algorithms like FCFS demonstrated the
              widely documented Convoy Effect when a process with massive burst
              time arrived first, artificially inflating the waiting times of
              subsequent short processes.
            </p>
          </div>
        ),
      },
      {
        id: "conclusion",
        title: "Conclusion & Future Enhancements",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              FLUX successfully bridges the gap between theoretical operating
              system concepts and practical visibility. By rendering complex
              mathematics into an intuitive, web-accessible dashboard, it serves
              as a quintessential educational tool.
            </p>
            <h4 className="font-semibold mt-4 text-primary">
              Future Iterations
            </h4>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>
                Integration of{" "}
                <strong>Multi-Level Feedback Queues (MLFQ)</strong>.
              </li>
              <li>
                Detailed simulations supporting custom{" "}
                <strong>I/O Bursts</strong> mixed with CPU execution bursts.
              </li>
              <li>
                Exporting analytical matrices to CSV/PDF formats for academic
                reporting.
              </li>
            </ul>
          </div>
        ),
      },
    ],
  },
};
