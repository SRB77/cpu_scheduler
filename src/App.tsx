import { useState, useEffect, useRef } from 'react';
import type { ProcessInput, AlgorithmResult } from './types/process';
import ProcessForm from './components/ProcessForm';
import ProcessTable from './components/ProcessTable';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import MetricsTable from './components/MetricsTable';
import RandomGenerator from './components/RandomGenerator';
import ShareButton from './components/ShareButton';
import { Button } from './components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { toast } from 'react-toastify';
import { fcfs } from './algorithms/fcfs';
import { sjf } from './algorithms/sjf';
import { roundRobin } from './algorithms/roundRobin';
import { priority } from './algorithms/priority';
import { srtf } from './algorithms/srtf';
import { getUrlState, updateUrlState } from './utils/urlState';
import { generateRandomColor } from './utils/colors';

function App() {
  const { resolvedTheme, setTheme } = useTheme();
  
  // Initialize state from URL using lazy initialization
  const [processes, setProcesses] = useState<ProcessInput[]>(() => {
    try {
      const urlState = getUrlState();
      return urlState.processes || [];
    } catch {
      return [];
    }
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(() => {
    try {
      const urlState = getUrlState();
      return urlState.algorithm || 'fcfs';
    } catch {
      return 'fcfs';
    }
  });
  const [quantum, setQuantum] = useState<number>(() => {
    try {
      const urlState = getUrlState();
      return urlState.quantum || 2;
    } catch {
      return 2;
    }
  });
  const [simulationResult, setSimulationResult] = useState<AlgorithmResult | null>(null);
  const [editingProcess, setEditingProcess] = useState<ProcessInput | null>(null);
  const isInitializedRef = useRef(false);

  // Update URL when state changes (skip initial mount)
  useEffect(() => {
    if (isInitializedRef.current) {
      try {
        updateUrlState(processes, selectedAlgorithm, quantum);
      } catch (error) {
        console.error('Error updating URL state:', error);
      }
    } else {
      isInitializedRef.current = true;
    }
  }, [processes, selectedAlgorithm, quantum]);

  const handleAddProcess = (process: ProcessInput) => {
    if (editingProcess) {
      // Update existing process
      setProcesses(processes.map((p) => (p.pid === process.pid ? process : p)));
      setEditingProcess(null);
      toast.success('Process updated successfully!');
    } else {
      // Add new process
      const newProcess = {
        ...process,
        background: process.background || generateRandomColor(),
      };
      setProcesses([...processes, newProcess]);
      toast.success('Process added successfully!');
    }
    setSimulationResult(null);
  };

  const handleDeleteProcess = (pid: string) => {
    setProcesses(processes.filter((p) => p.pid !== pid));
    setSimulationResult(null);
    toast.success('Process deleted successfully!');
  };

  const handleEditProcess = (process: ProcessInput) => {
    setEditingProcess(process);
  };

  const handleEditComplete = () => {
    setEditingProcess(null);
  };

  const handleRandomGenerate = (newProcesses: ProcessInput[]) => {
    setProcesses(newProcesses);
    setSimulationResult(null);
  };

  const handleRunSimulation = () => {
    if (processes.length === 0) {
      toast.error('Please add at least one process before running simulation.');
      return;
    }

    // Validate inputs based on selected algorithm
    if (selectedAlgorithm === 'roundRobin' && quantum <= 0) {
      toast.error('Please enter a valid time quantum for Round Robin algorithm.');
      return;
    }

    if (selectedAlgorithm === 'priority') {
      const missingPriority = processes.some((p) => p.priority === undefined);
      if (missingPriority) {
        toast.error('Please add priority for all processes when using Priority algorithm.');
        return;
      }
    }

    let result: AlgorithmResult;

    try {
      switch (selectedAlgorithm) {
        case 'fcfs':
          result = fcfs(processes);
          break;
        case 'sjf':
          result = sjf(processes);
          break;
        case 'roundRobin':
          result = roundRobin(processes, quantum);
          break;
        case 'priority':
          result = priority(processes);
          break;
        case 'srtf':
          result = srtf(processes);
          break;
        default:
          result = { ganttBlocks: [], metrics: [] };
      }
      setSimulationResult(result);
      toast.success('Simulation completed successfully!');
    } catch (error) {
      console.error('Simulation error:', error);
      toast.error('An error occurred during simulation.');
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-auto"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
            CPU Scheduling Algorithm Simulator
          </h1>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <RandomGenerator onGenerate={handleRandomGenerate} />
            <ShareButton
              processes={processes}
              algorithm={selectedAlgorithm}
              quantum={quantum}
            />
            <Button
              variant="destructive"
              onClick={() => {
                setProcesses([]);
                setSimulationResult(null);
                toast.success('All processes cleared!');
              }}
              disabled={processes.length === 0}
            >
              Clear All
            </Button>
          </div>

          {/* Process Form and Table Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProcessForm
              onAddProcess={handleAddProcess}
              editingProcess={editingProcess}
              onEditComplete={handleEditComplete}
            />
            <ProcessTable
              processes={processes}
              onDeleteProcess={handleDeleteProcess}
              onEditProcess={handleEditProcess}
            />
          </div>

          {/* Algorithm Selector */}
          <AlgorithmSelector
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={setSelectedAlgorithm}
            quantum={quantum}
            onQuantumChange={setQuantum}
          />

          {/* Run Simulation Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleRunSimulation}
              disabled={processes.length === 0}
              size="lg"
              className="px-8"
            >
              Run Simulation
            </Button>
          </div>

          {/* Results Section */}
          {simulationResult && (
            <div className="space-y-6 animate-fade-in">
              <GanttChart
                ganttBlocks={simulationResult.ganttBlocks}
                processes={processes}
              />
              <MetricsTable metrics={simulationResult.metrics} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            CPU Scheduling Algorithm Simulator - Operating Systems Course
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
