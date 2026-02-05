import type { ProcessInput, AlgorithmResult, GanttBlock, ProcessMetrics } from '../types/process';

export function fcfs(processes: ProcessInput[]): AlgorithmResult {
  if (processes.length === 0) {
    return {
      ganttBlocks: [],
      metrics: [],
    };
  }

  // Sort processes by arrival time
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    // If arrival times are equal, maintain original order (by PID)
    return a.pid.localeCompare(b.pid);
  });

  const ganttBlocks: GanttBlock[] = [];
  const metrics: ProcessMetrics[] = [];
  let currentTime = 0;

  for (let i = 0; i < sortedProcesses.length; i++) {
    const process = sortedProcesses[i];

    // Handle CPU idle time if process hasn't arrived yet
    if (currentTime < process.arrivalTime) {
      ganttBlocks.push({
        pid: 'IDLE',
        startTime: currentTime,
        endTime: process.arrivalTime,
      });
      currentTime = process.arrivalTime;
    }

    // Process the current process
    const startTime = currentTime;
    const completionTime = currentTime + process.burstTime;
    
    ganttBlocks.push({
      pid: process.pid,
      startTime: startTime,
      endTime: completionTime,
    });

    // Calculate metrics
    const waitingTime = startTime - process.arrivalTime;
    const turnaroundTime = completionTime - process.arrivalTime;

    metrics.push({
      pid: process.pid,
      waitingTime,
      turnaroundTime,
      completionTime,
    });

    currentTime = completionTime;
  }

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
