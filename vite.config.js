import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Local only: send /api requests to the Express server on port 5000
    proxy: { "/api": "http://localhost:5000" }
  }
});
