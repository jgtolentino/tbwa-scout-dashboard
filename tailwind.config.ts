import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tbwa-yellow': '#FFD700',
        'tbwa-black': '#000000',
        'tbwa-white': '#FFFFFF',
        'tbwa-gray': '#4A4A4A',
        'tbwa-light-gray': '#F5F5F5',
        'tbwa-dark-yellow': '#E6C200',
        'tbwa-blue': '#1E40AF',
      },
    },
  },
  plugins: [],
}
export default config