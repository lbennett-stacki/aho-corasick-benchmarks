import type {
	BenchmarkEntry,
	BenchmarkRow,
	ChartDataPoint,
	SummaryStats,
	MatchValidationRow,
} from "@/types/benchmark";

export function getScenarios(entries: BenchmarkEntry[]): string[] {
	const seen = new Set<string>();
	return entries.reduce<string[]>((acc, e) => {
		if (!seen.has(e.scenario)) {
			seen.add(e.scenario);
			acc.push(e.scenario);
		}
		return acc;
	}, []);
}

export function getImplementations(entries: BenchmarkEntry[]): string[] {
	const seen = new Set<string>();
	return entries.reduce<string[]>((acc, e) => {
		if (!seen.has(e.implementation)) {
			seen.add(e.implementation);
			acc.push(e.implementation);
		}
		return acc;
	}, []);
}

export function pivotToRows(entries: BenchmarkEntry[]): BenchmarkRow[] {
	const map = new Map<string, BenchmarkRow>();

	for (const e of entries) {
		const key = `${e.implementation}::${e.scenario}`;
		if (!map.has(key)) {
			map.set(key, {
				implementation: e.implementation,
				scenario: e.scenario,
				status: e.status,
				compileTimeMedianMs: 0,
				searchOpsPerSec: 0,
				searchTimeMedianMs: 0,
				searchTimeP95Ms: 0,
				searchTimeP99Ms: 0,
				totalMatches: 0,
				memoryDeltaBytes: 0,
			});
		}
		const row = map.get(key)!;
		switch (e.metric) {
			case "compile_time_median_ms":
				row.compileTimeMedianMs = e.value;
				break;
			case "search_ops_per_sec":
				row.searchOpsPerSec = e.value;
				break;
			case "search_time_median_ms":
				row.searchTimeMedianMs = e.value;
				break;
			case "search_time_p95_ms":
				row.searchTimeP95Ms = e.value;
				break;
			case "search_time_p99_ms":
				row.searchTimeP99Ms = e.value;
				break;
			case "total_matches":
				row.totalMatches = e.value;
				break;
			case "memory_delta_bytes":
				row.memoryDeltaBytes = e.value;
				break;
		}
	}

	return [...map.values()];
}

export function getChartData(
	entries: BenchmarkEntry[],
	metric: string,
): ChartDataPoint[] {
	const scenarios = getScenarios(entries);
	const implementations = getImplementations(entries);

	return scenarios.map((scenario) => {
		const point: ChartDataPoint = { scenario };
		for (const impl of implementations) {
			const entry = entries.find(
				(e) =>
					e.scenario === scenario &&
					e.implementation === impl &&
					e.metric === metric,
			);
			point[impl] = entry?.value ?? 0;
		}
		return point;
	});
}

export function getSummaryStats(entries: BenchmarkEntry[]): SummaryStats {
	const rows = pivotToRows(entries);
	const okRows = rows.filter((r) => r.status === "ok");

	let bestThroughput = { implementation: "", value: 0, scenario: "" };
	for (const r of okRows) {
		if (r.searchOpsPerSec > bestThroughput.value) {
			bestThroughput = {
				implementation: r.implementation,
				value: r.searchOpsPerSec,
				scenario: r.scenario,
			};
		}
	}

	let fastestCompile = { implementation: "", value: Infinity, scenario: "" };
	for (const r of okRows) {
		if (
			r.compileTimeMedianMs > 0 &&
			r.compileTimeMedianMs < fastestCompile.value
		) {
			fastestCompile = {
				implementation: r.implementation,
				value: r.compileTimeMedianMs,
				scenario: r.scenario,
			};
		}
	}
	if (fastestCompile.value === Infinity) fastestCompile.value = 0;

	let lowestMemory = { implementation: "", value: Infinity, scenario: "" };
	for (const r of okRows) {
		if (r.memoryDeltaBytes >= 0 && r.memoryDeltaBytes < lowestMemory.value) {
			lowestMemory = {
				implementation: r.implementation,
				value: r.memoryDeltaBytes,
				scenario: r.scenario,
			};
		}
	}
	if (lowestMemory.value === Infinity) lowestMemory.value = 0;

	return {
		bestThroughput,
		fastestCompile,
		lowestMemory,
		implementationCount: getImplementations(entries).length,
		scenarioCount: getScenarios(entries).length,
	};
}

export function getMatchValidation(
	entries: BenchmarkEntry[],
): MatchValidationRow[] {
	const scenarios = getScenarios(entries);
	const matchEntries = entries.filter((e) => e.metric === "total_matches");

	return scenarios.map((scenario) => {
		const counts: Record<string, number> = {};
		for (const e of matchEntries) {
			if (e.scenario === scenario) {
				counts[e.implementation] = e.value;
			}
		}
		const values = Object.values(counts);
		const hasDivergence = new Set(values).size > 1;
		return { scenario, counts, hasDivergence };
	});
}
