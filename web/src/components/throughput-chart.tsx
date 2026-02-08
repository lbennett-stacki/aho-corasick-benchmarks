import { BenchmarkChart } from "./benchmark-chart";
import { getChartData, getImplementations } from "@/lib/data-transforms";
import { formatOps } from "@/lib/format";
import type { BenchmarkEntry } from "@/types/benchmark";

interface ThroughputChartProps {
	entries: BenchmarkEntry[];
}

export function ThroughputChart({ entries }: ThroughputChartProps) {
	const data = getChartData(entries, "search_ops_per_sec");
	const implementations = getImplementations(entries);

	return (
		<BenchmarkChart
			title="Search Throughput"
			description="Operations per second (higher is better)"
			data={data}
			implementations={implementations}
			valueFormatter={formatOps}
			yAxisLabel="ops/sec"
		/>
	);
}
