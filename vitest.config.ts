import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Usamos jsdom para simular navegador en tests de componentes React.
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
