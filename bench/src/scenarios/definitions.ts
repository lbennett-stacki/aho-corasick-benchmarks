import type { BenchmarkScenario } from "../types.js";
import {
	fewPatterns,
	mediumPatterns,
	generateManyPatterns,
	getSmallText,
	getMediumText,
	getLargeText,
} from "../corpus/index.js";

export function fewPatternsSmallText(): BenchmarkScenario {
	return {
		name: "few-patterns-small-text",
		description: "20 patterns, ~10 KB text — baseline sanity check",
		patterns: fewPatterns,
		texts: [getSmallText()],
	};
}

export function fewPatternsLargeText(): BenchmarkScenario {
	return {
		name: "few-patterns-large-text",
		description: "20 patterns, ~1 MB text — search scaling with text size",
		patterns: fewPatterns,
		texts: [getLargeText()],
	};
}

export function manyPatternsSmallText(): BenchmarkScenario {
	return {
		name: "many-patterns-small-text",
		description: "5,000 patterns, ~10 KB text — compile-heavy, few matches",
		patterns: generateManyPatterns(),
		texts: [getSmallText()],
	};
}

export function manyPatternsLargeText(): BenchmarkScenario {
	return {
		name: "many-patterns-large-text",
		description: "5,000 patterns, ~1 MB text — full stress test",
		patterns: generateManyPatterns(),
		texts: [getLargeText()],
	};
}

export function mediumBalanced(): BenchmarkScenario {
	return {
		name: "medium-balanced",
		description: "500 patterns, ~100 KB text — balanced real-world scenario",
		patterns: mediumPatterns,
		texts: [getMediumText()],
	};
}
