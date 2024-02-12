import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary': {
          '50': '#b4cbee',
          '100': '#a4c2ea',
          '200': '#8db0e2',
          '300': '#689bd9',
          '400': '#407ece',
          '500': '#3161b4',
          '600': '#2f4d93',
          '700': '#2c3f7d',
          '800': '#24305c',
          '900': '#1c2540',
          '950': '#181e34',
        },
        'secondary': {
          '50': '#f9f7f7',
          '100': '#f2eeef',
          '200': '#e7e1e2',
          '300': '#d6cbcc',
          '400': '#c2b2b4',
          '500': '#a48f92',
          '600': '#8d7578',
          '700': '#756063',
          '800': '#625254',
          '900': '#54484a',
          '950': '#2b2425',
      },
      
      }
    },
  },
  plugins: [],
};
export default config;
