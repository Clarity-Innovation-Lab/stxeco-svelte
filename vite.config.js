import { sveltekit } from "@sveltejs/kit/vite";
// import { defineConfig } from "vite";
import polyfillNode from "rollup-plugin-polyfill-node";
import inject from "@rollup/plugin-inject";

const config = {
  kit: {
    vite: {
      optimizeDeps: {
        entries: []
      },
      ssr: {
        noExternal: ['@popperjs/core', 'dayjs']
      }
    }
  },
  plugins: [polyfillNode(), sveltekit()],
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ["buffer", "Buffer"] })],
    },
  },

  optimizeDeps: {
    exclude: ["web3"], // <= The libraries that need shimming should be excluded from dependency optimization.
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
};
export default config