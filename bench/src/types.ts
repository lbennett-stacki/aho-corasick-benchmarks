export interface SearchMatch {
	start: number;
	end: number;
	keyword: string;
}

export interface AhoCorasickAdapter {
	readonly name: string;
	readonly packageName: string;
	readonly isNative: boolean;

	compile(patterns: string[]): void;
	searchRaw(text: string): unknown;
	search(text: string): SearchMatch[];
	dispose(): void;
}

export interface BenchmarkScenario {
	name: string;
	description: string;
	patterns: string[];
	texts: string[];
}

export interface BenchmarkResult {
	implementation: string;
	scenario: string;
	status: "ok" | "failed";
	error?: string;
	compileTimeMedianMs: number;
	compileTimeSamples: number[];
	searchOpsPerSecond: number;
	searchTimeMedianMs: number;
	searchTimeSamples: number[];
	searchTimeP95Ms: number;
	searchTimeP99Ms: number;
	totalMatchesFound: number;
	memoryDeltaBytes: number;
}

export interface RunnerConfig {
	compileIterations: number;
	searchWarmupIterations: number;
	searchIterations: number;
}

export const DEFAULT_CONFIG: RunnerConfig = {
	compileIterations: 10,
	searchWarmupIterations: 5,
	searchIterations: 50,
};

export const QUICK_CONFIG: RunnerConfig = {
	compileIterations: 3,
	searchWarmupIterations: 2,
	searchIterations: 10,
};
