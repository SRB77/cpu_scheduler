import type { ProcessMetrics } from '../types/process';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MetricsTableProps {
  metrics: ProcessMetrics[];
}

export default function MetricsTable({ metrics }: MetricsTableProps) {
  if (metrics.length === 0) {
    return null;
  }

  // Calculate averages
  const avgWaitingTime = metrics.reduce((sum, m) => sum + m.waitingTime, 0) / metrics.length;
  const avgTurnaroundTime = metrics.reduce((sum, m) => sum + m.turnaroundTime, 0) / metrics.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left">PID</th>
                <th className="px-4 py-2 text-left">Waiting Time</th>
                <th className="px-4 py-2 text-left">Turnaround Time</th>
                <th className="px-4 py-2 text-left">Completion Time</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.pid} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2 font-medium">{metric.pid}</td>
                  <td className="px-4 py-2">{metric.waitingTime.toFixed(2)}</td>
                  <td className="px-4 py-2">{metric.turnaroundTime.toFixed(2)}</td>
                  <td className="px-4 py-2">{metric.completionTime.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted font-semibold">
                <td className="px-4 py-2">Average</td>
                <td className="px-4 py-2">{avgWaitingTime.toFixed(2)}</td>
                <td className="px-4 py-2">{avgTurnaroundTime.toFixed(2)}</td>
                <td className="px-4 py-2">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
