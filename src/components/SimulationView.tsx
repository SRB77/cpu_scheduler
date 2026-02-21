import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProcessInput, AlgorithmResult } from "../types/process";
import GanttChart from "./GanttChart";
import MetricsTable from "./MetricsTable";
import ReadyQueueView from "./ReadyQueueView";
import ComparisonMatrix from "./ComparisonMatrix";
import { Button } from "./ui/button";
import { Play, Pause, StepForward, RotateCcw } from "lucide-react";

interface SimulationViewProps {
  processes: ProcessInput[];
  selectedAlgorithm: string;
  quantum: number;
  simulationResult: AlgorithmResult;
}

export default function SimulationView({
  processes,
  selectedAlgorithm,
  quantum,
  simulationResult,
}: SimulationViewProps) {
  const [activeTab, setActiveTab] = useState<"visualise" | "compare">(
    "visualise",
  );

  // Playback state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const maxTime =
    simulationResult.ganttBlocks.length > 0
      ? simulationResult.ganttBlocks[simulationResult.ganttBlocks.length - 1]
          .endTime
      : 0;

  const timerRef = useRef<number | null>(null);

  // Reset playback if simulation result changes

  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, [simulationResult]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }
          return prev + 1;
        });
      }, 1000); // 1 second per time unit simulation speed
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, maxTime]);

  const togglePlay = () => {
    if (currentTime >= maxTime) setCurrentTime(0);
    setIsPlaying(!isPlaying);
  };

  const stepForward = () => {
    setIsPlaying(false);
    setCurrentTime((prev) => Math.min(prev + 1, maxTime));
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="w-full flex flex-col gap-6 h-full">
      {/* Sliding Tabs */}
      <div className="flex justify-center shrink-0">
        <div className="relative flex p-1 bg-muted/30 rounded-full border border-border/50">
          {["visualise", "compare"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "visualise" | "compare")}
              className={`relative px-6 py-2 text-sm font-medium rounded-full transition-colors z-10 capitalize ${
                activeTab === tab
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "visualise" && (
          <motion.div
            key="visualise"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6 flex-1 min-h-0"
          >
            {/* Visualiser Top: Ready Queue & CPU */}
            <div className="shrink-0">
              <ReadyQueueView
                currentTime={currentTime}
                processes={processes}
                ganttBlocks={simulationResult.ganttBlocks}
              />
            </div>

            {/* Playback Controls & Timeline Overlay */}
            <div className="shrink-0 relative">
              <div className="flex items-center gap-3 mb-3 bg-muted/10 p-2 rounded-xl border border-border/30 w-max mx-auto shadow-sm">
                <span className="font-mono text-xs font-bold w-16 text-center text-primary bg-primary/10 py-1 rounded">
                  t = {currentTime}s
                </span>
                <div className="h-4 w-px bg-border/50" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={reset}
                  title="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-sm"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={stepForward}
                  title="Step Forward"
                >
                  <StepForward className="h-4 w-4" />
                </Button>
                <div className="h-4 w-px bg-border/50" />
                <input
                  type="range"
                  min="0"
                  max={maxTime}
                  value={currentTime}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentTime(parseInt(e.target.value));
                  }}
                  className="w-32 accent-primary"
                />
              </div>

              {/* Timeline (Gantt Chart inside wrapper to indicate scrubber) */}
              <div className="relative px-2">
                <GanttChart
                  ganttBlocks={simulationResult.ganttBlocks}
                  processes={processes}
                />
                {/* Scrubber overlay */}
                {maxTime > 0 && (
                  <div className="absolute inset-y-0 left-2 right-2 pointer-events-none mt-[60px] pb-6">
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-primary/70 z-10 transition-all duration-300 ease-linear shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                      style={{
                        left: `min(calc(${(currentTime / maxTime) * 100}% + 24px), 100%)`,
                        height: "80%",
                      }}
                    >
                      <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-2 ring-background z-20" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Table */}
            <div className="flex-1 overflow-y-auto">
              <MetricsTable
                metrics={simulationResult.metrics}
                processes={processes}
                ganttBlocks={simulationResult.ganttBlocks}
              />
            </div>
          </motion.div>
        )}

        {activeTab === "compare" && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 overflow-y-auto"
          >
            <ComparisonMatrix
              processes={processes}
              quantum={quantum}
              selectedAlgorithm={selectedAlgorithm}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
