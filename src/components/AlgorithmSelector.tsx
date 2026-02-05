import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';

interface AlgorithmSelectorProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (algorithm: string) => void;
  quantum: number;
  onQuantumChange: (quantum: number) => void;
}

const algorithms = [
  { value: 'fcfs', label: 'First Come First Served (FCFS)', icon: '📋' },
  { value: 'sjf', label: 'Shortest Job First (SJF)', icon: '⚡' },
  { value: 'roundRobin', label: 'Round Robin (RR)', icon: '🔄' },
  { value: 'priority', label: 'Priority', icon: '⭐' },
  { value: 'srtf', label: 'Shortest Remaining Time First (SRTF)', icon: '🎯' },
];

const algorithmDescriptions: Record<string, string> = {
  fcfs: 'Processes are executed in the order they arrive. Simple but may cause long waiting times.',
  sjf: 'Executes the shortest job first. Minimizes average waiting time but may cause starvation.',
  roundRobin: 'Each process gets a fixed time quantum in circular order. Fair and responsive for time-sharing systems.',
  priority: 'Processes are executed based on priority. Lower number means higher priority. May cause starvation.',
  srtf: 'Preemptive version of SJF. Always executes the process with the shortest remaining time.',
};

export default function AlgorithmSelector({
  selectedAlgorithm,
  onAlgorithmChange,
  quantum,
  onQuantumChange,
}: AlgorithmSelectorProps) {
  const [descriptionRevealed, setDescriptionRevealed] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Algorithm</CardTitle>
        <CardDescription>Choose a CPU scheduling algorithm to simulate</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="algorithm">Scheduling Algorithm</Label>
          <Select
            id="algorithm"
            value={selectedAlgorithm}
            onChange={(e) => {
              onAlgorithmChange(e.target.value);
              setDescriptionRevealed(false);
            }}
            className="mt-1"
          >
            {algorithms.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.icon} {algo.label}
              </option>
            ))}
          </Select>
        </div>

        {selectedAlgorithm && (
          <div>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setDescriptionRevealed(!descriptionRevealed)}
            >
              <span className="text-sm font-medium">
                {descriptionRevealed ? 'Hide' : 'Show'} Algorithm Description
              </span>
              {descriptionRevealed ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {descriptionRevealed && (
              <div className="mt-2 p-3 bg-muted rounded-md text-sm text-muted-foreground">
                {algorithmDescriptions[selectedAlgorithm]}
              </div>
            )}
          </div>
        )}

        {selectedAlgorithm === 'roundRobin' && (
          <div>
            <Label htmlFor="quantum">Time Quantum</Label>
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
              className="mt-1"
            />
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the time quantum for Round Robin scheduling
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
