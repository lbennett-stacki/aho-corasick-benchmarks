import { writeFileSync } from "node:fs";
import type { BenchmarkResult } from "../types.js";

export function writeCSV(results: BenchmarkResult[], filePath: string): void {
	const header = "implementation,scenario,metric,value,unit,status";
	const rows: string[] = [header];

	for (const r of results) {
		const impl = csvEscape(r.implementation);
		const scen = csvEscape(r.scenario);
		const status = r.status;

		if (r.status === "failed") {
			rows.push(
				`${impl},${scen},error,${csvEscape(r.error ?? "unknown")},text,${status}`,
			);
			continue;
		}

		rows.push(
			`${impl},${scen},compile_time_median_ms,${r.compileTimeMedianMs.toFixed(4)},ms,${status}`,
		);
		rows.push(
			`${impl},${scen},search_ops_per_sec,${r.searchOpsPerSecond.toFixed(2)},ops/sec,${status}`,
		);
		rows.push(
			`${impl},${scen},search_time_median_ms,${r.searchTimeMedianMs.toFixed(4)},ms,${status}`,
		);
		rows.push(
			`${impl},${scen},search_time_p95_ms,${r.searchTimeP95Ms.toFixed(4)},ms,${status}`,
		);
		rows.push(
			`${impl},${scen},search_time_p99_ms,${r.searchTimeP99Ms.toFixed(4)},ms,${status}`,
		);
		rows.push(
			`${impl},${scen},total_matches,${r.totalMatchesFound},count,${status}`,
		);
		rows.push(
			`${impl},${scen},memory_delta_bytes,${r.memoryDeltaBytes},bytes,${status}`,
		);
	}

	writeFileSync(filePath, rows.join("\n") + "\n", "utf-8");
}

function csvEscape(value: string): string {
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}
