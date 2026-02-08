import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_CONFIG, QUICK_CONFIG } from "../src/types.js";
import { loadAllAdapters } from "../src/implementations/index.js";
import { loadAllScenarios } from "../src/scenarios/index.js";
import { runBenchmarks } from "../src/runner.js";
import { writeCSV, writeMarkdown } from "../src/reporter/index.js";

async function main() {
	const args = process.argv.slice(2);
	const isQuick = args.includes("--quick");
	const config = isQuick ? QUICK_CONFIG : DEFAULT_CONFIG;

	console.log("╔══════════════════════════════════════════╗");
	console.log("║   Aho-Corasick Benchmark Suite           ║");
	console.log("╚══════════════════════════════════════════╝");
	console.log("");

	if (isQuick) {
		console.log("Mode: QUICK (fewer iterations for development)");
	} else {
		console.log("Mode: FULL");
	}
	console.log(
		`Config: ${config.compileIterations} compile iters, ${config.searchWarmupIterations} warmup, ${config.searchIterations} search iters`,
	);

	if (typeof globalThis.gc !== "function") {
		console.warn(
			"\n⚠ WARNING: --expose-gc not enabled. Memory measurements will be less accurate.",
		);
		console.warn(
			"  Run with: node --expose-gc --import tsx/esm scripts/run.ts\n",
		);
	}

	console.log("\nLoading adapters...");
	const adapters = await loadAllAdapters();
	if (adapters.length === 0) {
		console.error("No adapters loaded! Check your dependencies.");
		process.exit(1);
	}
	console.log(`\nLoaded ${adapters.length} adapter(s).`);

	console.log("\nLoading scenarios...");
	const scenarios = loadAllScenarios();
	console.log(`Loaded ${scenarios.length} scenario(s).`);

	console.log(
		`\nRunning ${adapters.length * scenarios.length} benchmark pairs...`,
	);
	const startTime = performance.now();
	const results = await runBenchmarks(adapters, scenarios, config);
	const totalTime = performance.now() - startTime;

	console.log(
		`\nAll benchmarks completed in ${(totalTime / 1000).toFixed(1)}s.`,
	);

	const resultsDir = join(process.cwd(), "results");
	mkdirSync(resultsDir, { recursive: true });

	const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
	const csvPath = join(resultsDir, `raw-${timestamp}.csv`);
	const mdPath = join(resultsDir, `report-${timestamp}.md`);

	const csvLatestPath = join(resultsDir, "raw-latest.csv");
	const mdLatestPath = join(resultsDir, "report-latest.md");

	writeCSV(results, csvPath);
	writeCSV(results, csvLatestPath);
	writeMarkdown(results, mdPath);
	writeMarkdown(results, mdLatestPath);

	console.log(`\nResults written to:`);
	console.log(`  CSV:      ${csvPath}`);
	console.log(`  Markdown: ${mdPath}`);
	console.log(`  (Also: ${csvLatestPath}, ${mdLatestPath})`);
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
