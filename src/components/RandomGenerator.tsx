import { Button } from './ui/button';
import { Dices } from 'lucide-react';
import type { ProcessInput } from '../types/process';
import { generateRandomColor } from '../utils/colors';

interface RandomGeneratorProps {
  onGenerate: (processes: ProcessInput[]) => void;
}

export default function RandomGenerator({ onGenerate }: RandomGeneratorProps) {
  const handleGenerate = () => {
    const numProcesses = Math.floor(Math.random() * 3) + 3; // 3-5 processes
    const newProcesses: ProcessInput[] = [];

    for (let i = 0; i < numProcesses; i++) {
      newProcesses.push({
        pid: `P${i + 1}`,
        arrivalTime: Math.floor(Math.random() * 10), // 0-9
        burstTime: Math.floor(Math.random() * 10) + 1, // 1-10
        background: generateRandomColor(),
      });
    }

    // Sort by arrival time
    newProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Reassign PIDs after sorting
    newProcesses.forEach((process, index) => {
      process.pid = `P${index + 1}`;
    });

    onGenerate(newProcesses);
  };

  return (
    <Button type="button" variant="outline" onClick={handleGenerate} className="gap-2">
      <Dices className="h-4 w-4" />
      Generate Random Processes
    </Button>
  );
}
