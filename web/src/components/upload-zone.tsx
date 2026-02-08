import { useCallback, useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { parseCSV, validateCSV } from "@/lib/csv-parser";
import type { BenchmarkEntry } from "@/types/benchmark";
interface UploadZoneProps {
	onDataLoaded: (entries: BenchmarkEntry[], fileName: string) => void;
}

export function UploadZone({ onDataLoaded }: UploadZoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const processCSV = useCallback(
		(text: string, fileName: string) => {
			const entries = parseCSV(text);
			const validationError = validateCSV(entries);
			if (validationError) {
				setError(validationError);
				return;
			}
			setError(null);
			onDataLoaded(entries, fileName);
		},
		[onDataLoaded],
	);

	const handleFile = useCallback(
		(file: File) => {
			if (!file.name.endsWith(".csv")) {
				setError("Please upload a .csv file.");
				return;
			}
			setLoading(true);
			const reader = new FileReader();
			reader.onload = (e) => {
				setLoading(false);
				processCSV(e.target?.result as string, file.name);
			};
			reader.onerror = () => {
				setLoading(false);
				setError("Failed to read file.");
			};
			reader.readAsText(file);
		},
		[processCSV],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files[0];
			if (file) handleFile(file);
		},
		[handleFile],
	);

	const handleLoadLatest = useCallback(() => {
		setError(null);
		// Latest results are now loaded by default in App.tsx
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center p-8">
			<div className="w-full max-w-lg space-y-6">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">
						Aho-Corasick Benchmarks
					</h1>
					<p className="text-muted-foreground">
						Upload a benchmark results CSV to visualize performance comparisons
						across implementations.
					</p>
				</div>

				<Card>
					<CardContent className="p-0">
						<div
							className={`relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 transition-colors ${
								isDragging
									? "border-primary bg-primary/5"
									: "border-muted-foreground/25 hover:border-muted-foreground/50"
							}`}
							onDragOver={(e) => {
								e.preventDefault();
								setIsDragging(true);
							}}
							onDragLeave={() => setIsDragging(false)}
							onDrop={handleDrop}
						>
							{loading ? (
								<Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
							) : (
								<Upload className="h-10 w-10 text-muted-foreground" />
							)}
							<div className="text-center space-y-1">
								<p className="text-sm font-medium">
									Drag & drop your CSV file here
								</p>
								<p className="text-xs text-muted-foreground">
									or click to browse
								</p>
							</div>
							<input
								ref={inputRef}
								type="file"
								accept=".csv"
								className="absolute inset-0 cursor-pointer opacity-0"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) handleFile(file);
								}}
							/>
						</div>
					</CardContent>
				</Card>

				{error && (
					<p className="text-sm text-destructive text-center">{error}</p>
				)}

				<div className="flex items-center gap-4">
					<div className="h-px flex-1 bg-border" />
					<span className="text-xs text-muted-foreground uppercase">or</span>
					<div className="h-px flex-1 bg-border" />
				</div>

				<Button
					variant="outline"
					className="w-full"
					onClick={handleLoadLatest}
					disabled={loading}
				>
					<Upload className="mr-2 h-4 w-4" />
					Load Latest Results
				</Button>
			</div>
		</div>
	);
}
