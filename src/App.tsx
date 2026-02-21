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
              {simulationResult ? (
                <SimulationView
                  processes={processes}
                  selectedAlgorithm={selectedAlgorithm}
                  quantum={quantum}
                  simulationResult={simulationResult}
                />
              ) : (
                <div className="flex-1 flex flex-col gap-6 opacity-70">
                  <div className="flex justify-center shrink-0">
                    <div className="relative flex p-1 bg-muted/20 rounded-full border border-border/30 w-[200px] h-10 animate-pulse" />
                  </div>

                  <div className="flex flex-col gap-6 flex-1 min-h-0">
                    <div className="flex flex-col md:flex-row gap-4 mb-2 shrink-0">
                      <div className="flex-1 rounded-xl bg-muted/10 border border-dashed border-border/50 h-[100px] animate-pulse" />
                      <div className="w-full md:w-[200px] rounded-xl bg-muted/10 border border-dashed border-border/50 h-[100px] animate-pulse" />
                    </div>

                    <div className="rounded-xl bg-muted/10 border border-border/20 h-[150px] animate-pulse shrink-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="mb-3 p-3 bg-muted/20 rounded-full inline-block">
                          <svg
                            className="h-6 w-6 text-muted-foreground/40"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <h3 className="text-base font-medium text-foreground/70">
                          No active simulation
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground max-w-[250px] mx-auto">
                          Add processes in the configuration panel on the left
                          and click "Start Simulation"
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 rounded-xl bg-muted/10 border border-border/20 min-h-[150px] animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
