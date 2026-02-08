import { BenchmarkChart } from "./benchmark-chart";
import { getChartData, getImplementations } from "@/lib/data-transforms";
import { formatMs } from "@/lib/format";
import type { BenchmarkEntry } from "@/types/benchmark";

interface CompileChartProps {
	entries: BenchmarkEntry[];
}

export function CompileChart({ entries }: CompileChartProps) {
	const data = getChartData(entries, "compile_time_median_ms");
	const implementations = getImplementations(entries);

	return (
		<BenchmarkChart
			title="Compile Time"
			description="Time to build the automaton in milliseconds (lower is better)"
			data={data}
			implementations={implementations}
			valueFormatter={formatMs}
			yAxisLabel="ms"
		/>
	);
}
