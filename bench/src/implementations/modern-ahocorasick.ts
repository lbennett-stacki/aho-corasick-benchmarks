import AhoCorasick from "modern-ahocorasick";
import type { AhoCorasickAdapter, SearchMatch } from "../types.js";

export function createAdapter(): AhoCorasickAdapter {
	let ac: AhoCorasick | null = null;

	return {
		name: "modern-ahocorasick",
		packageName: "modern-ahocorasick",
		isNative: false,

		compile(patterns: string[]) {
			ac = new AhoCorasick(patterns);
		},

		searchRaw(text: string): unknown {
			if (!ac) throw new Error("compile() must be called before search()");
			return ac.search(text);
		},

		search(text: string): SearchMatch[] {
			const raw = this.searchRaw(text) as [number, string[]][];
			const results: SearchMatch[] = [];
			for (const [endIdx, keywords] of raw) {
				for (const keyword of keywords) {
					results.push({
						start: endIdx - keyword.length + 1,
						end: endIdx + 1,
						keyword,
					});
				}
			}
			results.sort((a, b) => a.start - b.start || a.end - b.end);
			return results;
		},

		dispose() {
			ac = null;
		},
	};
}
