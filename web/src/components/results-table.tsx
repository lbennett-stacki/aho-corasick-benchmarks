import { useState, useMemo } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { pivotToRows, getScenarios } from "@/lib/data-transforms";
import { formatMs, formatOps, formatBytes, shortImpl } from "@/lib/format";
import type { BenchmarkEntry, BenchmarkRow } from "@/types/benchmark";

interface ResultsTableProps {
	entries: BenchmarkEntry[];
}

type SortKey = keyof BenchmarkRow;
type SortDir = "asc" | "desc";

export function ResultsTable({ entries }: ResultsTableProps) {
	const scenarios = getScenarios(entries);
	const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
	const [sortKey, setSortKey] = useState<SortKey>("searchOpsPerSec");
	const [sortDir, setSortDir] = useState<SortDir>("desc");

	const allRows = useMemo(() => pivotToRows(entries), [entries]);

	const filteredRows = useMemo(() => {
		const rows = selectedScenario
			? allRows.filter((r) => r.scenario === selectedScenario)
			: allRows;

		return [...rows].sort((a, b) => {
			const aVal = a[sortKey];
			const bVal = b[sortKey];
			if (typeof aVal === "number" && typeof bVal === "number") {
				return sortDir === "asc" ? aVal - bVal : bVal - aVal;
			}
			return sortDir === "asc"
				? String(aVal).localeCompare(String(bVal))
				: String(bVal).localeCompare(String(aVal));
		});
	}, [allRows, selectedScenario, sortKey, sortDir]);

	const toggleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortDir(sortDir === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortDir(
				key === "implementation" || key === "scenario" ? "asc" : "desc",
			);
		}
	};

	const SortButton = ({
		column,
		children,
	}: {
		column: SortKey;
		children: React.ReactNode;
	}) => (
		<button
			className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
			onClick={() => toggleSort(column)}
		>
			{children}
			<ArrowUpDown className="h-3 w-3" />
		</button>
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Detailed Results</CardTitle>
				<div className="flex flex-wrap gap-1 mt-2">
					<Button
						variant={selectedScenario === null ? "default" : "outline"}
						size="sm"
						onClick={() => setSelectedScenario(null)}
					>
						All
					</Button>
					{scenarios.map((s) => (
						<Button
							key={s}
							variant={selectedScenario === s ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedScenario(s)}
						>
							{s}
						</Button>
					))}
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<SortButton column="implementation">Implementation</SortButton>
							</TableHead>
							{!selectedScenario && (
								<TableHead>
									<SortButton column="scenario">Scenario</SortButton>
								</TableHead>
							)}
							<TableHead className="text-right">
								<SortButton column="searchOpsPerSec">Throughput</SortButton>
							</TableHead>
							<TableHead className="text-right">
								<SortButton column="searchTimeMedianMs">Latency</SortButton>
							</TableHead>
							<TableHead className="text-right">
								<SortButton column="compileTimeMedianMs">Compile</SortButton>
							</TableHead>
							<TableHead className="text-right">
								<SortButton column="memoryDeltaBytes">Memory</SortButton>
							</TableHead>
							<TableHead className="text-right">
								<SortButton column="totalMatches">Matches</SortButton>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredRows.map((row, i) => (
							<TableRow key={i}>
								<TableCell className="font-medium">
									{shortImpl(row.implementation)}
									{row.status === "failed" && (
										<Badge variant="destructive" className="ml-2">
											Failed
										</Badge>
									)}
								</TableCell>
								{!selectedScenario && (
									<TableCell className="text-muted-foreground text-xs">
										{row.scenario}
									</TableCell>
								)}
								<TableCell className="text-right font-mono text-sm">
									{formatOps(row.searchOpsPerSec)}
								</TableCell>
								<TableCell className="text-right font-mono text-sm">
									{formatMs(row.searchTimeMedianMs)}
								</TableCell>
								<TableCell className="text-right font-mono text-sm">
									{formatMs(row.compileTimeMedianMs)}
								</TableCell>
								<TableCell className="text-right font-mono text-sm">
									{formatBytes(row.memoryDeltaBytes)}
								</TableCell>
								<TableCell className="text-right font-mono text-sm">
									{row.totalMatches.toLocaleString()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
