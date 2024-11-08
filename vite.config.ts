import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  // @ts-expect-error complains the `background` field shouldn't be there, but that's how to use service worker according to the docs
  plugins: [react(), crx({ manifest })],
  preview: {
    proxy: {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
