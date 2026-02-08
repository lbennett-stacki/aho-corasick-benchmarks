export interface BenchmarkEntry {
	implementation: string;
	scenario: string;
	metric: string;
	value: number;
	unit: string;
	status: string;
}

export interface BenchmarkRow {
	implementation: string;
	scenario: string;
	status: string;
	compileTimeMedianMs: number;
	searchOpsPerSec: number;
	searchTimeMedianMs: number;
	searchTimeP95Ms: number;
	searchTimeP99Ms: number;
	totalMatches: number;
	memoryDeltaBytes: number;
}

export interface SummaryStats {
	bestThroughput: { implementation: string; value: number; scenario: string };
	fastestCompile: { implementation: string; value: number; scenario: string };
	lowestMemory: { implementation: string; value: number; scenario: string };
	implementationCount: number;
	scenarioCount: number;
}

export type ChartDataPoint = {
	scenario: string;
	[implementation: string]: string | number;
};

export interface MatchValidationRow {
	scenario: string;
	counts: Record<string, number>;
	hasDivergence: boolean;
}

export const METRIC_KEYS = [
	"compile_time_median_ms",
	"search_ops_per_sec",
	"search_time_median_ms",
	"search_time_p95_ms",
	"search_time_p99_ms",
	"total_matches",
	"memory_delta_bytes",
] as const;

export type MetricKey = (typeof METRIC_KEYS)[number];
