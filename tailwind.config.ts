import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B1A15',
          950: '#07120E',
          900: '#0B1A15',
          800: '#12261F',
          700: '#1A342B',
          600: '#244639',
          500: '#2F5A4A',
        },
        chalk: {
          DEFAULT: '#F5F1E8',
          soft: '#E4DFD3',
          mute: '#A8B9AF',
          dim: '#6F8A7D',
        },
        butter: {
          DEFAULT: '#F7C948',
          deep: '#D9A81C',
          soft: '#FFE38F',
          ink: '#2A2205',
        },
        tomato: {
          DEFAULT: '#FF4B3E',
          deep: '#D8362B',
          soft: '#FF8A80',
          ink: '#3A0A07',
        },
        basil: {
          DEFAULT: '#3FD68F',
          deep: '#1FA86A',
          ink: '#05301C',
        },
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', '"Segoe UI Variable"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '28px',
        sticker: '999px',
      },
      boxShadow: {
        card: '0 24px 48px -20px rgba(0,0,0,0.65), 0 6px 14px -8px rgba(0,0,0,0.5)',
        float: '0 14px 30px -12px rgba(0,0,0,0.6)',
        sticker: '0 4px 10px -4px rgba(0,0,0,0.45)',
        butter: '0 14px 30px -10px rgba(247,201,72,0.55)',
        tomato: '0 14px 30px -10px rgba(255,75,62,0.6)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        wiggle: 'wiggle 1.2s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
