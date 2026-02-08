export function sorted(values: number[]): number[] {
	return [...values].sort((a, b) => a - b);
}

export function mean(values: number[]): number {
	return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function median(values: number[]): number {
	return percentile(values, 50);
}

export function percentile(values: number[], p: number): number {
	const s = sorted(values);
	if (s.length === 1) return s[0];
	const idx = (p / 100) * (s.length - 1);
	const lo = Math.floor(idx);
	const hi = Math.ceil(idx);
	const frac = idx - lo;
	return s[lo] + frac * (s[hi] - s[lo]);
}

export function mad(values: number[]): number {
	const med = median(values);
	const deviations = values.map((v) => Math.abs(v - med));
	return median(deviations);
}

export function filterOutliers(values: number[], factor = 2): number[] {
	const med = median(values);
	const madVal = mad(values);
	if (madVal === 0) return values;
	return values.filter((v) => Math.abs(v - med) <= factor * madVal);
}

export function stddev(values: number[]): number {
	const m = mean(values);
	const variance =
		values.reduce((sum, v) => sum + (v - m) ** 2, 0) / values.length;
	return Math.sqrt(variance);
}

export function cv(values: number[]): number {
	const m = mean(values);
	if (m === 0) return 0;
	return (stddev(values) / m) * 100;
}

export function summarizeTimings(samplesMs: number[]): {
	medianMs: number;
	p95Ms: number;
	p99Ms: number;
	opsPerSecond: number;
} {
	const filtered = filterOutliers(samplesMs);
	const medianMs = median(filtered);
	const p95Ms = percentile(filtered, 95);
	const p99Ms = percentile(filtered, 99);
	const opsPerSecond = medianMs > 0 ? 1000 / medianMs : Infinity;

	return { medianMs, p95Ms, p99Ms, opsPerSecond };
}
