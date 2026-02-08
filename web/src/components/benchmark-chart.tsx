import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import type { ChartDataPoint } from "@/types/benchmark";
import { getImplColor } from "@/lib/colors";
import { shortScenario, shortImpl } from "@/lib/format";

interface BenchmarkChartProps {
	title: string;
	description: string;
	data: ChartDataPoint[];
	implementations: string[];
	valueFormatter: (value: number) => string;
	yAxisLabel?: string;
}

export function BenchmarkChart({
	title,
	description,
	data,
	implementations,
	valueFormatter,
	yAxisLabel,
}: BenchmarkChartProps) {
	// Shorten scenario names for chart display
	const chartData = data.map((d) => ({
		...d,
		scenario: shortScenario(d.scenario as string),
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={400}>
					<BarChart
						data={chartData}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
						<XAxis
							dataKey="scenario"
							className="text-xs"
							tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
						/>
						<YAxis
							className="text-xs"
							tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
							label={
								yAxisLabel
									? {
											value: yAxisLabel,
											angle: -90,
											position: "insideLeft",
											fill: "hsl(var(--muted-foreground))",
											fontSize: 12,
										}
									: undefined
							}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(var(--card))",
								border: "1px solid hsl(var(--border))",
								borderRadius: "var(--radius)",
								fontSize: 12,
							}}
							labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
							formatter={(
								value: number | undefined,
								name: string | undefined,
							) => [valueFormatter(value ?? 0), shortImpl(name ?? "")]}
						/>
						<Legend
							formatter={(value: string) => shortImpl(value)}
							wrapperStyle={{ fontSize: 12 }}
						/>
						{implementations.map((impl) => (
							<Bar
								key={impl}
								dataKey={impl}
								fill={getImplColor(impl)}
								radius={[2, 2, 0, 0]}
							/>
						))}
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
