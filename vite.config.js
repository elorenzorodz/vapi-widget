import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      features: {
        customElement: true,
      },
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "vapi-widget",
        },
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "./src/main.js"),
      name: "VapiWidget",
      fileName: (format) => `vapi-widget.${format}.js`,
      formats: ["iife"],
    },
    emptyOutDir: true,
    cssCodeSplit: false,
    target: "esnext",
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env": "({})",
      global: "window",
    },
  },
});
