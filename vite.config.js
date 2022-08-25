import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
//import polyfillNode from 'rollup-plugin-polyfill-node';
//import inject from '@rollup/plugin-inject';
import { resolve } from "path";

export default defineConfig({
  plugins: [sveltekit()],
	resolve: {
		alias: {
			//$lib: resolve("src/lib"),
			$stores: resolve("src/stores"),
			$types: resolve("src/types"),
			$transitions: resolve("src/transitions")
		}
	},

  optimizeDeps: {
    exclude: ['web3'], // <= The libraries that need shimming should be excluded from dependency optimization.
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
});
