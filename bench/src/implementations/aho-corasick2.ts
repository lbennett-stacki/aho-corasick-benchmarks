import AhoCorasick from "aho-corasick2";
import type { AhoCorasickAdapter, SearchMatch } from "../types.js";

export function createAdapter(): AhoCorasickAdapter {
	let ac: any = null;
	let compiledPatterns: string[] = [];

	return {
		name: "aho-corasick2",
		packageName: "aho-corasick2",
		isNative: false,

		compile(patterns: string[]) {
			compiledPatterns = patterns;
			ac = new (AhoCorasick as any)();
			for (const word of patterns) {
				ac.add(word, { word });
			}
			ac.build_fail();
		},

		searchRaw(text: string): unknown {
			if (!ac) throw new Error("compile() must be called before search()");
			return ac.search(text);
		},

		search(text: string): SearchMatch[] {
			const raw = this.searchRaw(text) as {
				matches?: Record<string, number[]>;
			};
			const results: SearchMatch[] = [];

			if (raw && raw.matches) {
				for (const [keyword, positions] of Object.entries(raw.matches)) {
					for (const endPos of positions) {
						results.push({
							start: endPos,
							end: endPos + keyword.length,
							keyword,
						});
					}
				}
			}

			results.sort((a, b) => a.start - b.start || a.end - b.end);
			return results;
		},

		dispose() {
			ac = null;
			compiledPatterns = [];
		},
	};
}
