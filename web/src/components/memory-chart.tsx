import { BenchmarkChart } from "./benchmark-chart";
import { getChartData, getImplementations } from "@/lib/data-transforms";
import { formatBytes } from "@/lib/format";
import type { BenchmarkEntry } from "@/types/benchmark";

interface MemoryChartProps {
	entries: BenchmarkEntry[];
}

export function MemoryChart({ entries }: MemoryChartProps) {
	const data = getChartData(entries, "memory_delta_bytes");
	const implementations = getImplementations(entries);

	return (
		<BenchmarkChart
			title="Memory Overhead"
			description="Heap memory delta after compiling the automaton (lower is better)"
			data={data}
			implementations={implementations}
			valueFormatter={formatBytes}
			yAxisLabel="bytes"
		/>
	);
}
