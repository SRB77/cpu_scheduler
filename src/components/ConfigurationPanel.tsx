import { useState } from "react";
import type { ProcessInput } from "../types/process";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Select } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Play, Lock, Plus, Dices, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateRandomColor } from "../utils/colors";
import { cn } from "../utils/cn";

interface ConfigurationPanelProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (algorithm: string) => void;
  quantum: number;
  onQuantumChange: (quantum: number) => void;
  onRunSimulation: () => void;
  processes: ProcessInput[];
  onAddProcess: (process: ProcessInput) => void;
  onDeleteProcess: (pid: string) => void;
  onRandomGenerate: (processes: ProcessInput[]) => void;
  onClearAll: () => void;
}

const algorithms = [
  { value: "fcfs", label: "First Come First Serve (FCFS)" },
  { value: "sjf", label: "Shortest Job First (SJF)" },
  { value: "roundRobin", label: "Round Robin (RR)" },
  { value: "priority", label: "Priority (Non-Preemptive)" },
  { value: "priorityPreemptive", label: "Priority (Preemptive)" },
  { value: "srtf", label: "Shortest Remaining Time First (SRTF)" },
];

const algorithmDescriptions: Record<string, string> = {
  fcfs: "The simplest method! Like a queue at a grocery store, the first process to arrive is the first one served until it finishes. It's perfectly fair, but extremely long jobs can severely delay shorter ones behind them.",
  sjf: "Looks at all waiting jobs and smartly picks the one that will finish the fastest. This keeps the average waiting time very low, but longer jobs might get stuck waiting forever in the queue.",
  roundRobin:
    "Takes turns! Every process gets a small, equal slice of CPU time (called a quantum). If it doesn't finish, it goes to the back of the line. Excellent for keeping computers feeling responsive.",
  priority:
    "Important tasks go first! Processes are assigned a priority (lower number = more important). Once a task starts running, it cannot be interrupted until it's completely done.",
  priorityPreemptive:
    "Highly important tasks go first, and they can interrupt! If an extremely important task arrives while a less important one is running, the CPU immediately switches to the new critical task.",
  srtf: "The preemptive version of SJF. If a new job arrives that can finish faster than the one currently running, the CPU stops the current job and switches to the faster one.",
};

