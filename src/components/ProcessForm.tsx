import { useState, useEffect } from "react";
import type { ProcessInput } from "../types/process";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import ColorPicker from "./ColorPicker";
import { generateRandomColor } from "../utils/colors";
import { Plus } from "lucide-react";

interface ProcessFormProps {
  onAddProcess: (process: ProcessInput) => void;
  editingProcess?: ProcessInput | null;
  onEditComplete?: () => void;
}

export default function ProcessForm({
  onAddProcess,
  editingProcess,
  onEditComplete,
}: ProcessFormProps) {
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [burstTime, setBurstTime] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [background, setBackground] = useState<string>(generateRandomColor());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (editingProcess) {
      setArrivalTime(String(editingProcess.arrivalTime));
      setBurstTime(String(editingProcess.burstTime));
      setPriority(
        editingProcess.priority !== undefined
          ? String(editingProcess.priority)
          : "",
      );
      setBackground(editingProcess.background || generateRandomColor());
      setPopoverOpen(true);
    } else {
      // Reset form when not editing
      if (!popoverOpen) {
        setArrivalTime("");
        setBurstTime("");
        setPriority("");
        setBackground(generateRandomColor());
        setErrors({});
      }
    }
  }, [editingProcess]);

  const validateInputs = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const arrival = parseFloat(arrivalTime);
    if (arrivalTime === "" || isNaN(arrival) || arrival < 0) {
      newErrors.arrivalTime = "Arrival time must be a non-negative number";
    }

    const burst = parseFloat(burstTime);
    if (burstTime === "" || isNaN(burst) || burst <= 0) {
      newErrors.burstTime = "Burst time must be a positive number";
    }

    if (priority !== "") {
      const priorityNum = parseInt(priority);
      if (isNaN(priorityNum) || priorityNum < 0) {
        newErrors.priority = "Priority must be a non-negative integer";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const processId = editingProcess ? editingProcess.pid : `P${Date.now()}`;
    const newProcess: ProcessInput = {
      pid: processId,
      arrivalTime: parseFloat(arrivalTime),
      burstTime: parseFloat(burstTime),
      priority: priority !== "" ? parseInt(priority) : undefined,
      background,
    };

    onAddProcess(newProcess);

    if (editingProcess && onEditComplete) {
      onEditComplete();
      setPopoverOpen(false);
    } else {
      // Reset form
      setArrivalTime("");
      setBurstTime("");
      setPriority("");
      setBackground(generateRandomColor());
      setErrors({});
      setPopoverOpen(false);
    }
  };

  // If editing, show in popover
  if (editingProcess) {
    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverContent align="start" className="w-80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Edit Process</h3>
            <div>
              <Label htmlFor="edit-arrivalTime">Arrival Time</Label>
              <Input
                id="edit-arrivalTime"
                type="number"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                step="0.1"
                min="0"
                placeholder="0"
                className={errors.arrivalTime ? "border-destructive" : ""}
              />
              {errors.arrivalTime && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.arrivalTime}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-burstTime">Burst Time</Label>
              <Input
                id="edit-burstTime"
                type="number"
                value={burstTime}
                onChange={(e) => setBurstTime(e.target.value)}
                step="0.1"
                min="0.1"
                placeholder="1"
                className={errors.burstTime ? "border-destructive" : ""}
              />
              {errors.burstTime && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.burstTime}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-priority">Priority (Optional)</Label>
              <Input
                id="edit-priority"
                type="number"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                min="0"
                placeholder="Optional"
                className={errors.priority ? "border-destructive" : ""}
              />
              {errors.priority && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.priority}
                </p>
              )}
            </div>

            <div>
              <Label>Process Color</Label>
              <ColorPicker value={background} onChange={setBackground} />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Update Process
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPopoverOpen(false);
                  if (onEditComplete) onEditComplete();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    );
  }

  // Normal add form in card
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Process</CardTitle>
        <CardDescription>Add a new process to the simulation</CardDescription>
      </CardHeader>
      <CardContent>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger>
            <Button type="button" className="w-full mb-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Process
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  type="number"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  step="0.1"
                  min="0"
                  placeholder="0"
                  className={errors.arrivalTime ? "border-destructive" : ""}
                />
                {errors.arrivalTime && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.arrivalTime}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="burstTime">Burst Time</Label>
                <Input
                  id="burstTime"
                  type="number"
                  value={burstTime}
                  onChange={(e) => setBurstTime(e.target.value)}
                  step="0.1"
                  min="0.1"
                  placeholder="1"
                  className={errors.burstTime ? "border-destructive" : ""}
                />
                {errors.burstTime && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.burstTime}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="priority">Priority (Optional)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  min="0"
                  placeholder="Optional"
                  className={errors.priority ? "border-destructive" : ""}
                />
                {errors.priority && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.priority}
                  </p>
                )}
              </div>

              <div>
                <Label>Process Color</Label>
                <ColorPicker value={background} onChange={setBackground} />
              </div>

              <Button type="submit" className="w-full">
                Add Process
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
}
