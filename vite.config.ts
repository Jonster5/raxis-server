import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [dts({ insertTypesEntry: true })],
	build: {
		lib: {
			entry: './src/main.ts',
			name: 'raxis',
			fileName: (f, n) => `raxis-server-${n}.${f === 'cjs' ? f : 'js'}`,
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: ['raxis-ecs', 'http', 'path', 'ws'],
		},
	},
});