export default function ConfigurationPanel({
  selectedAlgorithm,
  onAlgorithmChange,
  quantum,
  onQuantumChange,
  onRunSimulation,
  processes,
  onAddProcess,
  onDeleteProcess,
  onRandomGenerate,
  onClearAll,
}: ConfigurationPanelProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Process Form State
  const [arrivalTime, setArrivalTime] = useState<string>("0");
  const [burstTime, setBurstTime] = useState<string>("1");
  const [priorityInput, setPriorityInput] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateInputs = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const arrival = parseFloat(arrivalTime);
    if (arrivalTime === "" || isNaN(arrival) || arrival < 0) {
      newErrors.arrivalTime = "Must be ≥ 0";
    }
    if (arrival > 100) {
      newErrors.arrivalTime = "Must be ≤ 100";
    }
    const burst = parseFloat(burstTime);
    if (burstTime === "" || isNaN(burst) || burst <= 0) {
      newErrors.burstTime = "Must be > 0";
    }
    if (burst > 100) {
      newErrors.burstTime = "Must be ≤ 100";
    }
    if (priorityInput !== "") {
      const priorityNum = parseInt(priorityInput);
      if (isNaN(priorityNum) || priorityNum < 0) {
        newErrors.priority = "Must be ≥ 0";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const processId = `P${processes.length + 1}`;
    const newProcess: ProcessInput = {
      pid: processId,
      arrivalTime: parseFloat(arrivalTime),
      burstTime: parseFloat(burstTime),
      priority: priorityInput !== "" ? parseInt(priorityInput) : undefined,
      background: generateRandomColor(),
    };

    onAddProcess(newProcess);
    setArrivalTime("0");
    setBurstTime("1");
    setPriorityInput("");
    setErrors({});
  };

  const generateRandom = () => {
    const numProcesses = Math.floor(Math.random() * 3) + 3;
    const newProcesses: ProcessInput[] = [];
    for (let i = 0; i < numProcesses; i++) {
      newProcesses.push({
        pid: `P${i + 1}`,
        arrivalTime: Math.floor(Math.random() * 10),
        burstTime: Math.floor(Math.random() * 10) + 1,
        background: generateRandomColor(),
      });
    }
    newProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
    newProcesses.forEach((process, index) => {
      process.pid = `P${index + 1}`;
    });
    onRandomGenerate(newProcesses);
  };

  return (
    <Card className="bg-card border-white/10 shadow-xl overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-4 border-b border-border/40 bg-muted/20 shrink-0">
        <CardTitle className="text-xl font-bold tracking-tight">
          Configuration
        </CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* --- ALGORITHM SELECTION --- */}
        <div className="space-y-4">
          <div className="space-y-3">
            <Label
              htmlFor="algorithm"
              className="text-sm font-semibold opacity-90 block mb-1"
            >
              Scheduling Algorithm
            </Label>
            <Select
              id="algorithm"
              value={selectedAlgorithm}
              onChange={(val) => {
                onAlgorithmChange(val);
                setIsRevealed(false);
              }}
              options={algorithms}
              className="bg-background border-input hover:border-border transition-all w-full text-foreground h-10 px-3 py-2 rounded-md"
            />
          </div>

          <div className="relative group">
            <Label className="text-sm font-semibold opacity-80 mb-2 block">
              Algorithm Details
            </Label>
            <div
              className="relative rounded-xl border border-border bg-muted/20 p-4 min-h-[80px] flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-muted/30"
              onClick={() => setIsRevealed(!isRevealed)}
            >
              <AnimatePresence mode="wait">
                {!isRevealed ? (
                  <motion.div
                    key="hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 backdrop-blur-md bg-background/40"
                  >
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                      Click to reveal details
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.p
                animate={{
                  filter: isRevealed ? "blur(0px)" : "blur(4px)",
                  opacity: isRevealed ? 1 : 0.5,
                }}
                className="text-sm text-foreground leading-relaxed text-center"
              >
                {algorithmDescriptions[selectedAlgorithm]}
              </motion.p>
            </div>
          </div>

          {selectedAlgorithm === "roundRobin" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 pt-2"
            >
              <Label
                htmlFor="quantum"
                className="text-sm font-semibold opacity-90 block mb-1"
              >
                Time Quantum
              </Label>
              <Input
                id="quantum"
                type="number"
                value={quantum}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    onQuantumChange(value);
                  }
                }}
                min="0.1"
                step="0.1"
                placeholder="2"
              />
            </motion.div>
          )}
        </div>

        <div className="h-px w-full bg-border/40 my-2" />

        {/* --- PROCESS CREATION --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold opacity-90">
              Add Process
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={generateRandom}
            >
              <Dices className="h-3.5 w-3.5" />
              Random
            </Button>
          </div>

          <form onSubmit={handleAddProcess} className="gap-3 flex items-start">
            <div className="grid grid-cols-3 gap-2 flex-1">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground block text-center">
                  Arrival
                </Label>
                <Input
                  type="number"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  min="0"
                  max="100"
                  className={cn(
                    "h-9 px-2 text-center",
                    errors.arrivalTime && "border-destructive",
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground block text-center">
                  Burst
                </Label>
                <Input
                  type="number"
                  value={burstTime}
                  onChange={(e) => setBurstTime(e.target.value)}
                  min="1"
                  max="100"
                  className={cn(
                    "h-9 px-2 text-center",
                    errors.burstTime && "border-destructive",
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground block text-center">
                  Priority
                </Label>
                <Input
                  type="number"
                  value={priorityInput}
                  onChange={(e) => setPriorityInput(e.target.value)}
                  min="0"
                  placeholder="-"
                  className={cn(
                    "h-9 px-2 text-center",
                    errors.priority && "border-destructive",
                  )}
                />
              </div>
            </div>
            <div className="pt-5 shrink-0">
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9"
                title="Add Process"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </form>
          {(errors.arrivalTime || errors.burstTime || errors.priority) && (
            <p className="text-[10px] text-destructive mt-1">
              Please fix invalid inputs.
            </p>
          )}
        </div>

        {/* --- PROCESS LIST --- */}
        <div className="flex flex-col min-h-[150px]">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold opacity-90">
              Process List
              {processes.length > 0 && (
                <span className="ml-1 opacity-70">({processes.length})</span>
              )}
            </Label>
            {processes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-7 text-xs px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 border border-border/50 rounded-md p-2 bg-muted/10">
            {processes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No processes add yet.
              </div>
            ) : (
              processes.map((p) => (
                <div
                  key={p.pid}
                  className="flex items-center justify-between bg-background border border-border rounded p-2 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-white"
                      style={{ background: p.background || "#000" }}
                    >
                      {p.pid}
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-muted-foreground">
                        A:{" "}
                        <span className="text-foreground font-medium">
                          {p.arrivalTime}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        B:{" "}
                        <span className="text-foreground font-medium">
                          {p.burstTime}
                        </span>
                      </span>
                      {p.priority !== undefined && (
                        <span className="text-muted-foreground">
                          P:{" "}
                          <span className="text-foreground font-medium">
                            {p.priority}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteProcess(p.pid)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded-sm hover:bg-destructive/10 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- START SIMULATION --- */}
      <div className="p-6 pt-4 border-t border-border/40 shrink-0 bg-card">
        <Button
          onClick={onRunSimulation}
          disabled={processes.length === 0}
          className="w-full gap-2 h-12 text-base font-bold transition-all bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
          size="lg"
        >
          <Play className="h-4 w-4 fill-current" />
          Start Simulation
        </Button>
      </div>
    </Card>
  );
}
