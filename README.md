# Aho-Corasick Benchmarks

Benchmarking suite for Aho-Corasick implementations available on npm. Measures search throughput, latency, compile time, memory overhead, and match correctness across multiple scenarios.

## Implementations Tested

| Package | Type |
|---|---|
| [modern-ahocorasick](https://www.npmjs.com/package/modern-ahocorasick) | Pure JS |
| [ahocorasick](https://www.npmjs.com/package/ahocorasick) (BrunoRB) | Pure JS |
| [@tanishiking/aho-corasick](https://www.npmjs.com/package/@tanishiking/aho-corasick) | Pure JS |
| [aho-corasick2](https://www.npmjs.com/package/aho-corasick2) | Pure JS |
| [@blackglory/aho-corasick](https://www.npmjs.com/package/@blackglory/aho-corasick) | Native (Rust) |
| [@monyone/aho-corasick](https://www.npmjs.com/package/@monyone/aho-corasick) | Pure JS |

## Quick Start

```bash
pnpm install
pnpm --filter bench setup-corpus
pnpm bench
```

Results are written to `bench/results/` as CSV, Markdown, and a standalone HTML dashboard.

## Project Structure

```
bench/          Benchmarking tool (adapters, runner, reporters)
web/            Dashboard UI (Vite + React + recharts)
```

### `bench/`

- `src/implementations/` -- adapter for each npm package behind a unified interface
- `src/corpus/` -- pattern sets and text corpuses (small, medium, large)
- `src/scenarios/` -- benchmark scenario definitions
- `src/runner.ts` -- core benchmark loop (compile time, search ops/sec, latency percentiles, memory delta)
- `src/reporter/` -- CSV and Markdown output

### `web/`

Single-page dashboard that embeds the latest benchmark CSV at build time. Can also load any CSV via the header button. Built as a standalone HTML file -- no server required.

## Scripts

| Command | Description |
|---|---|
| `pnpm bench` | Run full benchmarks and build the dashboard |
| `pnpm bench:post` | Rebuild dashboard HTML from existing results |
| `pnpm --filter bench bench:quick` | Quick run with fewer iterations |
| `pnpm --filter bench setup-corpus` | Download large text corpus |
| `pnpm build:web` | Build the dashboard UI |

## CI

The GitHub Actions workflow (`.github/workflows/benchmark.yml`) runs the full suite on push to `main` and uploads results as artifacts.

## License

ISC
