import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    host: true,             // allow all hosts
    port: 5173,
    strictPort: true,
    allowedHosts: ["yogsaathi.com", "www.yogsaathi.com"]
  }
});
