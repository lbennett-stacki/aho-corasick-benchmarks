import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { SummaryCards } from "@/components/summary-cards";
import { ThroughputChart } from "@/components/throughput-chart";
import { LatencyChart } from "@/components/latency-chart";
import { CompileChart } from "@/components/compile-chart";
import { MemoryChart } from "@/components/memory-chart";
import { ResultsTable } from "@/components/results-table";
import { MatchValidation } from "@/components/match-validation";
import { getSummaryStats } from "@/lib/data-transforms";
import { resetColors, getColorMap } from "@/lib/colors";
import { getImplementations } from "@/lib/data-transforms";
import { parseCSV, validateCSV } from "@/lib/csv-parser";
import { Upload } from "lucide-react";
import type { BenchmarkEntry } from "@/types/benchmark";
import { useMemo, useRef, useCallback } from "react";

interface DashboardProps {
	entries: BenchmarkEntry[];
	fileName: string;
	onReset: () => void;
	onUpload: (entries: BenchmarkEntry[], fileName: string) => void;
}

export function Dashboard({
	entries,
	fileName,
	onReset,
	onUpload,
}: DashboardProps) {
	const stats = useMemo(() => getSummaryStats(entries), [entries]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = (ev) => {
				const text = ev.target?.result as string;
				const parsed = parseCSV(text);
				const error = validateCSV(parsed);
				if (!error) onUpload(parsed, file.name);
			};
			reader.readAsText(file);
			e.target.value = "";
		},
		[onUpload],
	);

	useMemo(() => {
		resetColors();
		const impls = getImplementations(entries);
		getColorMap(impls);
	}, [entries]);

	return (
		<div className="min-h-screen">
			<input
				ref={fileInputRef}
				type="file"
				accept=".csv"
				className="hidden"
				onChange={handleFileChange}
			/>
			<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto max-w-7xl px-6 flex h-14 items-center justify-between">
					<div className="flex items-center gap-4">
						<h1 className="text-lg font-semibold">Aho-Corasick Benchmarks</h1>
						<Separator orientation="vertical" className="h-6" />
						<span className="text-sm text-muted-foreground">{fileName}</span>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => fileInputRef.current?.click()}
						>
							<Upload className="mr-2 h-3 w-3" />
							Load CSV
						</Button>
						<ThemeToggle />
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-6 py-6 space-y-6">
				<SummaryCards stats={stats} />

				<Tabs defaultValue="throughput" className="space-y-4">
					<TabsList>
						<TabsTrigger value="throughput">Search Throughput</TabsTrigger>
						<TabsTrigger value="latency">Search Latency</TabsTrigger>
						<TabsTrigger value="compile">Compile Time</TabsTrigger>
						<TabsTrigger value="memory">Memory</TabsTrigger>
					</TabsList>

					<TabsContent value="throughput">
						<ThroughputChart entries={entries} />
					</TabsContent>
					<TabsContent value="latency">
						<LatencyChart entries={entries} />
					</TabsContent>
					<TabsContent value="compile">
						<CompileChart entries={entries} />
					</TabsContent>
					<TabsContent value="memory">
						<MemoryChart entries={entries} />
					</TabsContent>
				</Tabs>

				<ResultsTable entries={entries} />

				<MatchValidation entries={entries} />
			</main>
		</div>
	);
}
