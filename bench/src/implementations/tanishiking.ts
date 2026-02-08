import { Trie } from "@tanishiking/aho-corasick";
import type { AhoCorasickAdapter, SearchMatch } from "../types.js";

export function createAdapter(): AhoCorasickAdapter {
	let trie: InstanceType<typeof Trie> | null = null;

	return {
		name: "@tanishiking/aho-corasick",
		packageName: "@tanishiking/aho-corasick",
		isNative: false,

		compile(patterns: string[]) {
			trie = new Trie(patterns);
		},

		searchRaw(text: string): unknown {
			if (!trie) throw new Error("compile() must be called before search()");
			return trie.parseText(text);
		},

		search(text: string): SearchMatch[] {
			const emits = this.searchRaw(text) as {
				start: number;
				end: number;
				keyword: string;
			}[];
			const results: SearchMatch[] = emits.map((e) => ({
				start: e.start,
				end: e.end + 1,
				keyword: e.keyword,
			}));
			results.sort((a, b) => a.start - b.start || a.end - b.end);
			return results;
		},

		dispose() {
			trie = null;
		},
	};
}
