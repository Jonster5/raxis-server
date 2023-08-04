import * as esbuild from 'esbuild';
import { $ } from 'execa';
import path from 'path';

/** @type {esbuild.BuildContext} */
const ctx = await esbuild.context({
	entryPoints: ['src/main.ts'],
	outdir: '.dev',
	bundle: true,
	sourcemap: 'both',
	platform: 'node',
	format: 'esm',
	packages: 'external',
	alias: {
		'raxis-server': './lib/main',
	},
});

await ctx.watch();

await $({ stdio: 'inherit' })`node --enable-source-maps --no-warnings --watch .dev/main.js`;
