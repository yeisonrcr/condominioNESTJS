import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales del condominio - ADMIN
        primary: {
          DEFAULT: '#4a5568',      // Gris azulado
          dark: '#2d3748',
          light: '#718096',
          lightest: '#edf2f7',
          50: '#f7fafc',
          100: '#edf2f7',
          200: '#e2e8f0',
          300: '#cbd5e0',
          400: '#a0aec0',
          500: '#718096',
          600: '#4a5568',           // Base
          700: '#2d3748',
          800: '#1a202c',
          900: '#171923',
        },
        secondary: {
          DEFAULT: '#b2b65e',      // Verde oliva (del condominio)
          dark: '#9aa04d',
          light: '#c5ca7f',
          lightest: '#f2f4e8',
          50: '#f2f4e8',
          100: '#e5e9d1',
          200: '#c5ca7f',
          300: '#b2b65e',
          400: '#b2b65e',
          500: '#b2b65e',           // Base
          600: '#9aa04d',
          700: '#7d8340',
          800: '#636733',
          900: '#4a4d26',
        },
        accent: {
          DEFAULT: '#f4b451',      // Naranja dorado (para destacados)
          dark: '#e09a35',
          light: '#f7c876',
          50: '#fef4e5',
          100: '#fde9c8',
          200: '#fbd87a',
          300: '#f7c876',
          400: '#f4b451',
          500: '#f4b451',           // Base
          600: '#e09a35',
          700: '#c8822a',
          800: '#a66b22',
          900: '#85551b',
        },
        // Estados
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#d97706',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#dc2626',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#dbeafe',
          dark: '#2563eb',
        },
      },
      boxShadow: {
        'btn': '0 2px 8px rgba(74, 85, 104, 0.25)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.07)',
      },
    },
  },
  plugins: [],
};

export default config;