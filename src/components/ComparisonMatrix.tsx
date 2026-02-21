import { useMemo } from "react";
import type { ProcessInput } from "../types/process";
import { fcfs } from "../algorithms/fcfs";
import { sjf } from "../algorithms/sjf";
import { roundRobin } from "../algorithms/roundRobin";
import { priority } from "../algorithms/priority";
import { srtf } from "../algorithms/srtf";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trophy, Clock, Activity, AlertCircle } from "lucide-react";

interface ComparisonMatrixProps {
  processes: ProcessInput[];
  quantum: number;
  selectedAlgorithm: string;
}

export default function ComparisonMatrix({
  processes,
  quantum,
  selectedAlgorithm,
}: ComparisonMatrixProps) {
  const comparisonData = useMemo(() => {
    if (processes.length === 0) return [];

    const hasPriority = processes.every((p) => p.priority !== undefined);

    // We want to run each algorithm safely
    const algos = [
      { id: "fcfs", name: "FCFS", run: fcfs },
      { id: "sjf", name: "SJF", run: sjf },
      { id: "srtf", name: "SRTF", run: srtf },
      {
        id: "roundRobin",
        name: `RR (q=${quantum})`,
        run: (p: ProcessInput[]) => roundRobin(p, quantum),
      },
    ];

    if (hasPriority) {
      algos.push({ id: "priority", name: "Priority", run: priority });
    }

    return algos
      .map((algo) => {
        try {
          const result = algo.run(processes);

          let avgWaiting = 0;
          let avgTurnaround = 0;

          if (result.metrics.length > 0) {
            avgWaiting =
              result.metrics.reduce((acc, m) => acc + m.waitingTime, 0) /
              result.metrics.length;
            avgTurnaround =
              result.metrics.reduce((acc, m) => acc + m.turnaroundTime, 0) /
              result.metrics.length;
          }

          const totalDuration =
            result.ganttBlocks.length > 0
              ? result.ganttBlocks[result.ganttBlocks.length - 1].endTime
              : 0;

          const throughput =
            totalDuration > 0
              ? (processes.length / totalDuration).toFixed(3)
              : "0";

          return {
            id: algo.id,
            name: algo.name,
            avgWaiting: Number(avgWaiting.toFixed(2)),
            avgTurnaround: Number(avgTurnaround.toFixed(2)),
            throughput: Number(throughput),
          };
        } catch {
          return {
            id: algo.id,
            name: algo.name,
            avgWaiting: Infinity,
            avgTurnaround: Infinity,
            throughput: 0,
          };
        }
      })
      .sort((a, b) => a.avgWaiting - b.avgWaiting); // Sort by best waiting time
  }, [processes, quantum]);

  if (processes.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl bg-muted/10 h-full flex items-center justify-center">
        No comparison available without processes.
      </div>
    );
  }

  const bestAlgo = comparisonData[0];

  return (
    <div className="space-y-6 animate-slide-up pb-6">
      <Card className="bg-primary/5 border-primary/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Trophy className="w-24 h-24" />
        </div>
        <CardContent className="p-6 relative z-10">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-foreground">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Best Algorithm: {bestAlgo.name}
          </h3>
          <p className="text-muted-foreground pt-1">
            For the current set of processes,{" "}
            <strong className="text-foreground">{bestAlgo.name}</strong>{" "}
            provides the lowest average waiting time of{" "}
            <strong className="text-foreground">{bestAlgo.avgWaiting}s</strong>,
            making it the most optimal choice.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 shadow-sm">
        <CardHeader className="pb-4 border-b border-border/40">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Comparison Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/4">Algorithm</th>
                <th className="px-6 py-4 font-semibold text-center w-1/4">
                  Avg Waiting Time
                </th>
                <th className="px-6 py-4 font-semibold text-center w-1/4">
                  Avg Turnaround Time
                </th>
                <th className="px-6 py-4 font-semibold text-center w-1/4">
                  Throughput
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((data, idx) => (
                <tr
                  key={data.id}
                  className={`border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors ${data.id === selectedAlgorithm ? "bg-primary/5" : ""}`}
                >
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    {idx === 0 && (
                      <Trophy className="h-4 w-4 text-yellow-500 shrink-0" />
                    )}
                    {idx !== 0 && data.id === selectedAlgorithm && (
                      <AlertCircle className="h-4 w-4 text-primary shrink-0" />
                    )}
                    <span
                      className={
                        data.id === selectedAlgorithm
                          ? "text-primary font-bold"
                          : ""
                      }
                    >
                      {data.name}{" "}
                      {data.id === selectedAlgorithm && "(Selected)"}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-center font-mono ${idx === 0 ? "text-green-500 font-bold" : ""}`}
                  >
                    {data.avgWaiting === Infinity ? "N/A" : data.avgWaiting}s
                  </td>
                  <td className="px-6 py-4 text-center font-mono">
                    {data.avgTurnaround === Infinity
                      ? "N/A"
                      : data.avgTurnaround}
                    s
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-muted-foreground">
                    {data.throughput} process/s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border/50 shadow-sm">
          <CardContent className="p-4 flex gap-4 items-center">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                Waiting Time
              </p>
              <p className="text-sm">
                Time a process spends in the ready queue.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50 shadow-sm">
          <CardContent className="p-4 flex gap-4 items-center">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                Turnaround Time
              </p>
              <p className="text-sm">
                Total time from submission to completion.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
