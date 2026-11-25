import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "es2022",
    // Phaser本体だけで1MBを超えるため、警告の基準を上げておく
    chunkSizeWarningLimit: 2000,
  },
});
