import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GanttBlock, ProcessInput } from '../types/process';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '../utils/cn';

interface GanttChartProps {
  ganttBlocks: GanttBlock[];
  processes?: ProcessInput[];
}

const defaultColors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6366f1', // indigo
  '#ef4444', // red
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
];

export default function GanttChart({ ganttBlocks, processes = [] }: GanttChartProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [ganttBlocks]);

  if (ganttBlocks.length === 0) {
    return null;
  }

  // Create PID to color mapping from processes
  const pidColorMap = new Map<string, string>();
  processes.forEach((process, index) => {
    pidColorMap.set(
      process.pid,
      process.background || defaultColors[index % defaultColors.length]
    );
  });

  // Calculate total time
  const totalTime = ganttBlocks[ganttBlocks.length - 1]?.endTime || 0;

  // Generate time markers
  const markerInterval = totalTime > 20 ? 2 : 1;
  const timeMarkers: number[] = [];
  for (let i = 0; i <= totalTime; i += markerInterval) {
    timeMarkers.push(i);
  }
  if (timeMarkers[timeMarkers.length - 1] !== totalTime) {
    timeMarkers.push(totalTime);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      x: -50,
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const uniquePids = Array.from(
    new Set(ganttBlocks.map((block) => block.pid).filter((pid) => pid !== 'IDLE'))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gantt Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <motion.div
            key={animationKey}
            className="flex items-start mb-4"
            style={{ minWidth: 'max-content' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {ganttBlocks.map((block, index) => {
              const duration = block.endTime - block.startTime;
              const widthPercent = (duration / totalTime) * 100;
              const isIdle = block.pid === 'IDLE';
              const backgroundColor = isIdle
                ? '#9ca3af'
                : pidColorMap.get(block.pid) || defaultColors[0];
              const isGradient = backgroundColor.includes('gradient');

              return (
                <motion.div
                  key={`${block.pid}-${index}-${block.startTime}`}
                  variants={itemVariants}
                  className={cn(
                    'text-white border border-border flex flex-col items-center justify-center min-w-[60px] transition-all hover:opacity-90 hover:scale-105 cursor-pointer',
                    !isGradient && 'shadow-md'
                  )}
                  style={{
                    width: `${Math.max(widthPercent, 5)}%`,
                    background: backgroundColor,
                  }}
                  title={`${block.pid}: ${block.startTime} - ${block.endTime}`}
                >
                  <div className="font-semibold text-sm py-2">{block.pid}</div>
                  <div className="text-xs pb-1">{block.startTime}</div>
                </motion.div>
              );
            })}
            {ganttBlocks.length > 0 && (
              <div className="text-sm text-muted-foreground ml-2 pt-2">
                {ganttBlocks[ganttBlocks.length - 1].endTime}
              </div>
            )}
          </motion.div>

          {/* Time markers */}
          <motion.div
            className="flex justify-between text-xs text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {timeMarkers.map((time) => (
              <span key={time}>{time}</span>
            ))}
          </motion.div>
        </div>

        {/* Legend */}
        {uniquePids.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium">Legend:</span>
            {uniquePids.map((pid) => {
              const color = pidColorMap.get(pid) || defaultColors[0];
              const isGradient = color.includes('gradient');
              return (
                <div key={pid} className="flex items-center gap-2">
                  <div
                    className={cn('w-4 h-4 rounded', !isGradient && 'border border-border')}
                    style={{ background: color }}
                  />
                  <span className="text-sm">{pid}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded border border-border" />
              <span className="text-sm">IDLE</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
