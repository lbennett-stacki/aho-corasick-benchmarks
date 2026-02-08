import { useState, useCallback } from "react";
import { Dashboard } from "@/components/dashboard";
import { parseCSV } from "@/lib/csv-parser";
import type { BenchmarkEntry } from "@/types/benchmark";
import latestResultsCSV from "../../bench/results/raw-latest.csv?raw";

const defaultData = {
	entries: parseCSV(latestResultsCSV),
	fileName: "raw-latest.csv",
};

export default function App() {
	const [data, setData] = useState<{
		entries: BenchmarkEntry[];
		fileName: string;
	}>(defaultData);

	const handleDataLoaded = useCallback(
		(entries: BenchmarkEntry[], fileName: string) => {
			setData({ entries, fileName });
		},
		[],
	);

	const handleReset = useCallback(() => {
		setData(defaultData);
	}, []);

	return (
		<Dashboard
			entries={data.entries}
			fileName={data.fileName}
			onReset={handleReset}
			onUpload={handleDataLoaded}
		/>
	);
}
