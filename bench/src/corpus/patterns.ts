import {
	mediumPatterns,
	extraWords,
	prefixes,
	suffixes,
	fewPatterns,
} from "./patterns/patterns.json";

export { fewPatterns, mediumPatterns, extraWords, prefixes, suffixes };

export function generateManyPatterns(): string[] {
	const baseWords = [...mediumPatterns];

	const seen = new Set<string>();
	const result: string[] = [];

	const addWord = (w: string) => {
		if (w.length >= 2 && !seen.has(w)) {
			seen.add(w);
			result.push(w);
		}
	};

	for (const w of baseWords) addWord(w);
	for (const w of extraWords) addWord(w);

	for (const prefix of prefixes) {
		for (const base of baseWords) {
			if (result.length >= 5000) break;
			addWord(prefix + base);
		}
		if (result.length >= 5000) break;
	}

	for (const suffix of suffixes) {
		for (const base of baseWords) {
			if (result.length >= 5000) break;
			addWord(base + suffix);
		}
		if (result.length >= 5000) break;
	}

	for (const prefix of prefixes) {
		for (const base of extraWords) {
			if (result.length >= 5000) break;
			addWord(prefix + base);
		}
		if (result.length >= 5000) break;
	}

	for (const suffix of suffixes) {
		for (const base of extraWords) {
			if (result.length >= 5000) break;
			addWord(base + suffix);
		}
		if (result.length >= 5000) break;
	}

	return result.slice(0, 5000);
}
