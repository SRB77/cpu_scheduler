import type { ProcessInput, AlgorithmResult, GanttBlock, ProcessMetrics } from '../types/process';

export function priority(processes: ProcessInput[]): AlgorithmResult {
  if (processes.length === 0) {
    return {
      ganttBlocks: [],
      metrics: [],
    };
  }

  // Validate all processes have priority
  if (processes.some(p => p.priority === undefined)) {
    return {
      ganttBlocks: [],
      metrics: [],
    };
  }

  const ganttBlocks: GanttBlock[] = [];
  const metrics: ProcessMetrics[] = [];
  let currentTime = 0;

  // Create a copy of processes with remaining burst time
  const remainingProcesses = processes.map(p => ({
    ...p,
    remainingBurstTime: p.burstTime,
    priority: p.priority!,
  }));

  while (remainingProcesses.some(p => p.remainingBurstTime > 0)) {
    // Find processes that have arrived and have remaining burst time
    const availableProcesses = remainingProcesses.filter(
      p => p.arrivalTime <= currentTime && p.remainingBurstTime > 0
    );

    if (availableProcesses.length === 0) {
      // CPU is idle, find next arriving process
      const nextProcess = remainingProcesses
        .filter(p => p.remainingBurstTime > 0)
        .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      
      if (nextProcess) {
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
      // Select process with highest priority (lower number = higher priority)
      // If tie, select by arrival time, then by PID
      const selectedProcess = availableProcesses.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        if (a.arrivalTime !== b.arrivalTime) {
          return a.arrivalTime - b.arrivalTime;
        }
        return a.pid.localeCompare(b.pid);
      })[0];

      const startTime = currentTime;
      const executionTime = selectedProcess.remainingBurstTime;
      const endTime = currentTime + executionTime;

      ganttBlocks.push({
        pid: selectedProcess.pid,
        startTime: startTime,
        endTime: endTime,
      });

      // Update remaining burst time
      selectedProcess.remainingBurstTime = 0;
      currentTime = endTime;
    }
  }

  // Calculate metrics for each process
  processes.forEach(process => {
    // Find first and last occurrence of this process in Gantt chart
    const processBlocks = ganttBlocks.filter(b => b.pid === process.pid);
    
    if (processBlocks.length > 0) {
      const firstStart = processBlocks[0].startTime;
      const lastEnd = processBlocks[processBlocks.length - 1].endTime;
      const completionTime = lastEnd;
      
      const waitingTime = firstStart - process.arrivalTime;
      const turnaroundTime = completionTime - process.arrivalTime;

      metrics.push({
        pid: process.pid,
        waitingTime,
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
