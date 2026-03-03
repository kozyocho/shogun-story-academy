import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a1a',
        paper: '#f7f3ea',
        sakura: '#d97795',
        pine: '#2f4f3f',
        moon: '#1f2937'
      },
      boxShadow: {
        card: '0 8px 30px rgba(20, 20, 20, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
