import type { AhoCorasickAdapter } from "../types.js";

interface AdapterModule {
	createAdapter: () => AhoCorasickAdapter;
}

const ADAPTER_ENTRIES: Array<[string, () => Promise<AdapterModule>]> = [
	["modern-ahocorasick", () => import("./modern-ahocorasick.js")],
	["ahocorasick-brunorb", () => import("./ahocorasick-brunorb.js")],
	["tanishiking", () => import("./tanishiking.js")],
	["aho-corasick2", () => import("./aho-corasick2.js")],
	["blackglory", () => import("./blackglory.js")],
	["monyone", () => import("./monyone.js")],
];

export async function loadAllAdapters(): Promise<AhoCorasickAdapter[]> {
	const adapters: AhoCorasickAdapter[] = [];

	for (const [label, importFn] of ADAPTER_ENTRIES) {
		try {
			const mod = await importFn();
			const adapter = mod.createAdapter();
			adapters.push(adapter);
			console.log(`  [adapters] Loaded: ${adapter.name}`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			console.warn(`  [adapters] Skipped ${label}: ${msg}`);
		}
	}

	return adapters;
}
