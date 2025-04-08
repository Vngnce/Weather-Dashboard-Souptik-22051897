/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Scans files in src directory
    ],
    theme: {
      extend: {
        // Add custom animations for various effects
        animation: {
          'fadeIn': 'fadeIn 0.5s ease-out forwards',
          'fadeInDown': 'fadeInDown 0.5s ease-out forwards',
          'fadeInUp': 'fadeInUp 0.5s ease-out forwards',
          'fadeInLeft': 'fadeInLeft 0.5s ease-out forwards',
          'fadeInRight': 'fadeInRight 0.5s ease-out forwards',
          'bounce-subtle': 'bounceSubtle 2s infinite',
          'spin-slow': 'spin 3s linear infinite',
          'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          fadeInDown: {
            '0%': { opacity: '0', transform: 'translateY(-10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeInUp: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeInLeft: {
            '0%': { opacity: '0', transform: 'translateX(-10px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          fadeInRight: {
            '0%': { opacity: '0', transform: 'translateX(10px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          bounceSubtle: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
          },
          shake: {
            '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
            '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
            '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
            '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
          },
        },
        // Add custom breakpoint for extra small screens
        screens: {
          'xs': '480px',
        },
        // Add custom shadow for hover effects
        boxShadow: {
          '3xl': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    plugins: [],
  }