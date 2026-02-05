import type { ProcessInput, AlgorithmResult, GanttBlock, ProcessMetrics } from '../types/process';

export function srtf(processes: ProcessInput[]): AlgorithmResult {
  if (processes.length === 0) {
    return {
      ganttBlocks: [],
      metrics: [],
    };
  }

  const ganttBlocks: GanttBlock[] = [];
  const metrics: ProcessMetrics[] = [];
  let currentTime = 0;

  // Create a copy of processes with remaining burst time
  const remainingProcesses = processes.map((p) => ({
    ...p,
    remainingBurstTime: p.burstTime,
    firstStartTime: -1 as number | -1,
  }));

  // Sort by arrival time initially
  remainingProcesses.sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return a.pid.localeCompare(b.pid);
  });

  const readyQueue: typeof remainingProcesses = [];
  let processIndex = 0;

  while (
    processIndex < remainingProcesses.length ||
    readyQueue.length > 0 ||
    remainingProcesses.some((p) => p.remainingBurstTime > 0)
  ) {
    // Add processes that have arrived to ready queue
    while (
      processIndex < remainingProcesses.length &&
      remainingProcesses[processIndex].arrivalTime <= currentTime
    ) {
      const process = remainingProcesses[processIndex];
      readyQueue.push(process);
      processIndex++;
    }

    // Sort ready queue by remaining time (SRTF)
    readyQueue.sort((a, b) => {
      if (a.remainingBurstTime !== b.remainingBurstTime) {
        return a.remainingBurstTime - b.remainingBurstTime;
      }
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }
      return a.pid.localeCompare(b.pid);
    });

    if (readyQueue.length === 0) {
      // CPU is idle, find next arriving process
      if (processIndex < remainingProcesses.length) {
        const nextProcess = remainingProcesses[processIndex];
        ganttBlocks.push({
          pid: 'IDLE',
          startTime: currentTime,
          endTime: nextProcess.arrivalTime,
        });
        currentTime = nextProcess.arrivalTime;
      } else {
        break;
      }
    } else {
      // Pick the process with the shortest remaining time
      const selectedProcess = readyQueue[0];

      // Track first start time
      if (selectedProcess.firstStartTime === -1) {
        selectedProcess.firstStartTime = currentTime;
      }

      // Execute for 1 time unit (preemptive)
      const executionTime = 1;
      const startTime = currentTime;
      const endTime = startTime + executionTime;

      ganttBlocks.push({
        pid: selectedProcess.pid,
        startTime: startTime,
        endTime: endTime,
      });

      selectedProcess.remainingBurstTime -= executionTime;
      currentTime = endTime;

      // Remove completed process from queue
      if (selectedProcess.remainingBurstTime <= 0) {
        readyQueue.shift();
      }

      // Add newly arrived processes during execution
      while (
        processIndex < remainingProcesses.length &&
        remainingProcesses[processIndex].arrivalTime <= currentTime
      ) {
        const process = remainingProcesses[processIndex];
        readyQueue.push(process);
        processIndex++;
      }
    }
  }

  // Merge consecutive blocks with same PID
  const mergedBlocks: GanttBlock[] = [];
  for (let i = 0; i < ganttBlocks.length; i++) {
    const currentBlock = ganttBlocks[i];
    if (
      mergedBlocks.length > 0 &&
      mergedBlocks[mergedBlocks.length - 1].pid === currentBlock.pid &&
      mergedBlocks[mergedBlocks.length - 1].endTime === currentBlock.startTime
    ) {
      mergedBlocks[mergedBlocks.length - 1].endTime = currentBlock.endTime;
    } else {
      mergedBlocks.push({ ...currentBlock });
    }
  }

  // Calculate metrics for each process
  processes.forEach((process) => {
    const processData = remainingProcesses.find((p) => p.pid === process.pid);
    if (!processData) return;

    const processBlocks = mergedBlocks.filter((b) => b.pid === process.pid);

    if (processBlocks.length > 0) {
      const completionTime = processBlocks[processBlocks.length - 1].endTime;
      const waitingTime = (processData.firstStartTime || 0) - process.arrivalTime;
      const turnaroundTime = completionTime - process.arrivalTime;

      metrics.push({
        pid: process.pid,
        waitingTime: Math.max(0, waitingTime),
        turnaroundTime,
        completionTime,
      });
    }
  });

  return {
    ganttBlocks: mergedBlocks,
    metrics: metrics.sort((a, b) => {
      const aIndex = processes.findIndex((p) => p.pid === a.pid);
      const bIndex = processes.findIndex((p) => p.pid === b.pid);
      return aIndex - bIndex;
    }),
  };
}
