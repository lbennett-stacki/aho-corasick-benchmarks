import { useState } from "react";
import { BenchmarkChart } from "./benchmark-chart";
import { getChartData, getImplementations } from "@/lib/data-transforms";
import { formatMs } from "@/lib/format";
import { Button } from "@/components/ui/button";
import type { BenchmarkEntry } from "@/types/benchmark";

interface LatencyChartProps {
	entries: BenchmarkEntry[];
}

const LATENCY_METRICS = [
	{ key: "search_time_median_ms", label: "Median" },
	{ key: "search_time_p95_ms", label: "P95" },
	{ key: "search_time_p99_ms", label: "P99" },
] as const;

export function LatencyChart({ entries }: LatencyChartProps) {
	const [selectedMetric, setSelectedMetric] = useState<string>(
		"search_time_median_ms",
	);
	const data = getChartData(entries, selectedMetric);
	const implementations = getImplementations(entries);
	const currentLabel =
		LATENCY_METRICS.find((m) => m.key === selectedMetric)?.label ?? "Median";

	return (
		<div className="space-y-2">
			<div className="flex gap-1">
				{LATENCY_METRICS.map((m) => (
					<Button
						key={m.key}
						variant={selectedMetric === m.key ? "default" : "outline"}
						size="sm"
						onClick={() => setSelectedMetric(m.key)}
					>
						{m.label}
					</Button>
				))}
			</div>
			<BenchmarkChart
				title={`Search Latency (${currentLabel})`}
				description="Time per search operation in milliseconds (lower is better)"
				data={data}
				implementations={implementations}
				valueFormatter={formatMs}
				yAxisLabel="ms"
			/>
		</div>
	);
}
