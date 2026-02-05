import type { ProcessInput } from '../types/process';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trash2, Pencil } from 'lucide-react';
import { cn } from '../utils/cn';

interface ProcessTableProps {
  processes: ProcessInput[];
  onDeleteProcess: (pid: string) => void;
  onEditProcess: (process: ProcessInput) => void;
}

export default function ProcessTable({ processes, onDeleteProcess, onEditProcess }: ProcessTableProps) {
  if (processes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No processes added yet. Add a process to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processes ({processes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processes.map((process) => (
            <Card
              key={process.pid}
              className={cn('relative overflow-hidden transition-all hover:shadow-lg')}
            >
              <div
                className="h-2 w-full"
                style={{
                  background: process.background || '#3b82f6',
                }}
              />
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{process.pid}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditProcess(process)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteProcess(process.pid)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arrival Time:</span>
                    <span className="font-medium">{process.arrivalTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Burst Time:</span>
                    <span className="font-medium">{process.burstTime}</span>
                  </div>
                  {process.priority !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <span className="font-medium">{process.priority}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
