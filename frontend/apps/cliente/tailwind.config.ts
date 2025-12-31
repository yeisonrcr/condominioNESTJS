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
        // Colores principales del condominio - RESIDENTES
        primary: {
          DEFAULT: '#f4b451',      // Naranja dorado
          dark: '#e09a35',
          light: '#f7c876',
          lightest: '#fef4e5',
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
        secondary: {
          DEFAULT: '#b2b65e',      // Verde oliva
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
          DEFAULT: '#fac953',      // Amarillo brillante
          dark: '#e0b03a',
          light: '#fbd87a',
          50: '#fef9e7',
          100: '#fef3cf',
          200: '#fde79f',
          300: '#fbd87a',
          400: '#fac953',
          500: '#fac953',           // Base
          600: '#e0b03a',
          700: '#c79421',
          800: '#9f7519',
          900: '#775812',
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
        'btn': '0 2px 8px rgba(244, 180, 81, 0.25)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.07)',
      },
    },
  },
  plugins: [],
};

export default config;