import type {
  ProcessInput,
  AlgorithmResult,
  GanttBlock,
  ProcessMetrics,
} from "../types/process";

export function priorityPreemptive(processes: ProcessInput[]): AlgorithmResult {
  if (processes.length === 0) {
    return { ganttBlocks: [], metrics: [] };
  }

  // Validate all processes have priority
  if (processes.some((p) => p.priority === undefined)) {
    return { ganttBlocks: [], metrics: [] };
  }

  const ganttBlocks: GanttBlock[] = [];
  const metricsMap = new Map<string, ProcessMetrics>();
  let currentTime = 0;

  // Track the first time a process starts to calculate waiting time properly
  const firstStartTimes = new Map<string, number>();

  const remainingProcesses = processes.map((p) => ({
    ...p,
    remainingBurstTime: p.burstTime,
    priority: p.priority!,
  }));

  let currentExecutingProcess: string | null = null;
  let blockStartTime = 0;

  while (remainingProcesses.some((p) => p.remainingBurstTime > 0)) {
    // Find all processes that have arrived and still need execution
    const availableProcesses = remainingProcesses.filter(
      (p) => p.arrivalTime <= currentTime && p.remainingBurstTime > 0,
    );

    if (availableProcesses.length === 0) {
      // CPU is idle
      if (currentExecutingProcess !== null) {
        // Close out any previously running block
        ganttBlocks.push({
          pid: currentExecutingProcess,
          startTime: blockStartTime,
          endTime: currentTime,
        });
        currentExecutingProcess = null;
      }

      // Fast forward to next arriving process
      const nextProcess = remainingProcesses
        .filter((p) => p.remainingBurstTime > 0)
        .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];

      if (nextProcess) {
        ganttBlocks.push({
          pid: "IDLE",
          startTime: currentTime,
          endTime: nextProcess.arrivalTime,
        });
        currentTime = nextProcess.arrivalTime;
      } else {
        break;
      }
      continue;
    }

    // Preemptive Priority Selection: Lowest number = highest priority
    const selectedProcess = availableProcesses.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority; // Lower priority number wins
      }
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime; // Earlier arrival wins tie
      }
      return a.pid.localeCompare(b.pid); // Stabilize sort
    })[0];

    // Context switch detected
    if (currentExecutingProcess !== selectedProcess.pid) {
      // Close out the old block if it exists
      if (currentExecutingProcess !== null) {
        ganttBlocks.push({
          pid: currentExecutingProcess,
          startTime: blockStartTime,
          endTime: currentTime,
        });
      }
      // Start a new block
      currentExecutingProcess = selectedProcess.pid;
      blockStartTime = currentTime;

      // Record first start time
      if (!firstStartTimes.has(selectedProcess.pid)) {
        firstStartTimes.set(selectedProcess.pid, currentTime);
      }
    }

    // Execute for 1 unit of time
    selectedProcess.remainingBurstTime -= 1;
    currentTime += 1;

    // Check if process just finished
    if (selectedProcess.remainingBurstTime === 0) {
      // Close out block
      ganttBlocks.push({
        pid: currentExecutingProcess,
        startTime: blockStartTime,
        endTime: currentTime,
      });
      currentExecutingProcess = null;

      // Finalize metrics
      const originalBlock = processes.find(
        (p) => p.pid === selectedProcess.pid,
      )!;
      const completionTime = currentTime;
      const turnaroundTime = completionTime - originalBlock.arrivalTime;
      const waitingTime = turnaroundTime - originalBlock.burstTime; // Precise formula for preemptive

      metricsMap.set(selectedProcess.pid, {
        pid: selectedProcess.pid,
        waitingTime,
        turnaroundTime,
        completionTime,
      });
    }
  }

  // Ensure any hanging process block is pushed (safeguard)
  if (currentExecutingProcess !== null) {
    ganttBlocks.push({
      pid: currentExecutingProcess,
      startTime: blockStartTime,
      endTime: currentTime,
    });
  }

  // Coalesce continuous Gantt blocks of the same process into single blocks for a cleaner chart
  const coalescedBlocks: GanttBlock[] = [];
  for (const block of ganttBlocks) {
    if (coalescedBlocks.length > 0) {
      const lastBlock = coalescedBlocks[coalescedBlocks.length - 1];
      if (
        lastBlock.pid === block.pid &&
        lastBlock.endTime === block.startTime
      ) {
        lastBlock.endTime = block.endTime; // Extend existing
        continue;
      }
    }
    coalescedBlocks.push(block);
  }

  const finalMetrics = processes.map((p) => metricsMap.get(p.pid)!);

  return {
    ganttBlocks: coalescedBlocks,
    metrics: finalMetrics,
  };
}
