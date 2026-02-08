export function formatNumber(n: number): string {
	if (!isFinite(n)) return "---";
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
	if (n >= 1) return n.toFixed(2);
	if (n >= 0.001) return n.toFixed(3);
	return n.toFixed(4);
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatMs(ms: number): string {
	if (ms < 0.001) return "<0.001 ms";
	if (ms < 1) return `${ms.toFixed(3)} ms`;
	if (ms < 1000) return `${ms.toFixed(2)} ms`;
	return `${(ms / 1000).toFixed(2)} s`;
}

export function formatOps(ops: number): string {
	if (!isFinite(ops)) return "---";
	if (ops >= 1_000_000) return `${(ops / 1_000_000).toFixed(1)}M ops/s`;
	if (ops >= 1_000) return `${(ops / 1_000).toFixed(1)}K ops/s`;
	return `${ops.toFixed(1)} ops/s`;
}

export function shortScenario(name: string): string {
	return name
		.replace("few-patterns-", "few/")
		.replace("many-patterns-", "many/")
		.replace("medium-balanced", "medium")
		.replace("small-text", "small")
		.replace("large-text", "large");
}

export function shortImpl(name: string): string {
	return name
		.replace("@blackglory/aho-corasick (native)", "blackglory (native)")
		.replace("@tanishiking/aho-corasick", "tanishiking")
		.replace("@monyone/aho-corasick", "monyone")
		.replace("modern-ahocorasick", "modern-ac")
		.replace("ahocorasick (BrunoRB)", "BrunoRB");
}
