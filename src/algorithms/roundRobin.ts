import type { ProcessInput, AlgorithmResult, GanttBlock, ProcessMetrics } from '../types/process';

export function roundRobin(processes: ProcessInput[], quantum: number): AlgorithmResult {
  if (processes.length === 0 || quantum <= 0) {
    return {
      ganttBlocks: [],
      metrics: [],
    };
  }

  const ganttBlocks: GanttBlock[] = [];
  const metrics: ProcessMetrics[] = [];
  let currentTime = 0;

  // Create a copy of processes with remaining burst time
  const processQueue = processes.map(p => ({
    ...p,
    remainingBurstTime: p.burstTime,
    firstStartTime: -1, // Track when process first starts
  }));

  // Sort by arrival time initially
  processQueue.sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return a.pid.localeCompare(b.pid);
  });

  const readyQueue: typeof processQueue = [];
  let processIndex = 0;

  while (
    processIndex < processQueue.length ||
    readyQueue.length > 0 ||
    processQueue.some(p => p.remainingBurstTime > 0)
  ) {
    // Add processes that have arrived to ready queue
    while (
      processIndex < processQueue.length &&
      processQueue[processIndex].arrivalTime <= currentTime
    ) {
      readyQueue.push(processQueue[processIndex]);
      processIndex++;
    }

    if (readyQueue.length === 0) {
      // CPU is idle, find next arriving process
      if (processIndex < processQueue.length) {
        const nextProcess = processQueue[processIndex];
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
      // Get next process from ready queue
      const currentProcess = readyQueue.shift()!;

      // Track first start time
      if (currentProcess.firstStartTime === -1) {
        currentProcess.firstStartTime = currentTime;
      }

      const startTime = currentTime;
      const executionTime = Math.min(currentProcess.remainingBurstTime, quantum);
      const endTime = startTime + executionTime;

      ganttBlocks.push({
        pid: currentProcess.pid,
        startTime: startTime,
        endTime: endTime,
      });

      currentProcess.remainingBurstTime -= executionTime;
      currentTime = endTime;

      // Add processes that arrived during execution
      while (
        processIndex < processQueue.length &&
        processQueue[processIndex].arrivalTime <= currentTime
      ) {
        readyQueue.push(processQueue[processIndex]);
        processIndex++;
      }

      // If process still has remaining burst time, add it back to ready queue
      if (currentProcess.remainingBurstTime > 0) {
        readyQueue.push(currentProcess);
      }
    }
  }

  // Calculate metrics for each process
  processes.forEach(process => {
    const processData = processQueue.find(p => p.pid === process.pid);
    if (!processData) return;

    const processBlocks = ganttBlocks.filter(b => b.pid === process.pid);
    
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
    ganttBlocks,
    metrics: metrics.sort((a, b) => {
      // Sort metrics by original process order
      const aIndex = processes.findIndex(p => p.pid === a.pid);
      const bIndex = processes.findIndex(p => p.pid === b.pid);
      return aIndex - bIndex;
    }),
  };
}
