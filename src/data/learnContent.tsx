import type { ReactNode } from "react";

export interface ContentSection {
  id: string;
  title: string;
  content: string | ReactNode;
}

export interface LearnTopic {
  id: string;
  title: string;
  description: string;
  sections: ContentSection[];
}

export const learnContent: Record<string, LearnTopic> = {
  "getting-started": {
    id: "getting-started",
    title: "Getting Started with CPU Scheduling",
    description:
      "Welcome to the OS Visualizer! This guide will help you understand how Operating Systems decide which process gets to use the CPU.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              In modern Operating Systems, multiple programs (processes) are
              loaded into memory and ready to execute. However, a single CPU
              core can only execute one process at a time. The{" "}
              <strong>CPU Scheduler</strong> is the part of the OS responsible
              for deciding which process runs next and for how long.
            </p>
            <p className="leading-7">
              The goal of scheduling is to maximize CPU utilization and minimize
              waiting times, turnaround times, and response times for users.
            </p>
          </div>
        ),
      },
      {
        id: "key-terminologies",
        title: "Key Terminologies",
        content: (
          <div className="space-y-6">
            <p className="leading-7">
              Before diving into the algorithms, you need to understand these
              fundamental metrics:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
              <li>
                <strong className="text-foreground">Arrival Time (AT):</strong>{" "}
                The exact time when a process arrives in the ready queue and is
                ready to execute.
              </li>
              <li>
                <strong className="text-foreground">Burst Time (BT):</strong>{" "}
                The total amount of time a process needs the CPU to complete its
                execution.
              </li>
              <li>
                <strong className="text-foreground">
                  Completion Time (CT):
                </strong>{" "}
                The time at which the process finishes its execution.
              </li>
              <li>
                <strong className="text-foreground">
                  Turnaround Time (TAT):
                </strong>{" "}
                The total time taken from the arrival of the process to its
                completion.
                <br />
                <code className="text-sm bg-muted px-2 py-1 rounded mt-2 inline-block">
                  TAT = Completion Time - Arrival Time
                </code>
              </li>
              <li>
                <strong className="text-foreground">Waiting Time (WT):</strong>{" "}
                The total time the process spent waiting in the ready queue
                before getting the CPU.
                <br />
                <code className="text-sm bg-muted px-2 py-1 rounded mt-2 inline-block">
                  WT = Turnaround Time - Burst Time
                </code>
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "preemptive-vs-non-preemptive",
        title: "Preemptive vs Non-Preemptive",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              Scheduling algorithms broadly fall into two categories:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border border-border p-4 rounded-lg bg-muted/20">
                <h4 className="font-bold text-lg mb-2 text-primary">
                  Preemptive Scheduling
                </h4>
                <p className="text-sm text-muted-foreground">
                  The OS can forcefully interrupt a running process and take the
                  CPU away from it (e.g., if a higher priority process arrives
                  or a time quantum expires). Examples: Round Robin, SRTF.
                </p>
              </div>
              <div className="border border-border p-4 rounded-lg bg-muted/20">
                <h4 className="font-bold text-lg mb-2 text-primary">
                  Non-Preemptive Scheduling
                </h4>
                <p className="text-sm text-muted-foreground">
                  Once a process gets the CPU, it keeps it until it finishes its
                  burst time or blocks for I/O. The OS cannot interrupt it.
                  Examples: FCFS, basic SJF.
                </p>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  fcfs: {
    id: "fcfs",
    title: "First Come First Serve (FCFS)",
    description:
      "The simplest CPU scheduling algorithm. Processes are assigned the CPU in the order they arrive.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              First Come First Serve (FCFS) works exactly like a queue at a
              grocery store checkout. The process that arrives first is executed
              first. It is strictly a <strong>non-preemptive</strong> algorithm.
            </p>
            <p className="leading-7">
              The OS maintains a FIFO (First-In, First-Out) queue. When a
              process enters the ready queue, its Process Control Block (PCB) is
              linked onto the tail of the queue. When the CPU is free, it is
              allocated to the process at the head of the queue.
            </p>
          </div>
        ),
      },
      {
        id: "advantages-disadvantages",
        title: "Advantages & Disadvantages",
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-500 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Advantages
              </h4>
              <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1">
                <li>Extremely simple to understand and implement.</li>
                <li>
                  Requires minimal overhead as there's no complex sorting or
                  preemption logic.
                </li>
                <li>No starvation (every process will eventually run).</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-red-500 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                Disadvantages
              </h4>
              <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1">
                <li>High average waiting time.</li>
                <li>
                  Non-preemptive nature means a long process can block short
                  processes.
                </li>
                <li>
                  Suffers from the <strong>Convoy Effect</strong>.
                </li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "convoy-effect",
        title: "The Convoy Effect",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              The <strong>Convoy Effect</strong> occurs in FCFS when one
              CPU-intensive process blocks the CPU for a long time, causing many
              shorter I/O-bound processes to wait behind it in the queue.
            </p>
            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded text-sm text-muted-foreground">
              <strong>Analogy:</strong> Imagine a slow truck on a single-lane
              road. Even if there are sports cars behind it that could go much
              faster, they are forced to wait and drive at the truck's speed.
            </div>
          </div>
        ),
      },
    ],
  },
  sjf: {
    id: "sjf",
    title: "Shortest Job First (SJF)",
    description:
      "Executes the process with the smallest execution time next. It is provably optimal for minimizing average waiting time.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              Shortest Job First (SJF) associates each process with the length
              of its next CPU burst. When the CPU becomes available, it is
              assigned to the process that has the smallest burst time. If two
              processes have the same burst time, FCFS is used to break the tie.
            </p>
            <p className="leading-7">
              Basic SJF is strictly <strong>non-preemptive</strong>. Once the
              CPU is given to a process, it cannot be preempted until it
              completes its CPU burst, even if a new process arrives with a
              shorter burst time.
            </p>
          </div>
        ),
      },
      {
        id: "optimality",
        title: "Why is it Optimal?",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              SJF is provably optimal because moving a short process before a
              long one decreases the waiting time of the short process more than
              it increases the waiting time of the long process. Consequently,
              the average waiting time decreases.
            </p>
          </div>
        ),
      },
      {
        id: "advantages-disadvantages",
        title: "Advantages & Disadvantages",
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-500">Advantages</h4>
              <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1">
                <li>Gives the minimum possible average waiting time.</li>
                <li>
                  Provides standard for other algorithms to be measured against.
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-red-500">Disadvantages</h4>
              <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1">
                <li>
                  <strong>Practically impossible to implement</strong> because
                  it requires knowing the exact length of the next CPU request
                  in advance.
                </li>
                <li>
                  Can lead to <strong>Starvation</strong>: Long processes may
                  never get the CPU if short processes keep arriving.
                </li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
  },
  srtf: {
    id: "srtf",
    title: "Shortest Remaining Time First (SRTF)",
    description:
      "The preemptive version of SJF. It constantly monitors for new shorter jobs and preempts the current job if necessary.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              SRTF is the <strong>preemptive</strong> counterpart to SJF. In
              SRTF, the process with the smallest remaining burst time is
              scheduled to run next.
            </p>
            <p className="leading-7">
              If a new process arrives with a burst time shorter than the{" "}
              <em>remaining</em> time of the currently executing process, the
              CPU is preempted (taken away) from the current process and given
              to the new, shorter process.
            </p>
          </div>
        ),
      },
      {
        id: "context-switching",
        title: "The Cost of Context Switching",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              Because SRTF constantly evaluates remaining times and interrupts
              processes mid-execution, it relies heavily on{" "}
              <strong>Context Switching</strong>.
            </p>
            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded text-sm text-foreground">
              A Context Switch is the process of saving the state/context of the
              old process and loading the saved state for the new process. This
              takes small amounts of time (overhead) where the CPU does no
              useful work. High preemption means high overhead!
            </div>
          </div>
        ),
      },
    ],
  },
  rr: {
    id: "rr",
    title: "Round Robin (RR)",
    description:
      "Designed specifically for time-sharing systems. Every process gets a small fixed slice of time.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              Round Robin is a highly <strong>preemptive</strong> algorithm. The
              OS defines a small unit of time called a{" "}
              <strong>Time Quantum</strong> (or Time Slice), generally ranging
              from 10 to 100 milliseconds.
            </p>
            <p className="leading-7">
              The ready queue is treated as a circular queue. The scheduler goes
              around the queue, allocating the CPU to each process for a time
              interval of up to one time quantum. If a process doesn't finish
              within its quantum, it is preempted and put at the back of the
              queue.
            </p>
          </div>
        ),
      },
      {
        id: "time-quantum-effects",
        title: "The Effect of the Time Quantum",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              The performance of RR depends heavily on the size of the time
              quantum:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
              <li>
                <strong>If quantum is very large:</strong> RR behaves exactly
                like First Come First Serve (FCFS).
              </li>
              <li>
                <strong>If quantum is very small:</strong> The system becomes
                highly responsive, but spends most of its time context-switching
                between processes (huge overhead), drastically hurting overall
                performance.
              </li>
            </ul>
            <p className="text-sm mt-4 font-semibold text-foreground">
              Rule of thumb: 80% of CPU bursts should be shorter than the time
              quantum.
            </p>
          </div>
        ),
      },
      {
        id: "advantages",
        title: "Advantages",
        content: (
          <ul className="list-disc pl-5 text-muted-foreground space-y-2 mt-2">
            <li>
              Excellent response time, which is critical for interactive/UI
              systems.
            </li>
            <li>
              Fairness: No process is starved; every process is guaranteed to
              get a turn.
            </li>
          </ul>
        ),
      },
    ],
  },
  priority: {
    id: "priority",
    title: "Priority Scheduling",
    description:
      "Schedules processes based on an assigned priority. It can be preemptive or non-preemptive.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              In Priority Scheduling, a priority (an integer number) is
              associated with each process. The CPU is allocated to the process
              with the highest priority. Equal-priority processes are scheduled
              in FCFS order.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Note: Systems differ on whether low numbers represent high
              priority or low priority. In our visualizer, lower numbers
              generally represent higher priority.
            </p>
          </div>
        ),
      },
      {
        id: "preemptive-vs-nonpreemptive",
        title: "Preemptive vs Non-Preemptive",
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border border-border p-4 rounded-lg bg-muted/20">
              <h4 className="font-bold text-lg mb-2 text-primary">
                Preemptive Priority
              </h4>
              <p className="text-sm text-foreground">
                If a new process arrives at the ready queue and its priority is
                higher than the currently running process, the CPU is preempted
                (taken away) and given to the newly arrived process.
              </p>
            </div>
            <div className="border border-border p-4 rounded-lg bg-muted/20">
              <h4 className="font-bold text-lg mb-2 text-primary">
                Non-Preemptive Priority
              </h4>
              <p className="text-sm text-foreground">
                If a new, higher-priority process arrives, it is placed at the
                head of the ready queue. The currently running process is
                allowed to finish its burst time without interruption.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "starvation-and-aging",
        title: "Starvation and Aging",
        content: (
          <div className="space-y-4">
            <p className="leading-7">
              A major problem with priority scheduling is{" "}
              <strong>indefinite blocking</strong>, or{" "}
              <strong>Starvation</strong>. A steady stream of high-priority
              processes can leave a low-priority process waiting indefinitely
              for the CPU.
            </p>
            <p className="leading-7">
              The solution to starvation is <strong>Aging</strong>. Aging is a
              technique of gradually increasing the priority of processes that
              wait in the system for a long time. For example, if priority
              ranges from 127 (low) to 0 (high), we could decrease the priority
              number of a waiting process by 1 every 15 minutes. Even a process
              with priority 127 will eventually graduate to priority 0 and run!
            </p>
          </div>
        ),
      },
    ],
  },
};
