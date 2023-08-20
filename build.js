import * as esbuild from 'esbuild';

async function buildFor(format) {
	/** @type {esbuild.BuildOptions} */
	const config = {
		entryPoints: ['./lib/main.ts'],
		bundle: true,
		packages: 'external',
		minify: true,
		keepNames: true,
		sourcemap: true,
		platform: 'node',
		target: ['node18.0'],
		format,
		outfile: `dist/main.${format === 'esm' ? 'js' : 'cjs'}`,
		tsconfig: './tsconfig.json',
	};

	await esbuild.build(config);
}

await buildFor('esm');
await buildFor('cjs');
