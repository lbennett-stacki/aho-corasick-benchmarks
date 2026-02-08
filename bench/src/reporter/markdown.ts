import { writeFileSync } from "node:fs";
import { arch, platform, cpus } from "node:os";
import type { BenchmarkResult } from "../types.js";

export function writeMarkdown(
	results: BenchmarkResult[],
	filePath: string,
): void {
	const lines: string[] = [];

	lines.push("# Aho-Corasick Benchmark Results");
	lines.push("");
	lines.push("## System Information");
	lines.push("");
	const cpu = cpus()[0];
	lines.push(`| Property | Value |`);
	lines.push(`| --- | --- |`);
	lines.push(`| Date | ${new Date().toISOString()} |`);
	lines.push(`| Node.js | ${process.version} |`);
	lines.push(`| Platform | ${platform()} ${arch()} |`);
	lines.push(`| CPU | ${cpu?.model ?? "unknown"} |`);
	lines.push(`| CPU Cores | ${cpus().length} |`);
	lines.push("");

	const scenarios = [...new Set(results.map((r) => r.scenario))];
	const implementations = [...new Set(results.map((r) => r.implementation))];

	lines.push("## Search Throughput (ops/sec, higher is better)");
	lines.push("");
	lines.push(`| Implementation | ${scenarios.map((s) => s).join(" | ")} |`);
	lines.push(`| --- | ${scenarios.map(() => "---:").join(" | ")} |`);

	for (const impl of implementations) {
		const cells = scenarios.map((scen) => {
			const r = results.find(
				(r) => r.implementation === impl && r.scenario === scen,
			);
			if (!r || r.status === "failed") return "FAILED";
			return formatNumber(r.searchOpsPerSecond);
		});
		lines.push(`| ${impl} | ${cells.join(" | ")} |`);
	}
	lines.push("");

	lines.push("## Search Latency (median ms, lower is better)");
	lines.push("");
	lines.push(`| Implementation | ${scenarios.map((s) => s).join(" | ")} |`);
	lines.push(`| --- | ${scenarios.map(() => "---:").join(" | ")} |`);

	for (const impl of implementations) {
		const cells = scenarios.map((scen) => {
			const r = results.find(
				(r) => r.implementation === impl && r.scenario === scen,
			);
			if (!r || r.status === "failed") return "FAILED";
			return r.searchTimeMedianMs.toFixed(3);
		});
		lines.push(`| ${impl} | ${cells.join(" | ")} |`);
	}
	lines.push("");

	lines.push("## Compile Time (median ms, lower is better)");
	lines.push("");
	lines.push(`| Implementation | ${scenarios.map((s) => s).join(" | ")} |`);
	lines.push(`| --- | ${scenarios.map(() => "---:").join(" | ")} |`);

	for (const impl of implementations) {
		const cells = scenarios.map((scen) => {
			const r = results.find(
				(r) => r.implementation === impl && r.scenario === scen,
			);
			if (!r || r.status === "failed") return "FAILED";
			return r.compileTimeMedianMs.toFixed(3);
		});
		lines.push(`| ${impl} | ${cells.join(" | ")} |`);
	}
	lines.push("");

	lines.push("## Memory Overhead (bytes, lower is better)");
	lines.push("");
	lines.push(`| Implementation | ${scenarios.map((s) => s).join(" | ")} |`);
	lines.push(`| --- | ${scenarios.map(() => "---:").join(" | ")} |`);

	for (const impl of implementations) {
		const cells = scenarios.map((scen) => {
			const r = results.find(
				(r) => r.implementation === impl && r.scenario === scen,
			);
			if (!r || r.status === "failed") return "FAILED";
			return formatBytes(r.memoryDeltaBytes);
		});
		lines.push(`| ${impl} | ${cells.join(" | ")} |`);
	}
	lines.push("");

	lines.push("## Match Counts (for cross-validation)");
	lines.push("");
	lines.push(`| Implementation | ${scenarios.map((s) => s).join(" | ")} |`);
	lines.push(`| --- | ${scenarios.map(() => "---:").join(" | ")} |`);

	for (const impl of implementations) {
		const cells = scenarios.map((scen) => {
			const r = results.find(
				(r) => r.implementation === impl && r.scenario === scen,
			);
			if (!r || r.status === "failed") return "FAILED";
			return formatNumber(r.totalMatchesFound);
		});
		lines.push(`| ${impl} | ${cells.join(" | ")} |`);
	}
	lines.push("");

	writeFileSync(filePath, lines.join("\n"), "utf-8");
}

function formatNumber(n: number): string {
	if (!isFinite(n)) return "∞";
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
	return n.toFixed(2);
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
