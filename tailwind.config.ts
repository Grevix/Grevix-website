import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#050609',
        surface: {
          DEFAULT: '#0B0D14',
          subtle: '#0E111A',
          hover: '#131826',
        },
        border: {
          subtle: '#1E2330',
          hover: '#2D3548',
          accent: '#6F9FFF',
        },
        brand: {
          ice: '#6F9FFF',
          violet: '#7773A8',
          white: '#F4F5F6',
          steel: '#8D98A8',
          muted: '#5A6475',
        },
        state: {
          live: '#10B981',
          warn: '#F59E0B',
          ended: '#5A6475',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
