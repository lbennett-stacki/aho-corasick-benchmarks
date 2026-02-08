import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { prose } from "./patterns/prose.json";

function generateText(targetBytes: number): string {
	const paragraphs = prose.split("\n\n");
	const chunks: string[] = [];
	let totalLength = 0;

	let idx = 0;
	while (totalLength < targetBytes) {
		const para = paragraphs[idx % paragraphs.length];
		chunks.push(para);
		totalLength += para.length + 2; // +2 for \n\n
		idx++;
	}

	return chunks.join("\n\n").slice(0, targetBytes);
}

export function getSmallText(): string {
	return generateText(10 * 1024);
}

export function getMediumText(): string {
	return generateText(100 * 1024);
}

export function getLargeText(): string {
	const corpusPath = join(process.cwd(), "corpus", "large.txt");
	if (existsSync(corpusPath)) {
		return readFileSync(corpusPath, "utf-8");
	}
	console.warn(
		"  [corpus] large.txt not found, generating synthetic text. " +
			"Run `npm run setup-corpus` for real-world text.",
	);
	return generateText(1024 * 1024);
}
