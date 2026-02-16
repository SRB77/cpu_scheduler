import { useState } from "react";
import type { ProcessInput } from "../types/process";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import ColorPicker from "./ColorPicker";
import { generateRandomColor } from "../utils/colors";
import { Plus, Dices, Trash2, X } from "lucide-react";
import { cn } from "../utils/cn";

interface ProcessPanelProps {
  processes: ProcessInput[];
  onAddProcess: (process: ProcessInput) => void;
  onDeleteProcess: (pid: string) => void;
  onRandomGenerate: (processes: ProcessInput[]) => void;
  onClearAll: () => void;
}

export default function ProcessPanel({
  processes,
  onAddProcess,
  onDeleteProcess,
  onRandomGenerate,
  onClearAll,
}: ProcessPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [arrivalTime, setArrivalTime] = useState<string>("0");
  const [burstTime, setBurstTime] = useState<string>("1");
  const [priority, setPriority] = useState<string>("");
  const [background, setBackground] = useState<string>(generateRandomColor());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateInputs = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const arrival = parseFloat(arrivalTime);
    if (arrivalTime === "" || isNaN(arrival) || arrival < 0) {
      newErrors.arrivalTime = "Arrival time must be ≥ 0";
    }
    if (arrival > 100) {
      newErrors.arrivalTime = "Arrival time must be ≤ 100";
    }
    const burst = parseFloat(burstTime);
    if (burstTime === "" || isNaN(burst) || burst <= 0) {
      newErrors.burstTime = "Burst time must be > 0";
    }
    if (burst > 100) {
      newErrors.burstTime = "Burst time must be ≤ 100";
    }
    if (priority !== "") {
      const priorityNum = parseInt(priority);
      if (isNaN(priorityNum) || priorityNum < 0) {
        newErrors.priority = "Priority must be ≥ 0";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const processId = `P${processes.length + 1}`;
    const newProcess: ProcessInput = {
      pid: processId,
      arrivalTime: parseFloat(arrivalTime),
      burstTime: parseFloat(burstTime),
      priority: priority !== "" ? parseInt(priority) : undefined,
      background,
    };

    onAddProcess(newProcess);
    setArrivalTime("0");
    setBurstTime("1");
    setPriority("");
    setBackground(generateRandomColor());
    setErrors({});
    setDialogOpen(false);
  };

  const handleRandomGenerate = () => {
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
    <Card className="bg-card/80 backdrop-blur-sm shadow-sm border-white/10">
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight">
            Processes{" "}
            {processes.length > 0 && (
              <span className="text-muted-foreground text-sm font-normal ml-2">
                ({processes.length})
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Process Cards Grid */}
        {processes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/50">
            <p className="text-sm font-medium">No processes added yet</p>
            <p className="text-xs mt-1 text-muted-foreground/70">
              Click 'Add Process' or 'Random' to start
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {processes.map((process) => (
              <div
                key={process.pid}
                className="relative group rounded-md border border-border bg-card/50 p-3 transition-all hover:bg-muted/50 hover:shadow-sm"
              >
                <button
                  onClick={() => onDeleteProcess(process.pid)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs text-white shadow-sm"
                    style={{ background: process.background || "#3b82f6" }}
                  >
                    {process.pid.replace("P", "")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm flex justify-between pr-6">
                      {process.pid}
                      <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        AT: {process.arrivalTime}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                      <span className="bg-muted/50 px-1.5 py-0.5 rounded">
                        BT: {process.burstTime}
                      </span>
                      {process.priority !== undefined && (
                        <span className="bg-muted/50 px-1.5 py-0.5 rounded">
                          Pri: {process.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="gap-2 flex-1 min-w-[140px] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-transform active:scale-95 shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Process
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Process</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">Arrival Time</Label>
                    <Input
                      id="arrivalTime"
                      type="number"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      step="1"
                      min="0"
                      max="100"
                      placeholder="0"
                      className={cn(
                        errors.arrivalTime ? "border-destructive" : "",
                      )}
                    />
                    {errors.arrivalTime && (
                      <p className="text-[10px] text-destructive">
                        {errors.arrivalTime}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="burstTime">Burst Time</Label>
                    <Input
                      id="burstTime"
                      type="number"
                      value={burstTime}
                      onChange={(e) => setBurstTime(e.target.value)}
                      step="1"
                      min="1"
                      max="100"
                      placeholder="1"
                      className={cn(
                        errors.burstTime ? "border-destructive" : "",
                      )}
                    />
                    {errors.burstTime && (
                      <p className="text-[10px] text-destructive">
                        {errors.burstTime}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (Optional)</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    min="0"
                    placeholder="Lower number = Higher priority"
                    className={cn(errors.priority ? "border-destructive" : "")}
                  />
                  {errors.priority && (
                    <p className="text-[10px] text-destructive">
                      {errors.priority}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Process Color</Label>
                  <ColorPicker value={background} onChange={setBackground} />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full">
                    Confirm & Add
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            type="button"
            variant="outline"
            className="gap-2 flex-1"
            onClick={handleRandomGenerate}
          >
            <Dices className="h-4 w-4" />
            Random
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onClearAll}
            disabled={processes.length === 0}
            className="gap-2 w-10 shrink-0"
            title="Clear All"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
