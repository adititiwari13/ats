/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#0F172A',
        'app-card': '#1E293B',
        'app-primary': '#8B5CF6',
        'app-primary-hover': '#7C3AED',
        'app-text': '#F1F5F9',
        'app-subtext': '#94A3B8',
        'app-border': '#334155',
        'glow-purple': 'rgba(139, 92, 246, 0.4)',
      },
      boxShadow: {
        'premium': '0 0 20px rgba(139, 92, 246, 0.4)',
        'premium-lg': '0 0 30px rgba(139, 92, 246, 0.5)',
      }
    },
  },
  plugins: [],
}

