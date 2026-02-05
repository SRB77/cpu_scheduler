export interface ProcessInput {
  pid: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  background?: string; // Color or gradient for visualization
}

export interface GanttBlock {
  pid: string | 'IDLE';
  startTime: number;
  endTime: number;
}

export interface ProcessMetrics {
  pid: string;
  waitingTime: number;
  turnaroundTime: number;
  completionTime: number;
}

export interface AlgorithmResult {
  ganttBlocks: GanttBlock[];
  metrics: ProcessMetrics[];
}
