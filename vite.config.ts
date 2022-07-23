import Path from "path";
import { defineConfig, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import V from "rollup-plugin-visualizer";
// import build from "./plugin";
import build from "vite-plugin-vue-scaffold-build";

const plugins: PluginOption[] = [
  vue(),
  build({
    // input: "src\\components\\workspace",
    // withVue: false,
    // buildComponents: true,
    buildProject: true
  }),
  V({
    filename: "outputs/v.html",
    open: process.env?.NODE_ENV === "production"
  })
];

export default defineConfig(() => {
  return {
    plugins,
    envDir: "envs",
    resolve: {
      alias: {
        Types: Path.resolve(__dirname, "src/typings"),
        Components: Path.resolve(__dirname, "src/components"),
        Views: Path.resolve(__dirname, "src/views"),
        Api: Path.resolve(__dirname, "src/api/modules"),

        //* 最新
        "@Api": Path.resolve(__dirname, "src/api/modules"),
        "@Service": Path.resolve(__dirname, "src/service"),

        //* 旧的别名
        "CC": Path.resolve(__dirname, "src/components/common"),
        "FC": Path.resolve(__dirname, "src/components/front"),
        "BC": Path.resolve(__dirname, "src/components/back"),
        "FV": Path.resolve(__dirname, "src/views/front"),
        "BV": Path.resolve(__dirname, "src/views/back"),
        "CV": Path.resolve(__dirname, "src/views/common"),
        "SV": Path.resolve(__dirname, "src/views/system"),
        "AM": Path.resolve(__dirname, "src/api/modules"),
      }
    },
    build: {
      minify: false,
      rollupOptions: {
        output: {
          chunkFileNames(chunkInfo) {
            const firstModulePath = Object.keys(chunkInfo.modules)[0];
            if (firstModulePath.includes("node_modules")) {
              return `assets/js/modules/${chunkInfo.name}-[hash].js`;
            }

            return `assets/js/apps/${chunkInfo.name}-[hash].js`;
          },
          manualChunks: {
            "naive-ui": ["naive-ui"],
            "vuedraggable-es": ["vuedraggable-es"],
            "vant": ["vant"],
            "vue": ["vue", "plugin-vue:export-helper"],
            "vite": ["vite/modulepreload-polyfill"],
            "vue-router": ["vue-router"],
            "dayjs": ["dayjs"],
            "highlight": ["highlight.js"]
          }
        }
      }
    }
  }
})
