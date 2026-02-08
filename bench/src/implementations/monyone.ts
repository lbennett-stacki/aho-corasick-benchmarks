import { AhoCorasick } from "@monyone/aho-corasick";
import type { AhoCorasickAdapter, SearchMatch } from "../types.js";

export function createAdapter(): AhoCorasickAdapter {
	let ac: AhoCorasick | null = null;

	return {
		name: "@monyone/aho-corasick",
		packageName: "@monyone/aho-corasick",
		isNative: false,

		compile(patterns: string[]) {
			ac = new AhoCorasick(patterns);
		},

		searchRaw(text: string): unknown {
			if (!ac) throw new Error("compile() must be called before search()");
			return ac.matchInText(text);
		},

		search(text: string): SearchMatch[] {
			const raw = this.searchRaw(text) as {
				begin: number;
				end: number;
				keyword: string;
			}[];
			const results: SearchMatch[] = raw.map((m) => ({
				start: m.begin,
				end: m.end,
				keyword: m.keyword,
			}));
			results.sort((a, b) => a.start - b.start || a.end - b.end);
			return results;
		},

		dispose() {
			ac = null;
		},
	};
}
