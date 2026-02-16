import { useMemo } from "react";
import { motion } from "framer-motion";
import type { GanttBlock, ProcessInput } from "../types/process";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface GanttChartProps {
  ganttBlocks: GanttBlock[];
  processes?: ProcessInput[];
}

const defaultColors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#6366f1",
  "#ef4444",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
];

export default function GanttChart({
  ganttBlocks,
  processes = [],
}: GanttChartProps) {
  // Use a stable key derived from the gantt blocks content
  const animationKey = useMemo(
    () => JSON.stringify(ganttBlocks),
    [ganttBlocks],
  );

  if (ganttBlocks.length === 0) {
    return null;
  }

  // Create PID to color mapping from processes
  const pidColorMap = new Map<string, string>();
  processes.forEach((process, index) => {
    pidColorMap.set(
      process.pid,
      process.background || defaultColors[index % defaultColors.length],
    );
  });

  // Calculate total time
  const totalTime = ganttBlocks[ganttBlocks.length - 1]?.endTime || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: {
      scaleX: 0,
      opacity: 0,
    },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 } as const,
    },
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Gantt Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          {/* Gantt Bars */}
          <motion.div
            key={animationKey}
            className="flex items-stretch"
            style={{ minWidth: "max-content" }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {ganttBlocks.map((block, index) => {
              const duration = block.endTime - block.startTime;
              const minWidth = Math.max(duration * 40, 50);
              const isIdle = block.pid === "IDLE";
              const backgroundColor = isIdle
                ? "transparent"
                : pidColorMap.get(block.pid) || defaultColors[0];
              const isGradient = backgroundColor.includes("gradient");

              return (
                <motion.div
                  key={`${block.pid}-${index}-${block.startTime}`}
                  variants={itemVariants}
                  className={`flex flex-col items-center justify-center border border-border/50 text-white transition-all origin-left ${
                    isIdle
                      ? "bg-transparent border-dashed"
                      : "shadow-sm hover:shadow-md hover:brightness-110"
                  }`}
                  style={{
                    width: `${minWidth}px`,
                    minHeight: "48px",
                    background: isIdle ? "transparent" : backgroundColor,
                    ...(isGradient ? {} : {}),
                  }}
                  title={`${block.pid}: ${block.startTime} - ${block.endTime}`}
                >
                  <div
                    className={`font-semibold text-sm ${isIdle ? "text-muted-foreground" : ""}`}
                  >
                    {isIdle ? "IDLE" : block.pid}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Time Scale */}
          <motion.div
            className="flex"
            style={{ minWidth: "max-content" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {ganttBlocks.map((block, index) => {
              const duration = block.endTime - block.startTime;
              const minWidth = Math.max(duration * 40, 50);

              return (
                <div
                  key={`time-${index}`}
                  className="flex items-start"
                  style={{ width: `${minWidth}px` }}
                >
                  <span className="text-xs text-muted-foreground pt-1 -ml-1">
                    {block.startTime}
                  </span>
                </div>
              );
            })}
            {/* Final end time */}
            <span className="text-xs text-muted-foreground pt-1 -ml-1">
              {totalTime}
            </span>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
