import { Zap, Clock, HardDrive, Box } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SummaryStats } from "@/types/benchmark";
import { formatOps, formatMs, formatBytes, shortImpl } from "@/lib/format";

interface SummaryCardsProps {
	stats: SummaryStats;
}

export function SummaryCards({ stats }: SummaryCardsProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Best Search Throughput
					</CardTitle>
					<Zap className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatOps(stats.bestThroughput.value)}
					</div>
					<div className="flex items-center gap-2 mt-1">
						<Badge variant="secondary" className="text-xs">
							{shortImpl(stats.bestThroughput.implementation)}
						</Badge>
						<span className="text-xs text-muted-foreground">
							{stats.bestThroughput.scenario}
						</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Fastest Compile</CardTitle>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatMs(stats.fastestCompile.value)}
					</div>
					<div className="flex items-center gap-2 mt-1">
						<Badge variant="secondary" className="text-xs">
							{shortImpl(stats.fastestCompile.implementation)}
						</Badge>
						<span className="text-xs text-muted-foreground">
							{stats.fastestCompile.scenario}
						</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Lowest Memory</CardTitle>
					<HardDrive className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{formatBytes(stats.lowestMemory.value)}
					</div>
					<div className="flex items-center gap-2 mt-1">
						<Badge variant="secondary" className="text-xs">
							{shortImpl(stats.lowestMemory.implementation)}
						</Badge>
						<span className="text-xs text-muted-foreground">
							{stats.lowestMemory.scenario}
						</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Tested</CardTitle>
					<Box className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{stats.implementationCount} implementations
					</div>
					<p className="text-xs text-muted-foreground mt-1">
						across {stats.scenarioCount} scenarios
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
