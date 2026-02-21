import { motion, AnimatePresence } from "framer-motion";
import type { GanttBlock, ProcessInput } from "../types/process";
import { Card, CardContent } from "./ui/card";
import { Cpu, List } from "lucide-react";

interface ReadyQueueViewProps {
  currentTime: number;
  processes: ProcessInput[];
  ganttBlocks: GanttBlock[];
}

export default function ReadyQueueView({
  currentTime,
  processes,
  ganttBlocks,
}: ReadyQueueViewProps) {
  // Find who is in CPU right now
  const activeBlock = ganttBlocks.find(
    (b) =>
      currentTime >= b.startTime && currentTime < b.endTime && b.pid !== "IDLE",
  );

  const activeProcess = activeBlock
    ? processes.find((p) => p.pid === activeBlock.pid)
    : null; 
  // Find processes in Ready Queue
  // A process is in ready queue at time T if:
  // - It has arrived (arrivalTime <= T)
  // - It has not completed all its bursts
  // - It is not currently the active process
  // To accurately know what remains, we need to calculate remaining burst time.
  // We can do this by summing the burst time spent in gantt blocks before T.

  const readyQueue = processes
    .filter((p) => {
      if (p.arrivalTime > currentTime) return false;

      const timeSpent = ganttBlocks
        .filter((b) => b.pid === p.pid && b.startTime < currentTime)
        .reduce((acc, b) => {
          const end = Math.min(b.endTime, currentTime);
          return acc + (end - b.startTime);
        }, 0);

      const isCompleted = timeSpent >= p.burstTime;
      const isActive = activeProcess?.pid === p.pid;

      return !isCompleted && !isActive;
    })
    .sort((a, b) => {
      // Basic tie-breaker: order they appear in the array (or arrival time)
      return a.arrivalTime - b.arrivalTime;
    });

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-2">
      {/* Ready Queue container */}

      <Card className="flex-1 bg-card/80 border-border shadow-sm border-dashed">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3 text-muted-foreground pb-2 border-b border-border/40">
            <List className="h-4 w-4" />

            <span className="text-sm font-semibold tracking-wide uppercase">
              Ready Queue
            </span>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[50px] items-center">
            <AnimatePresence mode="popLayout">
              {readyQueue.length === 0 ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-muted-foreground italic"
                >
                  Empty
                </motion.span>
              ) : (
                readyQueue.map((p) => (
                  <motion.div
                    key={p.pid}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm ring-2 ring-white/10"
                    style={{ background: p.background || "#3B82F6" }}
                  >
                    {p.pid}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      {/* CPU Box */}

      <Card className="w-full md:w-[200px] shrink-0 bg-primary/5 border-primary/20 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

        <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center min-h-[120px]">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-widest uppercase mb-4">
            <Cpu className="h-4 w-4" />
            <span>Active CPU</span>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeProcess ? (
                <motion.div
                  key={activeProcess.pid}
                  initial={{ scale: 0, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 10 }}
                  className="absolute inset-0 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg ring-4 ring-white/20 z-10"
                  style={{ background: activeProcess.background || "#3B82F6" }}
                >
                  {activeProcess.pid}
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center text-xs text-muted-foreground bg-background/50"
                >
                  IDLE
                </motion.div>
              )}
            </AnimatePresence>

            {activeProcess && (
              <div className="absolute -inset-2 bg-primary/20 rounded-2xl animate-ping opacity-75 z-0" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
