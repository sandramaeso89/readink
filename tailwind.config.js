/** @type {import('tailwindcss').Config} */

// Configuración de Tailwind CSS
export default {
  // Le decimos a Tailwind en qué archivos tiene que buscar
  // las clases que usamos, para incluir solo las necesarias
  content: [
    "./index.html",                    // El HTML principal
    "./src/**/*.{js,ts,jsx,tsx}",      // Todos los archivos de src
  ],
  theme: {
    extend: {
      // Paleta morada para la estética que pediste.
      colors: {
        brand: {
          900: '#0b0b16', // Fondo principal oscuro púrpura
          800: '#16162a', // Superficies oscuras
          700: '#7c3aed', // Púrpura fuerte para hover
          accent: '#c084fc', // Acento lila claro
          500: '#8b5cf6', // Púrpura principal
          200: '#f3e8ff', // Texto claro principal
          100: '#c4b5fd', // Texto secundario suave
          redDark: '#6d28d9', // Púrpura oscuro auxiliar (mantengo clave por compatibilidad)
        },
      },
    },
  },
  plugins: [
    // Aquí se añaden plugins extra de Tailwind si los necesitamos
    // Por ahora ninguno
  ],
}

