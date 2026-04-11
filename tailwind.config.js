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
      // Aquí podríamos añadir colores, fuentes o tamaños personalizados
      // Por ahora lo dejamos vacío
    },
  },
  plugins: [
    // Aquí se añaden plugins extra de Tailwind si los necesitamos
    // Por ahora ninguno
  ],
}

