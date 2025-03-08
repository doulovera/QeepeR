import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          '100': '#E3DFF2',
          '400': '#A388EE',
          '600': '#826dbe',
          '800': '#5c498e',
        },
        secondary: {
          '400': '#A3E636',
        },
        base: {
          '400': '#1D1F27',
        },
      },
      borderRadius: {
        base: '6px',
      },
      boxShadow: {
        light: '4px 4px 0px 0px #000',
        dark: '4px 4px 0px 0px #000',
      },
      translate: {
        boxShadowX: '4px',
        boxShadowY: '4px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop': {
          '50%': { transform: 'scale(1.2)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.1s ease-in-out',
        'pop': 'pop 0.2s',
      }
    },
  },
  plugins: [],
}
export default config
