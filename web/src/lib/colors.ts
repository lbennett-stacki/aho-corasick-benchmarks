const PALETTE = [
	"hsl(221, 83%, 53%)", // blue
	"hsl(142, 71%, 45%)", // green
	"hsl(38, 92%, 50%)", // amber
	"hsl(0, 84%, 60%)", // red
	"hsl(262, 83%, 58%)", // purple
	"hsl(186, 72%, 48%)", // cyan
	"hsl(330, 80%, 60%)", // pink
	"hsl(24, 95%, 53%)", // orange
];

const implColorMap = new Map<string, string>();

export function getImplColor(impl: string): string {
	if (!implColorMap.has(impl)) {
		implColorMap.set(impl, PALETTE[implColorMap.size % PALETTE.length]);
	}
	return implColorMap.get(impl)!;
}

export function resetColors(): void {
	implColorMap.clear();
}

export function getColorMap(implementations: string[]): Map<string, string> {
	for (const impl of implementations) {
		getImplColor(impl);
	}
	return new Map(implColorMap);
}
