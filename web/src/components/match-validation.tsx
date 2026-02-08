import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMatchValidation, getImplementations } from "@/lib/data-transforms";
import { shortImpl } from "@/lib/format";
import type { BenchmarkEntry } from "@/types/benchmark";

interface MatchValidationProps {
	entries: BenchmarkEntry[];
}

export function MatchValidation({ entries }: MatchValidationProps) {
	const validation = getMatchValidation(entries);
	const implementations = getImplementations(entries);
	const hasDivergences = validation.some((v) => v.hasDivergence);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Match Count Validation</CardTitle>
				<CardDescription>
					{hasDivergences
						? "Some scenarios show different match counts across implementations. This is expected due to different overlap handling."
						: "All implementations agree on match counts across all scenarios."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Scenario</TableHead>
							{implementations.map((impl) => (
								<TableHead key={impl} className="text-right text-xs">
									{shortImpl(impl)}
								</TableHead>
							))}
							<TableHead className="text-center">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{validation.map((row) => (
							<TableRow key={row.scenario}>
								<TableCell className="font-medium text-sm">
									{row.scenario}
								</TableCell>
								{implementations.map((impl) => (
									<TableCell
										key={impl}
										className="text-right font-mono text-sm"
									>
										{(row.counts[impl] ?? 0).toLocaleString()}
									</TableCell>
								))}
								<TableCell className="text-center">
									{row.hasDivergence ? (
										<Badge
											variant="outline"
											className="text-amber-600 border-amber-600"
										>
											Divergent
										</Badge>
									) : (
										<Badge variant="secondary">OK</Badge>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
