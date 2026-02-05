import type { ProcessInput } from '../types/process';

export function encodeProcessesToUrl(processes: ProcessInput[]): string {
  return encodeURIComponent(JSON.stringify(processes));
}

export function decodeProcessesFromUrl(encoded: string): ProcessInput[] | null {
  try {
    const decoded = decodeURIComponent(encoded);
    const parsed = JSON.parse(decoded);
    if (Array.isArray(parsed)) {
      return parsed as ProcessInput[];
    }
    return null;
  } catch {
    return null;
  }
}

export function getUrlState(): { processes?: ProcessInput[]; algorithm?: string; quantum?: number } {
  if (typeof window === 'undefined') {
    return {};
  }
  const params = new URLSearchParams(window.location.search);
  const state: { processes?: ProcessInput[]; algorithm?: string; quantum?: number } = {};

  const processesParam = params.get('processes');
  if (processesParam) {
    const decoded = decodeProcessesFromUrl(processesParam);
    if (decoded) {
      state.processes = decoded;
    }
  }

  const algorithm = params.get('algo');
  if (algorithm) {
    state.algorithm = algorithm;
  }

  const quantum = params.get('quantum');
  if (quantum) {
    const parsed = parseInt(quantum);
    if (!isNaN(parsed)) {
      state.quantum = parsed;
    }
  }

  return state;
}

export function updateUrlState(processes: ProcessInput[], algorithm?: string, quantum?: number): void {
  if (typeof window === 'undefined') {
    return;
  }
  const params = new URLSearchParams(window.location.search);

  if (processes.length > 0) {
    params.set('processes', encodeProcessesToUrl(processes));
  } else {
    params.delete('processes');
  }

  if (algorithm) {
    params.set('algo', algorithm);
  } else {
    params.delete('algo');
  }

  if (quantum !== undefined && algorithm === 'roundRobin') {
    params.set('quantum', String(quantum));
  } else {
    params.delete('quantum');
  }

  const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}
