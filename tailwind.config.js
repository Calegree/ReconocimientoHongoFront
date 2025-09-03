/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        // Nueva paleta de colores
        background: '#E6D7B8',      // Fondo principal - Beige claro
        sand: '#C2A878',            // Botones/elementos destacados - Marrón arena
        text: '#5A4633',            // Texto principal - Marrón oscuro
        'text-deep': '#3B2C23',     // Texto alternativo/sombras - Gris profundo
        hover: '#8B6E45',           // Estados hover/activos
        border: '#3B2C23',          // Bordes/sombras
        
        // Mantener colores primarios para compatibilidad
        primary: {
          50: '#f7f3ed',
          100: '#ede3d1',
          200: '#dcc5a6',
          300: '#c2a878',
          400: '#b59660',
          500: '#a4834a',
          600: '#8b6e45',
          700: '#72583a',
          800: '#5a4633',
          900: '#3b2c23'
        }
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
