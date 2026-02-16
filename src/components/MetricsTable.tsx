import type {
  ProcessMetrics,
  ProcessInput,
  GanttBlock,
} from "../types/process";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AnimatedShinyText from "./AnimatedShinyText";

interface MetricsTableProps {
  metrics: ProcessMetrics[];
  processes: ProcessInput[];
  ganttBlocks: GanttBlock[];
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

export default function MetricsTable({
  metrics,
  processes,
  ganttBlocks,
}: MetricsTableProps) {
  if (metrics.length === 0) {
    return null;
  }

  // PID to color mapping
  const pidColorMap = new Map<string, string>();
  processes.forEach((process, index) => {
    pidColorMap.set(
      process.pid,
      process.background || defaultColors[index % defaultColors.length],
    );
  });

  // Calculate statistics
  const totalWaitingTime = metrics.reduce((sum, m) => sum + m.waitingTime, 0);
  const totalTurnaroundTime = metrics.reduce(
    (sum, m) => sum + m.turnaroundTime,
    0,
  );
  const avgWaitingTime = totalWaitingTime / metrics.length;
  const avgTurnaroundTime = totalTurnaroundTime / metrics.length;

  // Calculate total execution time and CPU utilization
  const totalExecutionTime =
    ganttBlocks.length > 0
      ? ganttBlocks[ganttBlocks.length - 1].endTime - ganttBlocks[0].startTime
      : 0;

  const idleTime = ganttBlocks
    .filter((b) => b.pid === "IDLE")
    .reduce((sum, b) => sum + (b.endTime - b.startTime), 0);

  const cpuUtilization =
    totalExecutionTime > 0
      ? ((totalExecutionTime - idleTime) / totalExecutionTime) * 100
      : 0;

  const throughput =
    totalExecutionTime > 0 ? metrics.length / totalExecutionTime : 0;

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Summary Table */}
          <div className="md:w-1/2">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-3 py-2.5 text-left font-semibold">
                      Process ID
                    </th>
                    <th className="px-3 py-2.5 text-left font-semibold">
                      Arrival Time
                    </th>
                    <th className="px-3 py-2.5 text-left font-semibold">
                      Burst Time
                    </th>
                    <th className="px-3 py-2.5 text-left font-semibold">
                      Waiting Time
                    </th>
                    <th className="px-3 py-2.5 text-left font-semibold">
                      Turnaround Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => {
                    const process = processes.find((p) => p.pid === metric.pid);
                    const color =
                      pidColorMap.get(metric.pid) || defaultColors[0];
                    const backgroundStyle = color.includes("gradient")
                      ? { backgroundImage: color }
                      : { backgroundColor: color };

                    return (
                      <tr
                        key={metric.pid}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-3 py-2.5 font-medium">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={backgroundStyle}
                            />
                            {metric.pid}
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          {process?.arrivalTime ?? "-"}
                        </td>
                        <td className="px-3 py-2.5">
                          {process?.burstTime ?? "-"}
                        </td>
                        <td className="px-3 py-2.5">{metric.waitingTime}</td>
                        <td className="px-3 py-2.5">{metric.turnaroundTime}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30 font-semibold">
                    <td className="px-3 py-2.5">Total</td>
                    <td className="px-3 py-2.5">-</td>
                    <td className="px-3 py-2.5">-</td>
                    <td className="px-3 py-2.5">{totalWaitingTime}</td>
                    <td className="px-3 py-2.5">{totalTurnaroundTime}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="md:w-1/2 flex flex-col justify-center items-center">
            <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
              <div className="text-center p-4 rounded-lg bg-background/50">
                <AnimatedShinyText className="text-xs font-medium uppercase tracking-wider mb-2 block">
                  Avg Waiting Time
                </AnimatedShinyText>
                <div className="text-2xl font-bold">
                  {Math.round(avgWaitingTime * 100) / 100}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <AnimatedShinyText className="text-xs font-medium uppercase tracking-wider mb-2 block">
                  Avg Turnaround Time
                </AnimatedShinyText>
                <div className="text-2xl font-bold">
                  {Math.round(avgTurnaroundTime * 100) / 100}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <AnimatedShinyText className="text-xs font-medium uppercase tracking-wider mb-2 block">
                  Throughput
                </AnimatedShinyText>
                <div className="text-2xl font-bold">
                  {Math.round(throughput * 100) / 100}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <AnimatedShinyText className="text-xs font-medium uppercase tracking-wider mb-2 block">
                  CPU Utilization
                </AnimatedShinyText>
                <div className="text-2xl font-bold">
                  {Math.round(cpuUtilization * 100) / 100}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
