import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          tint: "hsl(var(--primary-tint))",
          50: 'hsl(350, 75%, 95%)',
          100: 'hsl(350, 75%, 85%)',
          200: 'hsl(350, 75%, 75%)',
          300: 'hsl(350, 75%, 65%)',
          400: 'hsl(350, 75%, 55%)',
          500: 'hsl(350, 75%, 45%)',
          600: 'hsl(350, 75%, 38%)',
          700: 'hsl(350, 75%, 32%)',
          800: 'hsl(350, 75%, 26%)',
          900: 'hsl(350, 75%, 20%)'
        },
        dark: {
          900: '#0b0b10',
          800: '#121216',
          700: '#18181d'
        },
        android: '#10b981',
        ios: '#0ea5e9',
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: '0 10px 25px rgba(0, 0, 0, 0.04)',
        soft: '0 4px 12px rgba(0,0,0,0.03)',
        header: '0 2px 10px rgba(0, 0, 0, 0.02)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config

