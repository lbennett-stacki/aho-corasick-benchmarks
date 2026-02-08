import { createRequire } from "node:module";
import type { AhoCorasickAdapter, SearchMatch } from "../types.js";

const require = createRequire(import.meta.url);

export function createAdapter(): AhoCorasickAdapter {
	let AhoCorasickClass: any = null;
	let ac: any = null;

	try {
		const mod = require("@blackglory/aho-corasick");
		AhoCorasickClass = mod.AhoCorasick;
	} catch {
		throw new Error(
			"@blackglory/aho-corasick is not installed or failed to load. " +
				"A Rust toolchain is required to build this native addon.",
		);
	}

	return {
		name: "@blackglory/aho-corasick (native)",
		packageName: "@blackglory/aho-corasick",
		isNative: true,

		compile(patterns: string[]) {
			const unique = [...new Set(patterns)];
			ac = new AhoCorasickClass(unique, { caseSensitive: true });
		},

		searchRaw(text: string): unknown {
			if (!ac) throw new Error("compile() must be called before search()");
			return ac.findAll(text);
		},

		search(text: string): SearchMatch[] {
			const found = this.searchRaw(text) as string[];
			const results: SearchMatch[] = [];

			for (const keyword of found) {
				let searchFrom = 0;
				while (searchFrom <= text.length - keyword.length) {
					const idx = text.indexOf(keyword, searchFrom);
					if (idx === -1) break;
					results.push({
						start: idx,
						end: idx + keyword.length,
						keyword,
					});
					searchFrom = idx + 1;
				}
			}

			results.sort((a, b) => a.start - b.start || a.end - b.end);
			const deduped: SearchMatch[] = [];
			for (const r of results) {
				const prev = deduped[deduped.length - 1];
				if (
					!prev ||
					prev.start !== r.start ||
					prev.end !== r.end ||
					prev.keyword !== r.keyword
				) {
					deduped.push(r);
				}
			}
			return deduped;
		},

		dispose() {
			ac = null;
		},
	};
}
