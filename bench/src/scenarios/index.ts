import type { BenchmarkScenario } from "../types.js";
import {
	fewPatternsSmallText,
	fewPatternsLargeText,
	manyPatternsSmallText,
	manyPatternsLargeText,
	mediumBalanced,
} from "./definitions.js";

export function loadAllScenarios(): BenchmarkScenario[] {
	return [
		fewPatternsSmallText(),
		fewPatternsLargeText(),
		mediumBalanced(),
		manyPatternsSmallText(),
		manyPatternsLargeText(),
	];
}
