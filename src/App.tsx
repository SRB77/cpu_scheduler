import { useState, useEffect, useRef } from "react";
import type { ProcessInput, AlgorithmResult } from "./types/process";
import ConfigurationPanel from "./components/ConfigurationPanel";
import SimulationView from "./components/SimulationView";
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
import { priorityPreemptive } from "./algorithms/priorityPreemptive";
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

    if (
      selectedAlgorithm === "priority" ||
      selectedAlgorithm === "priorityPreemptive"
    ) {
      const missingPriority = processes.some((p) => p.priority === undefined);
      if (missingPriority) {
        toast.error(
          "Please add priority for all processes when using a Priority algorithm.",
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
        case "priorityPreemptive":
          result = priorityPreemptive(processes);
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
    <div className="min-h-screen bg-background flex flex-col relative font-sans">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 z-0 pointer-events-none"
        quantity={100}
        ease={80}
        color={particleColor}
        refresh
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="py-4 shrink-0">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-2">
              <HyperText
                className="md:text-2xl text-xl font-bold gap-3"
                text="CPU Scheduling Simulator"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full bg-muted/50 hover:bg-muted"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="flex-1 container mx-auto px-4 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel — Configuration (Inverted Rectangular Vertical Panel) */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="flex-1 min-h-0">
                <ConfigurationPanel
                  selectedAlgorithm={selectedAlgorithm}
                  onAlgorithmChange={setSelectedAlgorithm}
                  quantum={quantum}
                  onQuantumChange={setQuantum}
                  onRunSimulation={handleRunSimulation}
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
              <div className="flex justify-center shrink-0">
                <ShareButton
                  processes={processes}
                  algorithm={selectedAlgorithm}
                  quantum={quantum}
                />
              </div>
            </div>

            {/* Right Panel — Results / Visualization Stack */}
            <div className="lg:col-span-2 flex flex-col gap-6 pt-1">
              <SimulationView
                processes={processes}
                selectedAlgorithm={selectedAlgorithm}
                quantum={quantum}
                simulationResult={simulationResult}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-foreground/60 w-full shrink-0 relative z-10">
        <p className="flex items-center justify-center gap-2">
          Created by
          <a
            href="https://github.com/srb77"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Soumyaranjan
          </a>
          <span>&</span>
          <a
            href="https://github.com/nox-pie"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Prashant
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
