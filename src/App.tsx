import { useState, useEffect, useRef } from "react";
import type { ProcessInput, AlgorithmResult } from "./types/process";
import AlgorithmSelector from "./components/AlgorithmSelector";
import GanttChart from "./components/GanttChart";
import MetricsTable from "./components/MetricsTable";
import ProcessPanel from "./components/ProcessPanel";
import ShareButton from "./components/ShareButton";
import HyperText from "./components/HyperText";
import Particles from "./components/Particles";
import { Button } from "./components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./contexts/ThemeContext";
import { toast } from "react-toastify";
import { fcfs } from "./algorithms/fcfs";
import { sjf } from "./algorithms/sjf";
import { roundRobin } from "./algorithms/roundRobin";
import { priority } from "./algorithms/priority";
import { srtf } from "./algorithms/srtf";
import { getUrlState, updateUrlState } from "./utils/urlState";
import { generateRandomColor } from "./utils/colors";

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
      return urlState.algorithm || "fcfs";
    } catch {
      return "fcfs";
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
  const [simulationResult, setSimulationResult] =
    useState<AlgorithmResult | null>(null);
  const isInitializedRef = useRef(false);

  // Update URL when state changes (skip initial mount)
  useEffect(() => {
    if (isInitializedRef.current) {
      try {
        updateUrlState(processes, selectedAlgorithm, quantum);
      } catch (error) {
        console.error("Error updating URL state:", error);
      }
    } else {
      isInitializedRef.current = true;
    }
  }, [processes, selectedAlgorithm, quantum]);

  const handleAddProcess = (process: ProcessInput) => {
    const existingIndex = processes.findIndex((p) => p.pid === process.pid);
    if (existingIndex >= 0) {
      setProcesses(processes.map((p) => (p.pid === process.pid ? process : p)));
      toast.success("Process updated successfully!");
    } else {
      const newProcess = {
        ...process,
        background: process.background || generateRandomColor(),
      };
      setProcesses([...processes, newProcess]);
      toast.success("Process added successfully!");
    }
    setSimulationResult(null);
  };

  const handleDeleteProcess = (pid: string) => {
    setProcesses(processes.filter((p) => p.pid !== pid));
    setSimulationResult(null);
    toast.success("Process deleted successfully!");
  };

  const handleRandomGenerate = (newProcesses: ProcessInput[]) => {
    setProcesses(newProcesses);
    setSimulationResult(null);
  };

  const handleRunSimulation = () => {
    if (processes.length === 0) {
      toast.error("Please add at least one process before running simulation.");
      return;
    }

    if (selectedAlgorithm === "roundRobin" && quantum <= 0) {
      toast.error(
        "Please enter a valid time quantum for Round Robin algorithm.",
      );
      return;
    }

    if (selectedAlgorithm === "priority") {
      const missingPriority = processes.some((p) => p.priority === undefined);
      if (missingPriority) {
        toast.error(
          "Please add priority for all processes when using Priority algorithm.",
        );
        return;
      }
    }

    let result: AlgorithmResult;

    try {
      switch (selectedAlgorithm) {
        case "fcfs":
          result = fcfs(processes);
          break;
        case "sjf":
          result = sjf(processes);
          break;
        case "roundRobin":
          result = roundRobin(processes, quantum);
          break;
        case "priority":
          result = priority(processes);
          break;
        case "srtf":
          result = srtf(processes);
          break;
        default:
          result = { ganttBlocks: [], metrics: [] };
      }
      setSimulationResult(result);
      toast.success("Simulation completed successfully!");
    } catch (error) {
      console.error("Simulation error:", error);
      toast.error("An error occurred during simulation.");
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const particleColor = resolvedTheme === "dark" ? "#ffffff" : "#000000";

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={particleColor}
        refresh
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-end mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
            <div className="w-full flex justify-center pb-2">
              <HyperText
                className="md:text-4xl text-2xl font-bold text-center"
                text="Scheduling Algorithm Simulator"
              />
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="flex-1 container mx-auto px-4 py-4">
          <div className="space-y-8">
            {/* Two-Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel — Algorithm Selector + Submit */}
              <div className="space-y-4">
                <AlgorithmSelector
                  selectedAlgorithm={selectedAlgorithm}
                  onAlgorithmChange={setSelectedAlgorithm}
                  quantum={quantum}
                  onQuantumChange={setQuantum}
                  onRunSimulation={handleRunSimulation}
                  disabled={processes.length === 0}
                />
                <div className="flex gap-2">
                  <ShareButton
                    processes={processes}
                    algorithm={selectedAlgorithm}
                    quantum={quantum}
                  />
                </div>
              </div>

              {/* Right Panel — Processes */}
              <ProcessPanel
                processes={processes}
                onAddProcess={handleAddProcess}
                onDeleteProcess={handleDeleteProcess}
                onRandomGenerate={handleRandomGenerate}
                onClearAll={() => {
                  setProcesses([]);
                  setSimulationResult(null);
                  toast.success("All processes cleared!");
                }}
              />
            </div>

            {/* Results Section */}
            {simulationResult && (
              <div className="space-y-6 animate-slide-up">
                <GanttChart
                  ganttBlocks={simulationResult.ganttBlocks}
                  processes={processes}
                />
                <MetricsTable
                  metrics={simulationResult.metrics}
                  processes={processes}
                  ganttBlocks={simulationResult.ganttBlocks}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
