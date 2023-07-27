import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [dts({ insertTypesEntry: true, exclude: 'src' })],
	build: {
		lib: {
			entry: './lib/main.ts',
			name: 'raxis',
			fileName: (f, n) => `raxis-server-${n}.${f === 'cjs' ? f : 'js'}`,
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: ['raxis', 'http', 'path', 'ws'],
		},
	},
});
