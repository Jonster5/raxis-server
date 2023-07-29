import * as esbuild from 'esbuild';
import { $ } from 'execa';
import path from 'path';

/** @type {esbuild.BuildContext} */
const ctx = await esbuild.context({
	entryPoints: ['src/main.ts'],
	outdir: '.dev',
	bundle: true,
	platform: 'node',
	format: 'esm',
	packages: 'external',
	alias: {
		'raxis-server': './lib/main',
	},
});

await ctx.watch();
console.log('\x1b[92m Watching... \x1b[0m');

await $({ stdio: 'inherit' })`node --no-warnings --watch .dev/main.js`;
