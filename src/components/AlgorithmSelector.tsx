import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Play } from "lucide-react";

interface AlgorithmSelectorProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (algorithm: string) => void;
  quantum: number;
  onQuantumChange: (quantum: number) => void;
  onRunSimulation: () => void;
  disabled?: boolean;
}

const algorithms = [
  { value: "fcfs", label: "First Come First Serve (FCFS)" },
  { value: "sjf", label: "Shortest Job First (SJF)" },
  { value: "roundRobin", label: "Round Robin (RR)" },
  { value: "priority", label: "Priority" },
  { value: "srtf", label: "Shortest Remaining Time First (SRTF)" },
];

const algorithmDescriptions: Record<string, string> = {
  fcfs: "Processes are executed in the order they arrive. Simple but may cause long waiting times.",
  sjf: "Executes the shortest job first. Minimizes average waiting time but may cause starvation.",
  roundRobin:
    "Each process gets a fixed time quantum in circular order. Fair and responsive for time-sharing systems.",
  priority:
    "Processes are executed based on priority. Lower number means higher priority. May cause starvation.",
  srtf: "Preemptive version of SJF. Always executes the process with the shortest remaining time.",
};

export default function AlgorithmSelector({
  selectedAlgorithm,
  onAlgorithmChange,
  quantum,
  onQuantumChange,
  onRunSimulation,
  disabled = false,
}: AlgorithmSelectorProps) {
  const [descriptionRevealed, setDescriptionRevealed] = useState(false);

  return (
    <Card className="bg-card border-white/10 shadow-sm">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle className="text-xl font-bold tracking-tight">
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-3">
          <Label htmlFor="algorithm" className="text-sm font-medium">
            Scheduling Algorithm
          </Label>
          <div className="relative">
            <Select
              id="algorithm"
              value={selectedAlgorithm}
              onChange={(e) => {
                onAlgorithmChange(e.target.value);
                setDescriptionRevealed(false);
              }}
              className="w-full bg-muted/50 border-border/50 focus:ring-primary/20 h-10"
            >
              {algorithms.map((algo) => (
                <option key={algo.value} value={algo.value}>
                  {algo.label}
                </option>
              ))}
            </Select>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full justify-between px-3 py-2 h-auto text-xs font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => setDescriptionRevealed(!descriptionRevealed)}
          >
            <span>
              {descriptionRevealed ? "Hide details" : "Show algorithm details"}
            </span>
            {descriptionRevealed ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>

          {descriptionRevealed && (
            <div className="p-3 bg-muted/30 rounded-md text-xs text-muted-foreground animate-fade-in border border-border/50 leading-relaxed">
              {algorithmDescriptions[selectedAlgorithm]}
            </div>
          )}
        </div>

        {selectedAlgorithm === "roundRobin" && (
          <div className="space-y-3 animate-fade-in">
            <Label htmlFor="quantum" className="text-sm font-medium">
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
              placeholder="e.g. 2"
              className="bg-muted/50 border-border/50 focus:ring-primary/20"
            />
            <p className="text-[10px] text-muted-foreground">
              Time slice for each process execution
            </p>
          </div>
        )}

        <div className="pt-2">
          <Button
            onClick={onRunSimulation}
            disabled={disabled}
            className="w-full gap-2 h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
            size="lg"
          >
            <Play className="h-4 w-4 fill-current" />
            Start Simulation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
