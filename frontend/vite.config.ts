import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          chakra: ["@chakra-ui/react", "@chakra-ui/icons"],
          pdf: ["jspdf"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["@chakra-ui/react", "@chakra-ui/icons", "jspdf"],
  },
});
