import { performance } from "node:perf_hooks";
import type {
	AhoCorasickAdapter,
	BenchmarkScenario,
	BenchmarkResult,
	RunnerConfig,
} from "./types.js";
import { median, percentile, filterOutliers } from "./stats.js";

function forceGC(): void {
	if (typeof globalThis.gc === "function") {
		globalThis.gc();
	}
}

function benchmarkPair(
	adapter: AhoCorasickAdapter,
	scenario: BenchmarkScenario,
	config: RunnerConfig,
): BenchmarkResult {
	const { patterns, texts } = scenario;

	adapter.compile(patterns);
	let totalMatchesFound = 0;
	for (const text of texts) {
		const matches = adapter.search(text);
		totalMatchesFound += matches.length;
	}
	adapter.dispose();

	const compileTimeSamples: number[] = [];
	for (let i = 0; i < config.compileIterations; i++) {
		adapter.dispose();
		forceGC();

		const start = performance.now();
		adapter.compile(patterns);
		const elapsed = performance.now() - start;
		compileTimeSamples.push(elapsed);
	}
	adapter.dispose();

	forceGC();
	const heapBefore = process.memoryUsage().heapUsed;
	adapter.compile(patterns);
	forceGC();
	const heapAfter = process.memoryUsage().heapUsed;
	const memoryDeltaBytes = Math.max(0, heapAfter - heapBefore);

	for (let i = 0; i < config.searchWarmupIterations; i++) {
		for (const text of texts) {
			adapter.searchRaw(text);
		}
	}

	const searchTimeSamples: number[] = [];
	for (let i = 0; i < config.searchIterations; i++) {
		const start = performance.now();
		for (const text of texts) {
			adapter.searchRaw(text);
		}
		const elapsed = performance.now() - start;
		searchTimeSamples.push(elapsed);
	}

	adapter.dispose();

	const filteredCompile = filterOutliers(compileTimeSamples);
	const compileTimeMedianMs = median(filteredCompile);

	const filteredSearch = filterOutliers(searchTimeSamples);
	const searchTimeMedianMs = median(filteredSearch);
	const searchTimeP95Ms = percentile(filteredSearch, 95);
	const searchTimeP99Ms = percentile(filteredSearch, 99);
	const searchOpsPerSecond =
		searchTimeMedianMs > 0 ? 1000 / searchTimeMedianMs : Infinity;

	return {
		implementation: adapter.name,
		scenario: scenario.name,
		status: "ok",
		compileTimeMedianMs,
		compileTimeSamples,
		searchOpsPerSecond,
		searchTimeMedianMs,
		searchTimeSamples,
		searchTimeP95Ms,
		searchTimeP99Ms,
		totalMatchesFound,
		memoryDeltaBytes,
	};
}

export async function runBenchmarks(
	adapters: AhoCorasickAdapter[],
	scenarios: BenchmarkScenario[],
	config: RunnerConfig,
): Promise<BenchmarkResult[]> {
	const results: BenchmarkResult[] = [];
	const totalPairs = adapters.length * scenarios.length;
	let pairIdx = 0;

	for (const scenario of scenarios) {
		console.log(`\n━━━ Scenario: ${scenario.name} ━━━`);
		console.log(`    ${scenario.description}`);
		console.log(
			`    Patterns: ${scenario.patterns.length}, Texts: ${scenario.texts.length} (${formatBytes(totalTextBytes(scenario.texts))})`,
		);

		const matchCounts = new Map<string, number>();

		for (const adapter of adapters) {
			pairIdx++;
			const progress = `[${pairIdx}/${totalPairs}]`;
			process.stdout.write(`  ${progress} ${adapter.name}... `);

			try {
				const result = benchmarkPair(adapter, scenario, config);
				results.push(result);

				matchCounts.set(adapter.name, result.totalMatchesFound);

				console.log(
					`${result.searchOpsPerSecond.toFixed(1)} ops/s | ` +
						`compile: ${result.compileTimeMedianMs.toFixed(2)}ms | ` +
						`memory: ${formatBytes(result.memoryDeltaBytes)} | ` +
						`matches: ${result.totalMatchesFound}`,
				);
			} catch (err) {
				const errorMsg = err instanceof Error ? err.message : String(err);
				console.log(`FAILED: ${errorMsg}`);
				results.push({
					implementation: adapter.name,
					scenario: scenario.name,
					status: "failed",
					error: errorMsg,
					compileTimeMedianMs: 0,
					compileTimeSamples: [],
					searchOpsPerSecond: 0,
					searchTimeMedianMs: 0,
					searchTimeSamples: [],
					searchTimeP95Ms: 0,
					searchTimeP99Ms: 0,
					totalMatchesFound: 0,
					memoryDeltaBytes: 0,
				});
			}
		}

		crossValidateMatches(matchCounts, scenario.name);
	}

	return results;
}

function crossValidateMatches(
	matchCounts: Map<string, number>,
	scenarioName: string,
): void {
	const counts = [...matchCounts.values()].filter((c) => c > 0);
	if (counts.length <= 1) return;

	const uniqueCounts = new Set(counts);
	if (uniqueCounts.size > 1) {
		console.log(`  ⚠ Match count divergence in "${scenarioName}":`);
		for (const [name, count] of matchCounts) {
			console.log(`    ${name}: ${count}`);
		}
		console.log(
			"    (This is expected -- packages differ in overlap/substring handling)",
		);
	}
}

function totalTextBytes(texts: string[]): number {
	return texts.reduce((sum, t) => sum + Buffer.byteLength(t, "utf-8"), 0);
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
