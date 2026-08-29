/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#050914",       // Deeper near-black background
          card: "rgba(17, 26, 46, 0.6)", // Glass card background
          glass: "rgba(255, 255, 255, 0.03)", 
          border: "rgba(255, 255, 255, 0.08)", // Subtle glass border
          accent: "#38BDF8",     // Cybersecurity cyan
          hover: "#0EA5E9",      // Hover states
          green: "#10B981",      // Success / Safe states
          red: "#EF4444",        // Danger / Scam states
          yellow: "#F59E0B",     // Warning / Pending states
          text: "#F8FAFC",       // High contrast text
          muted: "#94A3B8"       // Muted/secondary labels
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scan': 'scan 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
