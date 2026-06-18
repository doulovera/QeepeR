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
        background: 'var(--background)',
        'secondary-background': 'var(--secondary-background)',
        foreground: 'var(--foreground)',
        'main-foreground': 'var(--main-foreground)',
        main: 'var(--main)',
        border: 'var(--border)',
        overlay: 'var(--overlay)',
        ring: 'var(--ring)',
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
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
        base: 'var(--radius-base)',
      },
      borderWidth: {
        base: '1px',
      },
      boxShadow: {
        shadow: 'var(--shadow)',
        light: '4px 4px 0px 0px #000',
        dark: '4px 4px 0px 0px #000',
      },
      translate: {
        boxShadowX: 'var(--box-shadow-x)',
        boxShadowY: 'var(--box-shadow-y)',
        reverseBoxShadowX: 'var(--reverse-box-shadow-x)',
        reverseBoxShadowY: 'var(--reverse-box-shadow-y)',
      },
      fontWeight: {
        base: 'var(--font-weight-base)',
        heading: 'var(--font-weight-heading)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pop: {
          '50%': { transform: 'scale(1.2)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.1s ease-in-out',
        pop: 'pop 0.2s',
      },
    },
  },
  plugins: [],
}
export default config
