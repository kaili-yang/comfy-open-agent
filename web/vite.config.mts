import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

// ComfyUI serves web/dist at /extensions/<pack>/, so the frontend's own
// modules (/scripts/*.js) are two directories up. Rollup rewrites
// relative externals against outDir, hence the explicit output paths.
const COMFY_MODULES = ['app', 'api']
const comfyModule = (id: string) =>
  COMFY_MODULES.find((name) => id.endsWith(`/scripts/${name}.js`))

export default defineConfig({
  plugins: [vue(), cssInjectedByJs()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
      fileName: () => 'comfy-open-agent.js'
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      external: (id) => comfyModule(id) !== undefined,
      output: {
        inlineDynamicImports: true,
        paths: (id) => {
          const name = comfyModule(id)
          return name ? `../../scripts/${name}.js` : id
        }
      }
    }
  }
})
