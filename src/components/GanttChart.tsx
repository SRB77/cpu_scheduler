import { useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GanttBlock, ProcessInput } from "../types/process";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface GanttChartProps {
  ganttBlocks: GanttBlock[];
  processes?: ProcessInput[];
  currentTime: number;
  maxTime: number;
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

const PIXELS_PER_TIME = 40; // Base width for 1 unit of time
const MIN_BLOCK_WIDTH = 50;

export default function GanttChart({
  ganttBlocks,
  processes = [],
  currentTime,
  maxTime,
}: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the container to keep the scrubber in view
  useEffect(() => {
    if (containerRef.current) {
      const scrollPos = currentTime * PIXELS_PER_TIME;
      const containerWidth = containerRef.current.clientWidth;

      // If the scrubber is getting close to the right edge, scroll
      if (scrollPos > containerRef.current.scrollLeft + containerWidth - 100) {
        containerRef.current.scrollTo({
          left: scrollPos - containerWidth / 2,
          behavior: "smooth",
        });
      } else if (scrollPos < containerRef.current.scrollLeft) {
        // Also scroll if we scrubbed backwards
        containerRef.current.scrollTo({
          left: Math.max(0, scrollPos - 50),
          behavior: "smooth",
        });
      }
    }
  }, [currentTime]);

  // Create PID to color mapping from processes
  const pidColorMap = useMemo(() => {
    const map = new Map<string, string>();
    processes.forEach((process, index) => {
      map.set(
        process.pid,
        process.background || defaultColors[index % defaultColors.length],
      );
    });
    return map;
  }, [processes]);

  // Calculate distinct timeline markers
  const timeMarkers = useMemo(() => {
    const markers = new Set<number>();
    markers.add(0);
    ganttBlocks.forEach((b) => markers.add(b.endTime));
    return Array.from(markers).sort((a, b) => a - b);
  }, [ganttBlocks]);

  if (ganttBlocks.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Gantt Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[120px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/30 rounded-xl bg-muted/5">
            No simulation data
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalWidth = Math.max(
    maxTime * PIXELS_PER_TIME,
    containerRef.current?.clientWidth || 0,
  );

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Gantt Chart</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="overflow-x-auto pb-6 relative hide-scrollbar scroll-smooth"
        >
          <div
            className="relative"
            style={{
              width: `${totalWidth}px`,
              minWidth: "100%",
              height: "80px",
            }}
          >
            {/* The Gantt Blocks Wrapper */}
            <div className="absolute top-0 left-0 right-0 h-[50px]">
              <AnimatePresence>
                {ganttBlocks.map((block, index) => {
                  // Only render if the block has started
                  if (block.startTime > currentTime) return null;

                  // Determine the active duration of the block based on scrubber
                  const activeDuration =
                    Math.min(currentTime, block.endTime) - block.startTime;
                  if (activeDuration <= 0 && currentTime > 0) return null;

                  // Calculate dimensions based on actual duration and active duration
                  const fullDuration = block.endTime - block.startTime;
                  const fullWidth = Math.max(
                    fullDuration * PIXELS_PER_TIME,
                    MIN_BLOCK_WIDTH,
                  );

                  // We calculate the scale factor or exact width to clip the block growing
                  const currentWidth = Math.max(
                    activeDuration * PIXELS_PER_TIME,
                    (activeDuration / fullDuration) * fullWidth,
                  );
                  const isIdle = block.pid === "IDLE";
                  const backgroundColor = isIdle
                    ? "transparent"
                    : pidColorMap.get(block.pid) || defaultColors[0];

                  return (
                    <motion.div
                      key={`${block.pid}-${index}-${block.startTime}`}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: currentWidth }}
                      exit={{ opacity: 0 }}
                      className={`absolute top-0 h-[48px] flex flex-col items-center justify-center border border-border/50 text-white transition-all overflow-hidden ${
                        isIdle
                          ? "bg-transparent border-dashed"
                          : "shadow-sm hover:shadow-md hover:brightness-110"
                      }`}
                      style={{
                        left: `${block.startTime * PIXELS_PER_TIME}px`,
                        background: isIdle ? "transparent" : backgroundColor,
                      }}
                      title={`${block.pid}: ${block.startTime} - ${block.endTime}`}
                    >
                      <div
                        className={`font-semibold text-sm whitespace-nowrap px-2 ${isIdle ? "text-muted-foreground" : ""}`}
                      >
                        {isIdle ? "IDLE" : block.pid}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Time Scale Axis */}
            <div className="absolute top-[50px] left-0 right-0 h-[20px] border-t border-border/40">
              {timeMarkers.map((time) => (
                <div
                  key={`time-${time}`}
                  className="absolute top-0 flex flex-col items-center -ml-2"
                  style={{ left: `${time * PIXELS_PER_TIME}px` }}
                >
                  <div className="w-px h-1.5 bg-border/80" />
                  <span
                    className="text-[10px] text-muted-foreground font-mono font-medium mt-0.5"
                    style={{ textShadow: "0 0 2px var(--background)" }}
                  >
                    {time}
                  </span>
                </div>
              ))}
            </div>

            {/* The synchronized Scrubber Overlay inside the scrolling area */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary/70 z-20 pointer-events-none transition-all duration-[50ms] ease-linear shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              style={{
                left: `${currentTime * PIXELS_PER_TIME}px`,
                height: "60px",
              }}
            >
              <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-2 ring-background shadow-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
