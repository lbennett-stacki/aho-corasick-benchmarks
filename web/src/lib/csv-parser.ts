import type { BenchmarkEntry } from "@/types/benchmark";

export function parseCSV(csv: string): BenchmarkEntry[] {
	const lines = csv.trim().split("\n");
	if (lines.length < 2) return [];

	const entries: BenchmarkEntry[] = [];
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;

		const fields = parseCSVLine(line);
		if (fields.length < 6) continue;

		const [implementation, scenario, metric, valueStr, unit, status] = fields;
		const value = parseFloat(valueStr);

		if (metric === "error") continue; // skip error rows

		entries.push({
			implementation,
			scenario,
			metric,
			value: isNaN(value) ? 0 : value,
			unit,
			status,
		});
	}

	return entries;
}

function parseCSVLine(line: string): string[] {
	const fields: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (inQuotes) {
			if (ch === '"' && line[i + 1] === '"') {
				current += '"';
				i++;
			} else if (ch === '"') {
				inQuotes = false;
			} else {
				current += ch;
			}
		} else {
			if (ch === '"') {
				inQuotes = true;
			} else if (ch === ",") {
				fields.push(current);
				current = "";
			} else {
				current += ch;
			}
		}
	}
	fields.push(current);
	return fields;
}

export function validateCSV(entries: BenchmarkEntry[]): string | null {
	if (entries.length === 0) return "CSV file is empty or has no data rows.";

	const implementations = new Set(entries.map((e) => e.implementation));
	if (implementations.size === 0) return "No implementations found in CSV.";

	const scenarios = new Set(entries.map((e) => e.scenario));
	if (scenarios.size === 0) return "No scenarios found in CSV.";

	return null;
}
