import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    /* 3Dmol.js (visor de MRP4) ocupa ~550 kB y ya se carga bajo demanda, solo
       al abrir ese proyecto. El límite sube lo justo para él; el bundle
       principal (~350 kB) sigue muy por debajo y vigilado. */
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      onwarn(warning, defaultHandler) {
        // El `eval` interno de 3Dmol es de la librería, no de este código.
        // Solo se silencia ese caso; cualquier otro aviso se sigue mostrando.
        const where = warning.id ?? warning.loc?.file ?? ''
        if (warning.code === 'EVAL' && where.includes('node_modules/3dmol')) return
        defaultHandler(warning)
      },
    },
  },
})
