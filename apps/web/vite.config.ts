import { defineConfig, splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [splitVendorChunkPlugin()],
	css: {
		modules: {
			localsConvention: 'dashes',
		},
	},
});
