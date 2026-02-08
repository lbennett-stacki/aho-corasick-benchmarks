import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const CORPUS_DIR = join(process.cwd(), "corpus");

async function downloadLargeCorpus(): Promise<void> {
	const targetPath = join(CORPUS_DIR, "large.txt");

	if (existsSync(targetPath)) {
		console.log("[setup-corpus] large.txt already exists, skipping download.");
		return;
	}

	const url = "https://www.gutenberg.org/cache/epub/2600/pg2600.txt";
	console.log(`[setup-corpus] Downloading War and Peace from ${url}...`);

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to download: ${response.status} ${response.statusText}`,
		);
	}

	let text = await response.text();

	const startMarker = "*** START OF THE PROJECT GUTENBERG EBOOK";
	const endMarker = "*** END OF THE PROJECT GUTENBERG EBOOK";
	const startIdx = text.indexOf(startMarker);
	const endIdx = text.indexOf(endMarker);
	if (startIdx !== -1 && endIdx !== -1) {
		text = text.slice(text.indexOf("\n", startIdx) + 1, endIdx);
	}

	const TARGET_SIZE = 1024 * 1024;
	if (text.length > TARGET_SIZE) {
		text = text.slice(0, TARGET_SIZE);
		const lastPeriod = text.lastIndexOf(".");
		if (lastPeriod > TARGET_SIZE * 0.9) {
			text = text.slice(0, lastPeriod + 1);
		}
	}

	mkdirSync(CORPUS_DIR, { recursive: true });
	writeFileSync(targetPath, text, "utf-8");
	console.log(
		`[setup-corpus] Saved ${(text.length / 1024).toFixed(1)} KB to ${targetPath}`,
	);
}

async function main() {
	console.log("[setup-corpus] Setting up corpus data...\n");
	await downloadLargeCorpus();
	console.log("\n[setup-corpus] Done!");
}

main().catch((err) => {
	console.error("[setup-corpus] Error:", err);
	process.exit(1);
});
